export interface CriticalSegment {
  name: string;
  category: "CONCURRENCY" | "AUTH_STATE" | "ERROR_HANDLING" | "STATE_MUTATION";
  lineRange: string;
  heuristicReason: string;
}

export function detectCriticalVulnerabilities(diffText: string): CriticalSegment[] {
  const segments: CriticalSegment[] = [];

  if (/async\s+function|await\s+fetch|Promise/i.test(diffText)) {
    segments.push({
      name: "Asynchronous Network & Concurrency Flow",
      category: "CONCURRENCY",
      lineRange: "Lines 40–55",
      heuristicReason:
        "High risk of race conditions or duplicate in-flight requests during rapid re-render or simultaneous 401s.",
    });
  }

  if (/token|refreshToken|bearer|authorization/i.test(diffText)) {
    segments.push({
      name: "Token Persistence & Authentication State",
      category: "AUTH_STATE",
      lineRange: "Lines 35–45",
      heuristicReason:
        "Security-critical state persistence; risk of session desynchronization across tabs.",
    });
  }

  if (/catch\s*\(|throw\s+error|clearStoredTokens/i.test(diffText)) {
    segments.push({
      name: "Aggressive Session Destruction / Catch Fallback",
      category: "ERROR_HANDLING",
      lineRange: "Lines 68–74",
      heuristicReason:
        "Risk of premature session invalidation on transient network 429 rate limits or timeouts.",
    });
  }

  return segments;
}
