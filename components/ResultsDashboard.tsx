"use client";

import { useState } from "react";
import { EvaluationResult } from "@/fixtures/demoData";
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  Copy,
  Check,
  Code2,
  GitBranch,
  RefreshCw,
  Download,
} from "lucide-react";

interface ResultsDashboardProps {
  result: EvaluationResult;
  onReset: () => void;
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"test" | "map">("test");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.cognitiveMapMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCognitiveMap = () => {
    const blob = new Blob([result.cognitiveMapMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "COGNITIVE_MAP.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isHighRisk = result.riskLevel === "HIGH";

  return (
    <div className="space-y-6">
      {/* Top Banner Verdict */}
      <div
        className={`rounded-2xl border p-6 shadow-2xl transition-all ${
          isHighRisk
            ? "border-rose-900/60 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950"
            : "border-emerald-900/60 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-xl border mt-0.5 ${
                isHighRisk
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border font-mono ${
                    isHighRisk
                      ? "bg-rose-950/80 text-rose-300 border-rose-800/80"
                      : "bg-emerald-950/80 text-emerald-300 border-emerald-800/80"
                  }`}
                >
                  {result.verdictBadge}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Diff: src/auth.ts
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mt-2">
                {isHighRisk
                  ? "Unverified AI Code Detected — Human Comprehension Gap"
                  : "Verified AI Changes — Ready for Review"}
              </h2>

              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {result.flaggedReason}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Comprehension Score
              </div>
              <div
                className={`text-3xl font-extrabold font-mono ${
                  isHighRisk ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {result.comprehensionScore}
                <span className="text-lg text-slate-500 font-normal">/100</span>
              </div>
            </div>

            <button
              onClick={onReset}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("test")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "test"
                ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Targeted Adversarial Test</span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "map"
                ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>COGNITIVE_MAP.md & Sequence Flow</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={downloadCognitiveMap}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium transition shadow-lg shadow-emerald-950/50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download COGNITIVE_MAP.md</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700/60"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Targeted Adversarial Test */}
      {activeTab === "test" && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-rose-400">
                Triggered Vulnerability Test
              </span>
              <h3 className="text-sm font-bold text-slate-100">
                Target: {result.adversarialTest.targetFunction} (Line {result.adversarialTest.targetLine})
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/50">
              Framework: {result.adversarialTest.testFramework}
            </span>
          </div>

          {/* Crisp Assertion Failure Banner */}
          <div className="p-3.5 rounded-lg bg-rose-950/50 border border-rose-900/60 flex items-start space-x-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-mono font-semibold uppercase text-rose-400 tracking-wider">
                Reproduced Failure Assertion:
              </div>
              <code className="text-xs font-mono text-rose-200 mt-0.5 block break-all">
                {result.adversarialTest.assertionFailure}
              </code>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {result.adversarialTest.vulnerabilityExplanation}
          </p>

          {/* Code block */}
          <div className="relative rounded-lg bg-slate-900 border border-slate-800 p-4 font-mono text-xs overflow-auto max-h-[300px]">
            <pre className="text-emerald-300">
              <code>{result.adversarialTest.testCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: COGNITIVE_MAP.md & Architecture */}
      {activeTab === "map" && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider font-semibold text-emerald-400">
                Architectural Artifact
              </span>
              <h3 className="text-sm font-bold text-slate-100">
                Mental Model & PR Review Hand-off
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              COGNITIVE_MAP.md
            </span>
          </div>

          <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-auto">
            {result.cognitiveMapMarkdown}
          </div>
        </div>
      )}
    </div>
  );
}
