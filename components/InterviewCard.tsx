"use client";

import { useState } from "react";
import { InterviewQuestion } from "@/fixtures/demoData";
import { HelpCircle, AlertTriangle, CheckCircle2, ChevronRight, Zap } from "lucide-react";

interface InterviewCardProps {
  questions: InterviewQuestion[];
  onComplete: (answers: { questionId: string; userAnswer: string }[]) => void;
  isLoading?: boolean;
  onSelectLine?: (line: number) => void;
  initialAnswers?: Record<string, string>;
}

export default function InterviewCard({
  questions,
  onComplete,
  isLoading = false,
  onSelectLine,
  initialAnswers = {},
}: InterviewCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

  const activeQuestion = questions[currentIdx] || questions[0];

  const handleTextChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: text,
    }));
  };

  const isVagueAnswer = (text: string) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return (
      lower.includes("handles errors gracefully") ||
      lower.includes("retries if needed") ||
      lower.includes("standard async") ||
      lower.includes("looks good")
    );
  };

  const currentAnswer = answers[activeQuestion.id] || "";
  const showsVagueWarning = isVagueAnswer(currentAnswer);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      if (onSelectLine && questions[nextIdx]) {
        onSelectLine(questions[nextIdx].targetLine);
      }
    } else {
      const finalAnswers = questions.map((q) => ({
        questionId: q.id,
        userAnswer: answers[q.id] || "No response provided",
      }));
      onComplete(finalAnswers);
    }
  };

  const loadPreBakedVague = () => {
    handleTextChange(
      "It handles errors gracefully and retries if needed through the try/catch block."
    );
  };

  const loadPreBakedGood = () => {
    handleTextChange(
      "Lines 41-45 read the token from secure storage and send a POST request. Active tokens are updated in memory and committed to persistent storage."
    );
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl flex flex-col h-full justify-between">
      <div>
        {/* Step indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
              {currentIdx + 1}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="hidden sm:flex items-center gap-1.5 ml-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentIdx
                      ? "w-4 bg-emerald-500"
                      : i === currentIdx
                      ? "w-6 bg-emerald-400 animate-pulse"
                      : "w-3 bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border transition-colors ${
                showsVagueWarning
                  ? "bg-amber-950/90 text-amber-300 border-amber-700 animate-pulse"
                  : "bg-slate-950 text-slate-400 border-slate-800"
              }`}
            >
              {showsVagueWarning ? "Comprehension: 2/3 → Medium Risk" : "Comprehension: 3/3 Tracking"}
            </span>

            <div className="flex items-center space-x-1 font-mono text-[11px] text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded">
              <span>Line {activeQuestion.targetLine}</span>
              <span>•</span>
              <span>{activeQuestion.targetFunction}</span>
            </div>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="mt-4">
          <div className="flex items-start space-x-2.5">
            <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              {activeQuestion.prompt}
            </p>
          </div>

          {activeQuestion.contextSnippet && (
            <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-400">
              <span className="text-slate-600 select-none mr-2">Code:</span>
              <span className="text-emerald-400/90">{activeQuestion.contextSnippet}</span>
            </div>
          )}
        </div>

        {/* Answer input */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Your Technical Explanation:
            </label>
            {showsVagueWarning && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                ⚠️ Vague Explanation Detected
              </span>
            )}
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={4}
            placeholder="Explain how this function behaves, what edge cases are handled, and how concurrency or network errors affect it..."
            className={`w-full rounded-lg bg-slate-950 border p-3 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none transition ${
              showsVagueWarning
                ? "border-amber-500/80 focus:border-amber-400 bg-amber-950/10"
                : "border-slate-800 focus:border-emerald-500"
            }`}
          />

          {showsVagueWarning && (
            <div className="mt-2 p-2.5 rounded-lg bg-amber-950/90 border border-amber-700/80 text-amber-200 text-xs flex items-start gap-2.5 shadow-xl animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold text-amber-300">⚠ Vague Explanation Detected:</span>{" "}
                <span className="text-amber-100">
                  Surface-level response. Does not mention concurrency race conditions, lack of in-flight mutex, or duplicate token invalidation.
                </span>
                <div className="mt-1 font-mono text-[11px] text-amber-400 font-semibold">
                  Live Score: 2/3 (63%) → High Cognitive Debt Risk
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Demo Assist buttons for recording */}
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-mono">
            Demo Presets:
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={loadPreBakedVague}
              className="px-2 py-1 rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-[11px] border border-amber-800/50 flex items-center gap-1 transition"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              Fill Vague Answer (Q2 Demo)
            </button>
            <button
              type="button"
              onClick={loadPreBakedGood}
              className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-[11px] border border-emerald-800/50 flex items-center gap-1 transition"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Fill Solid Answer
            </button>
          </div>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          {showsVagueWarning ? (
            <span className="text-amber-400">Score Projection: 2/3 (Medium Risk)</span>
          ) : (
            <span className="text-emerald-400">Verifying Comprehension...</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={isLoading || !currentAnswer.trim()}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-semibold transition shadow-lg shadow-emerald-950/50"
        >
          {isLoading ? (
            <span>Analyzing Comprehension...</span>
          ) : currentIdx < questions.length - 1 ? (
            <>
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Generate Audit & Edge-Case Test</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
