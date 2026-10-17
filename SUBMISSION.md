# 🏆 UnderstandGuard: Devpost Submission & Recording Guide

**Hackathon:** [Build with AI: Basics (Devpost)](https://learn-ai-basics.devpost.com)  
**Project Name:** UnderstandGuard  
**Tagline:** *"AI can write the code. UnderstandGuard makes sure you understand the change."*  
**Author:** kbytehub0x  
**License:** MIT License  

---

## 🚀 1. Pushing to GitHub (Public Repo)

1. Go to [https://github.com/new](https://github.com/new).
2. Set **Repository name** to: `understandguard`
3. Set Visibility to: **Public** (Required by hackathon rules).
4. Do NOT initialize with README or license (we already created them locally). Click **Create repository**.
5. In your local terminal, push the committed code:
   ```bash
   git push -u origin main
   ```

---

## ⚡ 2. 1-Minute Vercel Deployment (Live URL)

1. Go to [vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Select **`kbytehub0x/understandguard`** and click **Import**.
3. Framework Preset: **Next.js** (Auto-detected).
4. Root Directory: `./` (Default).
5. Environment Variables (Optional):
   * `GEMINI_API_KEY`: *(Optional — UnderstandGuard includes a zero-dependency deterministic Mock Mode that works 100% out-of-the-box for judges without an API key!)*
6. Click **Deploy**. In under 60 seconds, you will receive your live URL: `https://understandguard.vercel.app`.

---

## 📝 3. Devpost Submission Fields (Copy & Paste Ready)

### Project Title
`UnderstandGuard`

### Elevator Pitch / Tagline (1 sentence)
`AI can write the code. UnderstandGuard makes sure you understand the change.`

### Inspiration
With tools like Cursor, Claude Code, and GitHub Copilot, developers are generating and committing code at blistering speeds. But velocity has introduced a dangerous new engineering crisis: **Cognitive Debt**—code accepted into production that the author cannot explain, debug, or maintain under pressure.

Traditional linters only check syntax, while passive AI pull request summaries create an illusion of understanding because developers simply skim them. We wanted to solve this by operationalizing the **Flipped Interaction Method**: instead of the AI passively explaining the code, **the AI interviews the developer** before code is merged.

### What It Does
UnderstandGuard is a pre-merge accountability and cognitive debt auditor for AI coding agents:
1. **Diff Pre-flight Check:** Automatically parses unified Git diffs and isolates fragile logic (async concurrency, token persistence, error fallbacks).
2. **Reverse Interview:** Asks 3 line-specific probing questions directly referencing line numbers and functions in the diff.
3. **Real-time Vague Detection:** Detects superficial, hand-waving explanations (e.g. *"It handles errors gracefully"*) and displays an active warning alert, updating the author's comprehension score in real-time.
4. **Targeted Adversarial Testing:** Synthesizes a focused Vitest unit test that exploits the exact edge case the author could not explain (such as concurrent 401 race conditions during token refresh).
5. **Architectural Artifacts:** Exports a `COGNITIVE_MAP.md` featuring a Mermaid sequence diagram and an objective review verdict badge (`Safe to Review` vs. `High Cognitive Debt – Review Required`).

### How We Built It
* **Frontend & Architecture:** Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS** featuring a dark terminal dashboard aesthetic.
* **Diff Parsing:** Used `parse-diff` to map diff hunks and isolate changed lines.
* **AI Orchestration:** Powered by **Google Gemini 1.5/2.5 Flash** for dynamic question generation and answer scoring.
* **Zero-Failure Reliability Engine:** Implemented a deterministic mock router (`?mock=true`) with pre-baked JSON fixtures ensuring sub-second response times and zero API latency during recordings and judge evaluations.
* **Devpost Learn Skill Pack:** Developed strictly following the Devpost Learn curriculum, with `scope.md`, `prd.md`, and `spec.md` planning artifacts integrated into the root repository.

### Challenges We Ran Into
* **Separating Real Understanding from Buzzwords:** Crafting scoring heuristics that distinguish genuine architectural reasoning from confident-sounding AI boilerplate.
* **Zero-Glitch Demo Architecture:** Ensuring the 2-minute demo flow can be presented reliably without API rate limits or network hiccups by pairing the Gemini engine with deterministic mock fixtures.

### Accomplishments That We're Proud Of
* Executing a focused, single-task proof of concept that solves a real developer pain point end-to-end in under 2 minutes.
* Delivering tangible outputs (`COGNITIVE_MAP.md` and adversarial Vitest assertions) that bridge the human-AI accountability gap.

### What's Next for UnderstandGuard
* A lightweight GitHub Action that automatically triggers the Reverse Interview as an interactive PR comment bot.
* Integration into IDE extensions (VS Code / Cursor sidecar) to interview developers right before they `git commit`.

---

## 🎬 4. Second-by-Second Demo Video Script (Under 2 Minutes)

Open your live deployed URL on the [`/demo`](https://understandguard.vercel.app/demo) page in full screen before pressing Record.

| Timestamp | Screen Visual | Voiceover Script (What You Say) |
| :--- | :--- | :--- |
| **0:00 – 0:15** | Live URL on screen + Demo Header | *"Hi! This is UnderstandGuard, built for the Devpost: Build with AI — Basics hackathon. AI agents write most of our code today, but they create 'Cognitive Debt'—code accepted into production that the author cannot explain. UnderstandGuard fixes this: AI can write the code, but UnderstandGuard makes sure you understand the change."* |
| **0:15 – 0:40** | Diff Viewer showing `src/auth.ts` | *"Here we have an AI-generated pull request in `src/auth.ts` for token refreshing. It looks clean on the surface, but as UnderstandGuard's inline callout highlights on line 48, it contains a critical race condition: no in-flight mutex lock during concurrent 401 token refreshes."* |
| **0:40 – 1:10** | Click **"Begin Reverse Interview"** | *"Instead of passively explaining the code, UnderstandGuard reverses the interaction and interviews the developer with 3 line-specific questions. Question 1 asks about token persistence across tabs, and Question 2 asks what happens if two components fire concurrent 401s at the exact same millisecond."* |
| **1:10 – 1:25** | Click **"Fill Vague Answer (Q2 Demo)"** | *"Watch what happens when the developer gives a superficial answer: 'It handles errors gracefully.' UnderstandGuard immediately triggers a live warning: 'Vague Explanation Detected', dropping the live comprehension score to Medium Risk because the author missed the concurrency flaw."* |
| **1:25 – 1:40** | Click **"Generate Audit"** → Show Test Tab | *"Because the explanation was vague, UnderstandGuard immediately flags `refreshToken()` as High Cognitive Debt and synthesizes a targeted adversarial Vitest test. It reproduces the exact failure with a single crisp assertion: HTTP 500—token already rotated by the concurrent request."* |
| **1:40 – 1:55** | Switch to **"COGNITIVE_MAP.md"** tab → Click **"Download"** | *"It also generates a complete Cognitive Map with an architectural Mermaid sequence diagram showing where the logic breaks. With one click, the developer or reviewer can download `COGNITIVE_MAP.md` directly into their repo."* |
| **1:55 – 2:00** | Full screen on Conclusion Banner | *"UnderstandGuard turns AI code from something you blind-accept into something you can verify and explain. Thanks for watching!"* |
