/**
 * Strongly typed demo fixtures for UnderstandGuard
 * Matches schemas defined in spec.md
 */

export interface DiffMetadata {
  file: string;
  totalAdditions: number;
  totalDeletions: number;
  criticalFunctions: {
    name: string;
    startLine: number;
    endLine: number;
    riskCategory: "CONCURRENCY" | "AUTH_STATE" | "ERROR_HANDLING" | "NETWORK";
  }[];
}

export interface InterviewQuestion {
  id: string;
  targetLine: number;
  targetFunction: string;
  prompt: string;
  contextSnippet: string;
  expectedInsight: string;
}

export interface QuestionEvaluation {
  questionId: string;
  score: number;
  isVague: boolean;
  critique: string;
  identifiedBlindSpot?: string;
}

export interface AdversarialTest {
  targetFunction: string;
  targetLine: number;
  testFramework: "vitest";
  testCode: string;
  assertionFailure: string;
  vulnerabilityExplanation: string;
}

export interface RubricScores {
  technicalSpecificity: number;
  concurrencyAwareness: number;
  mitigationAccuracy: number;
  critique: string;
}

export interface MentorExplanation {
  seniorPerspective: string;
  recommendedFix: string;
}

export interface EvaluationResult {
  comprehensionScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  verdictBadge: "Safe to Review" | "High Cognitive Debt – Review Required";
  flaggedFunction: string;
  flaggedReason: string;
  rubricScores?: RubricScores;
  mentorExplanation?: MentorExplanation;
  adversarialTest: AdversarialTest;
  cognitiveMapMarkdown: string;
}

export const DEMO_DIFF_TEXT = `--- a/src/auth.ts
+++ b/src/auth.ts
@@ -35,32 +35,42 @@ interface SessionTokens {
   refreshToken: string;
   expiresAt: number;
 }

+// AI-Generated Token Refresh Flow
+let activeTokens: SessionTokens | null = null;

+export async function refreshToken(): Promise<string> {
+  const storedRefreshToken = getStoredRefreshToken();
+  if (!storedRefreshToken) {
+    throw new Error("No refresh token available");
+  }
+
+  try {
+    const response = await fetch("/api/v1/auth/refresh", {
+      method: "POST",
+      headers: { "Content-Type": "application/json" },
+      body: JSON.stringify({ token: storedRefreshToken }),
+    });
+
+    if (!response.ok) {
+      throw new Error(\`Token refresh failed with status \${response.status}\`);
+    }
+
+    const data = await response.json();
+    activeTokens = {
+      accessToken: data.accessToken,
+      refreshToken: data.refreshToken,
+      expiresAt: Date.now() + data.expiresIn * 1000,
+    };
+
+    saveStoredTokens(activeTokens);
+    return activeTokens.accessToken;
+  } catch (error) {
+    clearStoredTokens();
+    throw error;
+  }
+}`;

export const DEMO_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q1",
    targetLine: 41,
    targetFunction: "refreshToken()",
    prompt:
      "Line 41 retrieves the stored token before calling the endpoint. Where is this persisted, and how does your application ensure memory tokens stay in sync with storage across browser tabs?",
    contextSnippet: "const storedRefreshToken = getStoredRefreshToken();",
    expectedInsight:
      "Clarify token persistence mechanism (localStorage vs HTTP-only cookie) and state sync.",
  },
  {
    id: "q2",
    targetLine: 48,
    targetFunction: "refreshToken()",
    prompt:
      "Lines 48–54 fire a network fetch to refresh the token. What happens if two separate components trigger concurrent API calls that both receive a 401 at the exact same millisecond?",
    contextSnippet:
      "const response = await fetch('/api/v1/auth/refresh', ...);",
    expectedInsight:
      "Identify that simultaneous calls will fire duplicate refresh requests without an in-flight promise lock, causing token reuse rotation errors.",
  },
  {
    id: "q3",
    targetLine: 70,
    targetFunction: "refreshToken()",
    prompt:
      "In line 71, the catch block executes clearStoredTokens() on any caught error. What happens if the endpoint returns HTTP 429 (Rate Limit) or an intermittent network timeout?",
    contextSnippet:
      "} catch (error) { clearStoredTokens(); throw error; }",
    expectedInsight:
      "Explain that transient network hiccups or rate limits will mistakenly log out the user rather than triggering exponential backoff retry.",
  },
];

export const DEMO_SAMPLE_ANSWERS = {
  q1: "Lines 41-45 read the token from secure storage and send a POST request. Stored tokens are refreshed in activeTokens and written back using saveStoredTokens.",
  q2: "It handles errors gracefully and retries if needed through the try/catch block.",
  q3: "Catch block logs out on all errors without backoff.",
};

export const DEMO_EVALUATION: EvaluationResult = {
  comprehensionScore: 63,
  riskLevel: "HIGH",
  verdictBadge: "High Cognitive Debt – Review Required",
  flaggedFunction: "refreshToken() (Lines 40–74)",
  flaggedReason:
    "Author could not explain concurrent execution behavior. Risk of race condition in production.",
  rubricScores: {
    technicalSpecificity: 5,
    concurrencyAwareness: 2,
    mitigationAccuracy: 4,
    critique:
      "The author provided a surface-level answer ('handles errors gracefully') with zero mention of in-flight mutex deduplication or token rotation. In production, simultaneous 401s will trigger invalid token reuse conflicts.",
  },
  mentorExplanation: {
    seniorPerspective:
      "When handling authentication token refresh, network requests are asynchronous and independent. If multiple requests fail with 401 simultaneously, they all invoke refreshToken(). Without an in-flight promise lock, the first request rotates the token, and the subsequent requests send an already-invalidated token, causing the server to revoke the session and force-logout the user.",
    recommendedFix: `// Add in-flight promise deduplication:
let refreshPromise: Promise<string> | null = null;

export function refreshToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;
  
  refreshPromise = performTokenRefresh().finally(() => {
    refreshPromise = null; // Clean up lock on completion
  });
  
  return refreshPromise;
}`,
  },
  adversarialTest: {
    targetFunction: "refreshToken()",
    targetLine: 48,
    testFramework: "vitest",
    testCode: `import { describe, it, expect, vi } from 'vitest';
import { refreshToken } from './auth';

describe('UnderstandGuard Adversarial Suite: auth.ts', () => {
  it('fails when concurrent 401s fire duplicate refresh requests without a mutex', async () => {
    // Simulate 2 parallel calls made at the same millisecond
    const [call1, call2] = await Promise.allSettled([
      refreshToken(),
      refreshToken()
    ]);

    // Both calls must succeed using a single shared in-flight promise
    expect(call1.status).toBe('fulfilled');
    expect(call2.status).toBe('fulfilled');
    // ❌ Assertion Failure:
    // expect(call2.status).toBe('fulfilled') // Received: 'rejected' (Token rotation conflict: HTTP 409/500)
  });
});`,
    assertionFailure:
      "expect(call2.status).toBe('fulfilled') // ❌ Received: 'rejected' (500: Token already rotated by concurrent request)",
    vulnerabilityExplanation:
      "Without an in-flight Promise mutex (e.g., let refreshPromise = null), concurrent requests fire duplicate refresh calls with the same old refresh token. The server invalidates the token family on second attempt, destroying user sessions.",
  },
  cognitiveMapMarkdown: `# COGNITIVE MAP: src/auth.ts

**Verdict:** 🚨 **High Cognitive Debt – Review Required**  
**Comprehension Score:** 63/100  
**Primary Blind Spot:** Missing Concurrency Lock in \`refreshToken()\`  

### Component Flow & Collision Point
\`\`\`mermaid
sequenceDiagram
    autonumber
    participant ComponentA as Component A (401)
    participant ComponentB as Component B (401)
    participant Client as UnderstandGuard Client
    participant AuthServer as /api/v1/auth/refresh

    ComponentA->>Client: Call refreshToken() [Token: RT_1]
    ComponentB->>Client: Call refreshToken() [Token: RT_1] (Concurrent!)
    Client->>AuthServer: Request 1 (uses RT_1)
    Client->>AuthServer: Request 2 (uses RT_1)
    AuthServer-->>Client: Request 1 Success -> Issues RT_2, AT_2
    Note over AuthServer,Client: RT_1 is now invalidated by server rotation!
    AuthServer-->>Client: Request 2 Fails (401/409 Reused Token!)
    Client->>Client: clearStoredTokens() -> User unexpectedly logged out!
\`\`\`

### Mitigation Recommendation
Implement an in-flight promise cache:
\`\`\`typescript
let inFlightRefresh: Promise<string> | null = null;
export function refreshToken(): Promise<string> {
  if (inFlightRefresh) return inFlightRefresh;
  inFlightRefresh = performRefresh().finally(() => { inFlightRefresh = null; });
  return inFlightRefresh;
}
\`\`\``,
};
