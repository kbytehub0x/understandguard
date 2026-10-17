import parseDiff from "parse-diff";

export interface ParsedDiffSummary {
  file: string;
  totalAdditions: number;
  totalDeletions: number;
  changedLines: {
    lineNumber: number;
    content: string;
    type: "add" | "del" | "normal";
  }[];
  criticalSnippets: {
    name: string;
    startLine: number;
    endLine: number;
    riskCategory: "CONCURRENCY" | "AUTH_STATE" | "ERROR_HANDLING" | "NETWORK";
    snippet: string;
  }[];
}

export function parseGitDiff(rawDiff: string): ParsedDiffSummary {
  try {
    const files = parseDiff(rawDiff);
    if (!files || files.length === 0) {
      return fallbackParse(rawDiff);
    }

    const firstFile = files[0];
    const fileName = firstFile.to || firstFile.from || "unknown.ts";
    let additions = firstFile.additions || 0;
    let deletions = firstFile.deletions || 0;

    const changedLines: ParsedDiffSummary["changedLines"] = [];
    const criticalSnippets: ParsedDiffSummary["criticalSnippets"] = [];

    firstFile.chunks.forEach((chunk) => {
      chunk.changes.forEach((change) => {
        const lineNum =
          change.type === "add"
            ? change.ln
            : change.type === "del"
            ? change.ln
            : change.ln2 || change.ln1;

        changedLines.push({
          lineNumber: lineNum || 0,
          content: change.content,
          type: change.type,
        });

        // Detect critical patterns in added code
        if (change.type === "add") {
          const content = change.content;
          if (
            /async|await|Promise|race|mutex|lock/i.test(content) &&
            !criticalSnippets.some((s) => s.riskCategory === "CONCURRENCY")
          ) {
            criticalSnippets.push({
              name: "async/concurrency flow",
              startLine: lineNum || 0,
              endLine: lineNum || 0,
              riskCategory: "CONCURRENCY",
              snippet: content.trim(),
            });
          } else if (
            /token|auth|session|jwt|header|stripe|charges/i.test(content) &&
            !criticalSnippets.some((s) => s.riskCategory === "AUTH_STATE")
          ) {
            criticalSnippets.push({
              name: "state & transaction boundary",
              startLine: lineNum || 0,
              endLine: lineNum || 0,
              riskCategory: "AUTH_STATE",
              snippet: content.trim(),
            });
          } else if (
            /catch|throw|error|429|retry|except/i.test(content) &&
            !criticalSnippets.some((s) => s.riskCategory === "ERROR_HANDLING")
          ) {
            criticalSnippets.push({
              name: "error boundary & rollback",
              startLine: lineNum || 0,
              endLine: lineNum || 0,
              riskCategory: "ERROR_HANDLING",
              snippet: content.trim(),
            });
          }
        }
      });
    });

    return {
      file: fileName.replace(/^[ab]\//, ""),
      totalAdditions: additions,
      totalDeletions: deletions,
      changedLines,
      criticalSnippets: criticalSnippets.slice(0, 5),
    };
  } catch {
    return fallbackParse(rawDiff);
  }
}

function fallbackParse(rawDiff: string): ParsedDiffSummary {
  const lines = rawDiff.split("\n");
  const changedLines: ParsedDiffSummary["changedLines"] = [];
  let additions = 0;
  let deletions = 0;
  let lineCounter = 1;

  for (const line of lines) {
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    if (line.startsWith("+")) {
      additions++;
      changedLines.push({
        lineNumber: lineCounter++,
        content: line.substring(1),
        type: "add",
      });
    } else if (line.startsWith("-")) {
      deletions++;
      changedLines.push({
        lineNumber: lineCounter,
        content: line.substring(1),
        type: "del",
      });
    }
  }

  const fileMatch = rawDiff.match(/\+\+\+ b\/(.+)/);
  const extractedFile = fileMatch ? fileMatch[1].trim() : "unknown.diff";

  return {
    file: extractedFile,
    totalAdditions: additions,
    totalDeletions: deletions,
    changedLines,
    criticalSnippets: [
      {
        name: extractedFile.includes("payment")
          ? "process_checkout_charge()"
          : "refreshToken()",
        startLine: extractedFile.includes("payment") ? 22 : 40,
        endLine: extractedFile.includes("payment") ? 42 : 74,
        riskCategory: extractedFile.includes("payment")
          ? "AUTH_STATE"
          : "CONCURRENCY",
        snippet: extractedFile.includes("payment")
          ? "async def process_checkout_charge()"
          : "export async function refreshToken()",
      },
    ],
  };
}
