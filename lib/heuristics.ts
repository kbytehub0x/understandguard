export interface CriticalSegment {
  name: string;
  category: "CONCURRENCY" | "AUTH_STATE" | "ERROR_HANDLING" | "STATE_MUTATION";
  lineRange: string;
  heuristicReason: string;
}

export function detectCriticalVulnerabilities(diffText: string): CriticalSegment[] {
  const segments: CriticalSegment[] = [];

  // JavaScript / TypeScript / Python / Go Concurrency & Async
  if (/async\s+function|await\s+fetch|Promise|async\s+def|await\s+asyncio|aiohttp|go\s+func|sync\.Mutex/i.test(diffText)) {
    segments.push({
      name: "Asynchronous Network & Concurrency Flow",
      category: "CONCURRENCY",
      lineRange: "Core Async Lines",
      heuristicReason:
        "High risk of race conditions, unhandled task timeouts, or duplicate in-flight requests during concurrent triggers.",
    });
  }

  // Token & Payment Idempotency State
  if (/token|refreshToken|bearer|authorization|stripe|charges\.create|idempotency/i.test(diffText)) {
    segments.push({
      name: "Authentication & Payment Idempotency State",
      category: "AUTH_STATE",
      lineRange: "State Mutation Lines",
      heuristicReason:
        "Security-critical state persistence or financial API calls; risk of session desync or duplicate billing without idempotency keys.",
    });
  }

  // Error boundaries, transactions, and rollback sagas
  if (/catch\s*\(|throw\s+error|clearStoredTokens|except\s+|raise\s+|conn\.transaction/i.test(diffText)) {
    segments.push({
      name: "Error Handling & Transaction Boundaries",
      category: "ERROR_HANDLING",
      lineRange: "Exception & Rollback Lines",
      heuristicReason:
        "Risk of premature session invalidation or uncommitted database state when upstream gateway calls fail.",
    });
  }

  return segments;
}
