"use client";

import { useState } from "react";
import Link from "next/link";
import DiffViewer from "@/components/DiffViewer";
import InterviewCard from "@/components/InterviewCard";
import ResultsDashboard from "@/components/ResultsDashboard";
import {
  DEMO_DIFF_TEXT,
  DEMO_QUESTIONS,
  InterviewQuestion,
  EvaluationResult,
} from "@/fixtures/demoData";
import {
  ShieldAlert,
  Terminal,
  Play,
  Sparkles,
  FileCode,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const [diffInput, setDiffInput] = useState(DEMO_DIFF_TEXT);
  const [useMock, setUseMock] = useState(true);
  const [step, setStep] = useState<"input" | "interview" | "results">("input");
  const [highlightLine, setHighlightLine] = useState<number>(48);
  const [questions, setQuestions] = useState<InterviewQuestion[]>(DEMO_QUESTIONS);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartAnalysis = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/analyze-diff?mock=${useMock}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: diffInput, mock: useMock }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setHighlightLine(data.questions[0].targetLine);
      }
      setStep("interview");
    } catch (err) {
      console.error("Failed to analyze diff:", err);
      setQuestions(DEMO_QUESTIONS);
      setStep("interview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterviewComplete = async (
    answers: { questionId: string; userAnswer: string }[]
  ) => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/evaluate-interview?mock=${useMock}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diff: diffInput,
          answers,
          mock: useMock,
        }),
      });

      const data = await res.json();
      setEvaluation(data);
      setStep("results");
    } catch (err) {
      console.error("Failed to evaluate interview:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setEvaluation(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eliminating Cognitive Debt in AI-Assisted Code</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            AI can write the code. <br />
            <span className="text-emerald-400">UnderstandGuard</span> makes sure you understand the change.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Instead of passively skimming AI-generated pull requests, UnderstandGuard conducts an interactive reverse-interview on critical lines. When comprehension is weak, it flags the cognitive debt and synthesizes targeted adversarial tests.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch 2-Minute Demo Flow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setUseMock(!useMock)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono border transition ${
                useMock
                  ? "bg-amber-950/40 border-amber-800/60 text-amber-300"
                  : "bg-slate-800 border-slate-700 text-slate-300"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Mode: {useMock ? "Deterministic Mock (Fast)" : "Live Gemini AI"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Area */}
      {step === "input" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Diff Input TextArea (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                Paste Git Unified Diff
              </label>

              <button
                onClick={() => setDiffInput(DEMO_DIFF_TEXT)}
                className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline"
              >
                Load Sample auth.ts (42 lines)
              </button>
            </div>

            <textarea
              value={diffInput}
              onChange={(e) => setDiffInput(e.target.value)}
              rows={16}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 shadow-2xl transition"
              placeholder="Paste unified diff text here (git diff)..."
            />
          </div>

          {/* Action sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl space-y-4">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-emerald-400" />
                <span>Pre-Merge Accountability Check</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                UnderstandGuard will parse the diff hunks, identify critical state/concurrency mutations, and generate 3 line-specific interview questions for the author.
              </p>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Targeted File:</span>
                  <span className="text-emerald-400">src/auth.ts</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical Risk:</span>
                  <span className="text-amber-400">Concurrency / Auth</span>
                </div>
                <div className="flex justify-between">
                  <span>Evaluation:</span>
                  <span className="text-slate-200">Flipped Reverse Interview</span>
                </div>
              </div>

              <button
                onClick={handleStartAnalysis}
                disabled={isLoading || !diffInput.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50"
              >
                <Play className="w-4 h-4" />
                <span>{isLoading ? "Parsing & Generating Questions..." : "Begin Reverse Interview"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "interview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <DiffViewer
              diffText={diffInput}
              highlightLine={highlightLine}
              fileName="src/auth.ts"
            />
          </div>

          <div className="lg:col-span-5">
            <InterviewCard
              questions={questions}
              onComplete={handleInterviewComplete}
              isLoading={isLoading}
              onSelectLine={(line) => setHighlightLine(line)}
            />
          </div>
        </div>
      )}

      {step === "results" && evaluation && (
        <ResultsDashboard result={evaluation} onReset={handleReset} />
      )}
    </div>
  );
}
