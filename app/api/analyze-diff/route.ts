import { NextRequest, NextResponse } from "next/server";
import { parseGitDiff } from "@/lib/diff-parser";
import { generateInterviewQuestions } from "@/lib/gemini";
import { DEMO_DIFF_TEXT, DEMO_QUESTIONS } from "@/fixtures/demoData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const diff = body.diff || DEMO_DIFF_TEXT;
    const isMock = body.mock === true || req.nextUrl.searchParams.get("mock") === "true";

    if (isMock) {
      return NextResponse.json({
        file: "src/auth.ts",
        totalAdditions: 32,
        totalDeletions: 0,
        criticalFunctions: [
          {
            name: "refreshToken()",
            startLine: 40,
            endLine: 74,
            riskCategory: "CONCURRENCY",
          },
        ],
        questions: DEMO_QUESTIONS,
        isMock: true,
      });
    }

    const parsed = parseGitDiff(diff);
    const questions = await generateInterviewQuestions(diff, isMock);

    return NextResponse.json({
      file: parsed.file,
      totalAdditions: parsed.totalAdditions,
      totalDeletions: parsed.totalDeletions,
      criticalFunctions: parsed.criticalSnippets.map((s) => ({
        name: s.name,
        startLine: s.startLine,
        endLine: s.endLine,
        riskCategory: s.riskCategory,
      })),
      questions,
      isMock: false,
    });
  } catch (error) {
    console.error("Error in /api/analyze-diff:", error);
    return NextResponse.json(
      {
        file: "src/auth.ts",
        totalAdditions: 32,
        totalDeletions: 0,
        criticalFunctions: [
          {
            name: "refreshToken()",
            startLine: 40,
            endLine: 74,
            riskCategory: "CONCURRENCY",
          },
        ],
        questions: DEMO_QUESTIONS,
        isMock: true,
      },
      { status: 200 }
    );
  }
}
