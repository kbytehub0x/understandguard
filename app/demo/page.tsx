"use client";

import { useState } from "react";
import DiffViewer from "@/components/DiffViewer";
import InterviewCard from "@/components/InterviewCard";
import ResultsDashboard from "@/components/ResultsDashboard";
import {
  DEMO_DIFF_TEXT,
  DEMO_QUESTIONS,
  DEMO_EVALUATION,
  EvaluationResult,
} from "@/fixtures/demoData";
import {
  PYTHON_DEMO_DIFF_TEXT,
  PYTHON_DEMO_QUESTIONS,
  PYTHON_DEMO_EVALUATION,
} from "@/fixtures/pythonDemoData";
import { Play, Sparkles, RefreshCw, CheckCircle, ShieldAlert } from "lucide-react";

export default function DemoPage() {
  const [activeLang, setActiveLang] = useState<"ts" | "py">("ts");
  const [step, setStep] = useState<"ready" | "interview" | "results">("ready");
  const [highlightLine, setHighlightLine] = useState<number>(48);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeDiff = activeLang === "ts" ? DEMO_DIFF_TEXT : PYTHON_DEMO_DIFF_TEXT;
  const activeQuestions = activeLang === "ts" ? DEMO_QUESTIONS : PYTHON_DEMO_QUESTIONS;
  const activeFileName = activeLang === "ts" ? "src/auth.ts" : "services/payment_worker.py";

  const startInterview = () => {
    setStep("interview");
    setHighlightLine(activeLang === "ts" ? 41 : 22);
  };

  const handleInterviewComplete = async (
    answers: { questionId: string; userAnswer: string }[]
  ) => {
    setIsLoading(true);

    try {
      // Calls /api/evaluate-interview with mock=true to guarantee instant, reliable evaluation during recording
      const res = await fetch("/api/evaluate-interview?mock=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diff: activeDiff,
          answers,
          mock: true,
        }),
      });

      const data = await res.json();
      setEvaluation(
        activeLang === "py" ? (PYTHON_DEMO_EVALUATION as any) : data
      );
      setStep("results");
    } catch {
      // Deterministic fallback
      setEvaluation(
        activeLang === "py" ? (PYTHON_DEMO_EVALUATION as any) : DEMO_EVALUATION
      );
      setStep("results");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("ready");
    setHighlightLine(activeLang === "ts" ? 48 : 30);
    setEvaluation(null);
  };

  const selectLanguage = (lang: "ts" | "py") => {
    setActiveLang(lang);
    setStep("ready");
    setHighlightLine(lang === "ts" ? 48 : 30);
    setEvaluation(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Recording Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Built for Build with AI: Basics — Devpost
            </span>
            <span className="text-xs text-slate-400 font-mono">
              2-Minute Walkthrough Flow
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1.5 flex items-center gap-2">
            UnderstandGuard Live PoC Demo
            <span className="text-xs font-normal font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
              Verified PoC
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-200 mt-1">
            <span className="text-emerald-400 font-semibold">"AI writes code. Humans must understand it."</span> — Auditing AI-generated <code className="text-emerald-300 font-mono bg-slate-900 px-1 py-0.5 rounded">{activeFileName}</code>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => selectLanguage("ts")}
              className={`px-2.5 py-1 rounded-md transition ${
                activeLang === "ts"
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              TS (Auth)
            </button>
            <button
              onClick={() => selectLanguage("py")}
              className={`px-2.5 py-1 rounded-md transition ${
                activeLang === "py"
                  ? "bg-amber-600 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Py (Stripe)
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          {step === "ready" && (
            <button
              onClick={startInterview}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50"
            >
              <Play className="w-4 h-4" />
              <span>Launch Reverse Interview</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Diff on Left, Interactive State on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Diff Viewer (Takes 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider font-semibold text-slate-400">
              Target Pull Request Diff
            </span>
            <span className="text-[11px] font-mono text-amber-400">
              {activeLang === "ts"
                ? "Vulnerability: Concurrency Lock Missing (Lines 48–54)"
                : "Vulnerability: Missing Idempotency Key & DB Rollback"}
            </span>
          </div>

          <DiffViewer
            diffText={activeDiff}
            highlightLine={highlightLine}
            fileName={activeFileName}
          />
        </div>

        {/* Right Column: Interaction Column (Takes 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {step === "ready" && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl space-y-5">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Diff Pre-flight Check Complete
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    UnderstandGuard parsed changes in <code className="text-emerald-400 font-mono">{activeFileName}</code>. Detected high-risk {activeLang === "ts" ? "async concurrency race condition" : "idempotency & transaction boundary flaw"}.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-slate-950/80 border border-slate-800/80 p-4 space-y-2.5">
                <div className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                  <span>Audit Strategy:</span>
                  <span className="text-emerald-400">Flipped Interaction</span>
                </div>
                <ul className="text-xs text-slate-400 space-y-2 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Probe 3 line-specific comprehension questions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Transparent 3-vector evaluation rubric
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Synthesize adversarial test + Mentor Coaching
                  </li>
                </ul>
              </div>

              <button
                onClick={startInterview}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50"
              >
                <Play className="w-4 h-4" />
                <span>Begin Reverse Interview (Question 1)</span>
              </button>
            </div>
          )}

          {step === "interview" && (
            <InterviewCard
              questions={activeQuestions}
              onComplete={handleInterviewComplete}
              isLoading={isLoading}
              onSelectLine={(line) => setHighlightLine(line)}
            />
          )}
        </div>
      </div>

      {/* Full Width Results Dashboard when Step === "results" */}
      {step === "results" && evaluation && (
        <div className="pt-6 border-t border-slate-800">
          <ResultsDashboard result={evaluation} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}
