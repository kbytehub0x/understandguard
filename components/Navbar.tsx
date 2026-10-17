import Link from "next/link";
import { ShieldAlert, Sparkles, Terminal, FileCode2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/50 transition">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                UnderstandGuard
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                  v1.0 PoC
                </span>
              </span>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI writes the code. Humans must understand it.
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Devpost: Build with AI — Basics</span>
          </div>

          <Link
            href="/demo"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-lg shadow-emerald-950/50"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Demo Mode (Recording)</span>
          </Link>

          <a
            href="https://understandguard.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center space-x-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800"
          >
            <span>understandguard.vercel.app</span>
            <span className="text-[10px]">↗</span>
          </a>

          <Link
            href="/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Custom Diff</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
