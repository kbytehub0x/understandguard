import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  DEMO_QUESTIONS,
  DEMO_EVALUATION,
  InterviewQuestion,
  EvaluationResult,
} from "../fixtures/demoData";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateInterviewQuestions(
  diffText: string,
  isMock: boolean = false
): Promise<InterviewQuestion[]> {
  if (isMock || !genAI) {
    return DEMO_QUESTIONS;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are UnderstandGuard, an elite code reviewer. Your job is to test if a developer genuinely understands an AI-generated Git diff or if they blindly accepted it (accumulating Cognitive Debt).

Git Diff:
\`\`\`diff
${diffText}
\`\`\`

Generate exactly 3 targeted technical questions to test comprehension:
1. Every question MUST explicitly reference an exact line number or function name.
2. Probe failure modes, async flow, state sync, or race conditions.
3. Return STRICT JSON array matching this format:
[
  {
    "id": "q1",
    "targetLine": 41,
    "targetFunction": "functionName",
    "prompt": "Question text citing line number",
    "contextSnippet": "code snippet",
    "expectedInsight": "what a competent engineer should explain"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn("Gemini API error, falling back to deterministic fixture:", error);
    return DEMO_QUESTIONS;
  }
}

export async function evaluateDeveloperAnswers(
  diffText: string,
  answers: { questionId: string; userAnswer: string }[],
  isMock: boolean = false
): Promise<EvaluationResult> {
  if (isMock || !genAI) {
    return DEMO_EVALUATION;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are UnderstandGuard. Evaluate developer responses to interview questions regarding this Git diff to determine if they understand the code or provided vague, superficial hand-waving answers.

Git Diff:
\`\`\`diff
${diffText}
\`\`\`

Developer Responses:
${JSON.stringify(answers, null, 2)}

Scoring rules:
- Vague non-answers (e.g. "It handles errors gracefully", "standard async logic") score <= 4, isVague = true.
- Exact technical reasoning score >= 8, isVague = false.
- If any answer is vague, flag that function as high cognitive debt, generate a targeted Vitest test demonstrating the failure, and return a COGNITIVE_MAP.md with a Mermaid diagram.

Return STRICT JSON matching this schema:
{
  "comprehensionScore": 63,
  "riskLevel": "HIGH",
  "verdictBadge": "High Cognitive Debt – Review Required",
  "flaggedFunction": "functionName()",
  "flaggedReason": "explanation of blind spot",
  "adversarialTest": {
    "targetFunction": "functionName",
    "targetLine": 48,
    "testFramework": "vitest",
    "testCode": "import { describe, it, expect } ...",
    "assertionFailure": "expect(...).toBe(...) // Received: ...",
    "vulnerabilityExplanation": "..."
  },
  "cognitiveMapMarkdown": "# COGNITIVE MAP ... [Mermaid diagram]"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn("Gemini API error, falling back to deterministic fixture:", error);
    return DEMO_EVALUATION;
  }
}
