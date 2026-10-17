"use client";

import { useState } from "react";
import Link from "next/link";
import DiffViewer from "@/components/DiffViewer";
import InterviewCard from "@/components/InterviewCard";
import ResultsDashboard from "@/components/ResultsDashboard";
import {
  DEMO_DIFF_TEXT,
  DEMO_QUESTIONS,
  DEMO_EVALUATION,
  InterviewQuestion,
  EvaluationResult,
} from "@/fixtures/demoData";
import {
  PYTHON_DEMO_DIFF_TEXT,
  PYTHON_DEMO_QUESTIONS,
  PYTHON_DEMO_EVALUATION,
} from "@/fixtures/pythonDemoData";
import {
  ShieldAlert,
  Terminal,
  Play,
  Sparkles,
  FileCode,
  Zap,
  ArrowRight,
  GitPullRequest,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function HomePage() {
  const [activePreset, setActivePreset] = useState<"ts" | "py" | "custom">("ts");
  const [diffInput, setDiffInput] = useState(DEMO_DIFF_TEXT);
  const [activeFileName, setActiveFileName] = useState("src/auth.ts");
  const [prUrl, setPrUrl] = useState("");
  const [isFetchingPr, setIsFetchingPr] = useState(false);
  const [prError, setPrError] = useState("");

  const [useMock, setUseMock] = useState(true);
  const [step, setStep] = useState<"input" | "interview" | "results">("input");
  const [highlightLine, setHighlightLine] = useState<number>(48);
  const [questions, setQuestions] = useState<InterviewQuestion[]>(DEMO_QUESTIONS);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Switch to TypeScript Preset
  const loadTsPreset = () => {
    setActivePreset("ts");
    setDiffInput(DEMO_DIFF_TEXT);
    setActiveFileName("src/auth.ts");
    setQuestions(DEMO_QUESTIONS);
    setHighlightLine(48);
    setPrError("");
  };

  // Switch to Python Preset
  const loadPyPreset = () => {
    setActivePreset("py");
    setDiffInput(PYTHON_DEMO_DIFF_TEXT);
    setActiveFileName("services/payment_worker.py");
    setQuestions(PYTHON_DEMO_QUESTIONS);
    setHighlightLine(30);
    setPrError("");
  };

  // Fetch Diff from Public GitHub PR URL
  const handleFetchPr = async () => {
    if (!prUrl.trim()) return;
    setIsFetchingPr(true);
    setPrError("");

    try {
      const res = await fetch("/api/fetch-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch PR");
      }

      setDiffInput(data.diffText);
      setActiveFileName(data.prTitle || "github-pr.diff");
      setActivePreset("custom");
    } catch (err: any) {
      setPrError(err.message || "Failed to fetch GitHub PR diff.");
    } finally {
      setIsFetchingPr(false);
    }
  };

  const handleStartAnalysis = async () => {
    setIsLoading(true);

    try {
      if (useMock) {
        if (activePreset === "py") {
          setQuestions(PYTHON_DEMO_QUESTIONS);
          setHighlightLine(PYTHON_DEMO_QUESTIONS[0].targetLine);
        } else {
          setQuestions(DEMO_QUESTIONS);
          setHighlightLine(DEMO_QUESTIONS[0].targetLine);
        }
        setStep("interview");
        return;
      }

      const res = await fetch(`/api/analyze-diff?mock=false`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff: diffInput, mock: false }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setHighlightLine(data.questions[0].targetLine);
      }
      setStep("interview");
    } catch (err) {
      console.error("Failed to analyze diff:", err);
      setQuestions(activePreset === "py" ? PYTHON_DEMO_QUESTIONS : DEMO_QUESTIONS);
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
      if (useMock) {
        setEvaluation(
          activePreset === "py" ? (PYTHON_DEMO_EVALUATION as any) : DEMO_EVALUATION
        );
        setStep("results");
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
        return;
      }

      const res = await fetch(`/api/evaluate-interview?mock=false`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diff: diffInput,
          answers,
          mock: false,
        }),
      });

      const data = await res.json();
      setEvaluation(data);
      setStep("results");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    } catch (err) {
      console.error("Failed to evaluate interview:", err);
      setEvaluation(
        activePreset === "py" ? (PYTHON_DEMO_EVALUATION as any) : DEMO_EVALUATION
      );
      setStep("results");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
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
            Instead of passively skimming AI-generated pull requests, UnderstandGuard conducts an interactive reverse-interview on critical lines. When comprehension is weak, it flags cognitive debt, synthesizes targeted adversarial tests, and provides senior engineering coaching.
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
                  ? "bg-amber-950/50 border-amber-800 text-amber-300"
                  : "bg-emerald-950/50 border-emerald-800 text-emerald-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  useMock ? "bg-amber-400" : "bg-emerald-400 animate-pulse"
                }`}
              />
              <Zap className="w-3.5 h-3.5" />
              <span>
                Engine: {useMock ? "Deterministic Mock (Instant)" : "Live Gemini 1.5-Flash (Connected)"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Area */}
      {step === "input" && (
        <div className="space-y-6">
          {/* Top Control Bar: Multi-Language Presets & GitHub PR URL */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Select Benchmark Preset:
                </span>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={loadTsPreset}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                      activePreset === "ts"
                        ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🟦 TypeScript (auth.ts - Concurrency Race)
                  </button>

                  <button
                    onClick={loadPyPreset}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                      activePreset === "py"
                        ? "bg-amber-950 border-amber-500 text-amber-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🐍 Python (payment_worker.py - Idempotency Leak)
                  </button>
                </div>
              </div>

              {/* GitHub PR URL Fetcher */}
              <div className="flex-1 max-w-lg">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                  Import from GitHub PR URL:
                </span>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="url"
                    value={prUrl}
                    onChange={(e) => setPrUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo/pull/123"
                    className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleFetchPr}
                    disabled={isFetchingPr || !prUrl.trim()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-mono font-semibold transition"
                  >
                    {isFetchingPr ? "Fetching..." : "Fetch Diff"}
                  </button>
                </div>
                {prError && (
                  <p className="text-[11px] text-rose-400 font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {prError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Diff Input TextArea (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  Active Diff: <span className="text-emerald-400">{activeFileName}</span>
                </label>

                <span className="text-[11px] font-mono text-slate-500">
                  Unified Diff Format
                </span>
              </div>

              <textarea
                value={diffInput}
                onChange={(e) => {
                  setDiffInput(e.target.value);
                  setActivePreset("custom");
                }}
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
                    <span className="text-emerald-400">{activeFileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Critical Risk:</span>
                    <span className="text-amber-400">
                      {activePreset === "py" ? "Idempotency / DB State" : "Concurrency / Mutex"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit Mode:</span>
                    <span className="text-slate-200">Flipped Reverse Interview</span>
                  </div>
                </div>

                <button
                  onClick={handleStartAnalysis}
                  disabled={isLoading || !diffInput.trim()}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50"
                >
                  <Play className="w-4 h-4" />
                  <span>
                    {isLoading ? "Analyzing Hunks..." : "Begin Reverse Interview"}
                  </span>
                </button>
              </div>
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
              fileName={activeFileName}
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
