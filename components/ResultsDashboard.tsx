"use client";

import { useState } from "react";
import { EvaluationResult } from "@/fixtures/demoData";
import {
  ShieldAlert,
  AlertTriangle,
  Copy,
  Check,
  Code2,
  GitBranch,
  RefreshCw,
  Download,
  GraduationCap,
  Sparkles,
  BarChart3,
  BadgeCheck,
} from "lucide-react";

interface ResultsDashboardProps {
  result: EvaluationResult;
  onReset: () => void;
}

export default function ResultsDashboard({ result, onReset }: ResultsDashboardProps) {
  const [copiedMap, setCopiedMap] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [activeTab, setActiveTab] = useState<"test" | "map" | "mentor">("test");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.cognitiveMapMarkdown);
    setCopiedMap(true);
    setTimeout(() => setCopiedMap(false), 2000);
  };

  const downloadCognitiveMap = () => {
    const blob = new Blob([result.cognitiveMapMarkdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "COGNITIVE_MAP.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyPrBadge = () => {
    const color = result.riskLevel === "HIGH" ? "rose" : result.riskLevel === "MEDIUM" ? "amber" : "emerald";
    const statusText = result.riskLevel === "HIGH" ? "High_Risk" : "Low_Debt";
    const badgeMarkdown = `[![UnderstandGuard Audit](https://img.shields.io/badge/Cognitive_Debt-${statusText}_(${result.comprehensionScore}%2F100)-${color}?style=flat-square&logo=github)](https://understandguard.vercel.app)`;
    navigator.clipboard.writeText(badgeMarkdown);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2000);
  };

  const isHighRisk = result.riskLevel === "HIGH";
  const rubric = result.rubricScores || {
    technicalSpecificity: 5,
    concurrencyAwareness: 2,
    mitigationAccuracy: 4,
    critique:
      "Surface-level responses detected. The developer did not account for concurrent in-flight requests or failure rollback sagas.",
  };

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
                  Target: {result.flaggedFunction}
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
              Reset
            </button>
          </div>
        </div>

        {/* 3-Vector Evaluation Rubric Scorecard */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Technical Specificity</span>
              <span className="font-bold text-amber-400">{rubric.technicalSpecificity}/10</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${rubric.technicalSpecificity * 10}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
              Concrete references to line numbers and mechanisms.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Concurrency & Edge Cases</span>
              <span className="font-bold text-rose-400">{rubric.concurrencyAwareness}/10</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${rubric.concurrencyAwareness * 10}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
              Awareness of race conditions, retries, and network delays.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Mitigation Accuracy</span>
              <span className="font-bold text-amber-400">{rubric.mitigationAccuracy}/10</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${rubric.mitigationAccuracy * 10}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
              Defensive coding proposals (locks, rollback sagas).
            </p>
          </div>
        </div>

        {/* Architect Critique */}
        <div className="mt-3 p-3 rounded-lg bg-slate-950/90 border border-slate-800 text-xs text-slate-300 font-mono flex items-start gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-emerald-400 font-bold">Senior Staff Evaluation:</span>{" "}
            {rubric.critique}
          </div>
        </div>
      </div>

      {/* Tabs navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2 gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("test")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "test"
                ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Targeted Adversarial Test</span>
          </button>

          <button
            onClick={() => setActiveTab("mentor")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "mentor"
                ? "bg-slate-800 text-amber-400 border border-slate-700 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>💡 Mentor Mode</span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "map"
                ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>COGNITIVE_MAP.md</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyPrBadge}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-mono transition border border-slate-700"
          >
            {copiedBadge ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Badge Copied!</span>
              </>
            ) : (
              <>
                <BadgeCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy PR Badge</span>
              </>
            )}
          </button>

          <button
            onClick={downloadCognitiveMap}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium transition shadow-lg shadow-emerald-950/50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Map</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700/60"
          >
            {copiedMap ? (
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

      {/* Tab 2: Mentor Mode (Explain Blind Spot) */}
      {activeTab === "mentor" && (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-2xl space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Senior Staff Engineer Coaching & Remediation
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
              Why Your Answer Failed Verification:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.mentorExplanation?.seniorPerspective ||
                "When handling critical state mutations, relying on generic try/catch blocks without in-flight mutex deduplication or atomic rollback boundaries leaves the system open to race conditions under production concurrency."}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
              Production-Grade Architecture Fix:
            </h4>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 font-mono text-xs overflow-auto max-h-[250px]">
              <pre className="text-emerald-300">
                <code>
                  {result.mentorExplanation?.recommendedFix ||
                    `// In-flight promise cache example:\nlet inFlightLock: Promise<any> | null = null;\nexport function execute() {\n  if (inFlightLock) return inFlightLock;\n  inFlightLock = doWork().finally(() => inFlightLock = null);\n  return inFlightLock;\n}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: COGNITIVE_MAP.md & Architecture */}
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
