"use client";

import { useMemo } from "react";
import { FileCode, AlertCircle } from "lucide-react";

interface DiffViewerProps {
  diffText: string;
  highlightLine?: number;
  fileName?: string;
}

export default function DiffViewer({
  diffText,
  highlightLine,
  fileName = "src/auth.ts",
}: DiffViewerProps) {
  const parsedLines = useMemo(() => {
    const rawLines = diffText.split("\n");
    let lineNumber = 35;

    return rawLines.map((line, idx) => {
      let type: "header" | "add" | "del" | "context" = "context";
      let displayLine: number | null = null;

      if (line.startsWith("---") || line.startsWith("+++") || line.startsWith("@@")) {
        type = "header";
      } else if (line.startsWith("+")) {
        type = "add";
        lineNumber++;
        displayLine = lineNumber;
      } else if (line.startsWith("-")) {
        type = "del";
      } else {
        type = "context";
        lineNumber++;
        displayLine = lineNumber;
      }

      return {
        id: idx,
        raw: line,
        type,
        lineNumber: displayLine,
      };
    });
  }, [diffText]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl flex flex-col h-full">
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-semibold text-slate-200">
            {fileName}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
            AI-Generated Diff (42 lines)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
          <span className="text-emerald-400">+32 additions</span>
          <span>•</span>
          <span className="text-slate-500">0 deletions</span>
        </div>
      </div>

      <div className="p-2 overflow-auto font-mono text-xs max-h-[500px]">
        {parsedLines.map((line) => {
          const isHighlighted = highlightLine && line.lineNumber === highlightLine;

          let bgClass = "hover:bg-slate-900/50";
          let textClass = "text-slate-300";

          if (line.type === "header") {
            bgClass = "bg-slate-900/70";
            textClass = "text-slate-500 font-semibold";
          } else if (line.type === "add") {
            bgClass = isHighlighted
              ? "bg-amber-500/20 border-l-2 border-amber-400"
              : "bg-emerald-950/20";
            textClass = isHighlighted ? "text-amber-200" : "text-emerald-300";
          } else if (line.type === "del") {
            bgClass = "bg-rose-950/20";
            textClass = "text-rose-400";
          }

          return (
            <div key={line.id} className="group">
              <div
                className={`flex items-start px-2 py-0.5 transition-colors ${bgClass}`}
              >
                <span className="w-10 text-right pr-3 select-none text-slate-600 shrink-0">
                  {line.lineNumber || ""}
                </span>
                <span className="w-4 select-none text-slate-600 shrink-0">
                  {line.type === "add" ? "+" : line.type === "del" ? "-" : " "}
                </span>
                <span className={`break-all whitespace-pre-wrap flex-1 ${textClass}`}>
                  {line.raw.replace(/^[+-]/, "")}
                </span>
                {isHighlighted && (
                  <span className="shrink-0 flex items-center gap-1 text-[10px] text-amber-400 font-sans px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/50">
                    <AlertCircle className="w-3 h-3" /> Target Line
                  </span>
                )}
              </div>

              {line.lineNumber === 48 && (
                <div className="my-1.5 ml-14 mr-2 p-2 rounded-lg bg-rose-950/90 border border-rose-800/80 text-[11px] text-rose-200 font-sans flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-1.5 font-mono">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="font-bold text-rose-300">HIDDEN BUG:</span>
                    <span className="text-slate-300">
                      No in-flight mutex lock during concurrent 401 token refresh
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-900/70 text-rose-200 border border-rose-700/70">
                    Race Condition
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
