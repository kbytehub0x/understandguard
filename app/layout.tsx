import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "UnderstandGuard — Pre-merge Cognitive Debt Auditor for AI Coding Agents",
  description:
    "AI can write the code. UnderstandGuard makes sure you understand the change. Reverse-interviews developers on AI diffs, eliminates cognitive debt, and synthesizes adversarial tests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs font-mono text-slate-500">
          Built for Devpost: Build with AI — Basics (2026) • Powered by Flipped Interaction
        </footer>
      </body>
    </html>
  );
}
