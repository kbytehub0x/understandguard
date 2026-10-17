import { NextRequest, NextResponse } from "next/server";
import { evaluateDeveloperAnswers } from "@/lib/gemini";
import { DEMO_DIFF_TEXT, DEMO_EVALUATION } from "@/fixtures/demoData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const diff = body.diff || DEMO_DIFF_TEXT;
    const answers = body.answers || [];
    const isMock = body.mock === true || req.nextUrl.searchParams.get("mock") === "true";

    // If mock requested or testing with demo answers, return the rich deterministic evaluation
    if (isMock) {
      return NextResponse.json({
        ...DEMO_EVALUATION,
        isMock: true,
      });
    }

    const result = await evaluateDeveloperAnswers(diff, answers, isMock);
    return NextResponse.json({
      ...result,
      isMock: false,
    });
  } catch (error) {
    console.error("Error in /api/evaluate-interview:", error);
    return NextResponse.json(
      {
        ...DEMO_EVALUATION,
        isMock: true,
      },
      { status: 200 }
    );
  }
}
