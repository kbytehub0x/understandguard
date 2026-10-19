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
   * `GEMINI_API_KEY`: *(Optional — The app supports a deterministic mock mode for reliable demos and judge evaluation; live Gemini generation is available when an API key is configured.)*
6. Click **Deploy**. In under 60 seconds, you will receive your live URL: `https://understandguard.vercel.app`.

---

## 📝 3. Devpost Submission Fields (Copy & Paste Ready)

### Project Title
`UnderstandGuard`

### Elevator Pitch / Tagline (1 sentence)
`AI can write the code. UnderstandGuard makes sure you understand the change.`

### Inspiration
AI coding assistants can generate large changes in seconds, but developers may accept code they cannot fully explain. This velocity introduces **Cognitive Debt**—code accepted into production that the author cannot debug or defend under pressure.

Traditional linters only check syntax, while passive AI pull request summaries create an illusion of understanding because developers simply skim them. We wanted to solve this by operationalizing the **Flipped Interaction Method**: instead of the AI passively explaining the code, **the AI interviews the developer** before code is merged.

### What It Does
UnderstandGuard is a pre-merge accountability and cognitive debt auditor for AI coding agents:
1. **Diff-aware Risk Analysis:** Parses unified Git diffs and isolates fragile logic (async concurrency, token persistence, error fallbacks).
2. **Reverse Interview:** Asks 3 line-specific probing questions directly referencing line numbers and functions in the diff.
3. **Real-time Vague Detection:** Detects superficial, hand-waving explanations (e.g. *"It handles errors gracefully"*) and displays an active warning alert, updating the author's comprehension score in real-time.
4. **Targeted Adversarial Testing:** Synthesizes a focused unit test (Vitest/Pytest) that exploits the exact edge case the author could not explain (such as concurrent 401 race conditions during token refresh).
5. **Architectural Artifacts:** Exports a `COGNITIVE_MAP.md` featuring a Mermaid sequence diagram and an objective review verdict badge (`Safe to Review` vs. `High Cognitive Debt – Review Required`).

### How We Built It
* **Frontend & Architecture:** Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS** featuring a dark terminal dashboard aesthetic.
* **Diff Parsing:** Used `parse-diff` to map diff hunks and isolate changed lines.
* **AI Orchestration:** Powered by **Google Gemini 1.5 Flash** via `@google/generative-ai` for dynamic question generation and answer scoring.
* **Reliable Demo Mode:** The app supports a deterministic mock mode (`?mock=true`) with pre-baked fixtures for reliable demos and judge evaluation; live Gemini generation is available when an API key is configured.
* **Devpost Learn Skill Pack:** Developed strictly following the Devpost Learn curriculum, with `scope.md`, `prd.md`, and `spec.md` planning artifacts integrated into the root repository.

### Challenges We Ran Into
* **Separating Real Understanding from Buzzwords:** Crafting scoring heuristics that distinguish genuine architectural reasoning from confident-sounding AI boilerplate.
* **Reliable Evaluation Architecture:** Ensuring the demo flow can be presented calmly and reliably without API rate limits or network hiccups by supporting both the live Gemini engine and deterministic mock fixtures.

### Accomplishments That We're Proud Of
* Executing a focused, single-task proof of concept that solves a real developer pain point end-to-end in under 2.5 minutes.
* Delivering tangible outputs (`COGNITIVE_MAP.md` and adversarial Vitest assertions) that bridge the human-AI accountability gap.

### What's Next for UnderstandGuard
* A lightweight GitHub Action that automatically triggers the Reverse Interview as an interactive PR comment bot.
* Integration into IDE extensions (VS Code / Cursor sidecar) to interview developers right before they `git commit`.

---

## 🎬 4. Demo Video Script (Paced for 2:15 – 2:30, Under 3 Minutes)

Open your live deployed URL on the [`/demo`](https://understandguard.vercel.app/demo) page in full screen. Record at a calm, deliberate pace:

| Timestamp | Screen Visual | Voiceover Script (What You Say) |
| :--- | :--- | :--- |
| **0:00 – 0:25** | Hero screen & terminal (`/demo`) | *"This is UnderstandGuard, built for Build With AI: Basics. AI assistants can generate large code changes quickly, but developers may accept changes they cannot fully explain. UnderstandGuard helps prevent that by interviewing the developer before code is merged."* |
| **0:25 – 0:50** | Diff Viewer showing `src/auth.ts` | *"Here we have an AI-generated pull request in `src/auth.ts` handling token refreshing. The diff viewer identifies changed lines, and on line 48 our diff-aware risk analysis highlights a critical concurrency issue: no in-flight mutex lock during concurrent 401 token refreshes."* |
| **0:50 – 1:15** | Click **"Begin Reverse Interview"** | *"Instead of passively explaining the code, UnderstandGuard reverses the interaction and interviews the developer with three targeted questions. Question 1 asks about token persistence across tabs, and Question 2 asks what happens if two components fire concurrent 401 refreshes at the same time."* |
| **1:15 – 1:40** | Click **"Fill Vague Answer (Q2 Demo)"** | *"Watch what happens when the developer gives a superficial answer: 'It handles errors gracefully.' UnderstandGuard immediately flags this with a live warning: 'Vague Explanation Detected'. The comprehension score drops because the developer missed the underlying concurrency flaw."* |
| **1:40 – 2:05** | Click **"Fill Solid Answer"** for remaining Qs → **"Generate Audit"** | *"When we provide specific technical explanations for the remaining questions, UnderstandGuard evaluates the answers across a three-vector rubric. Because of the earlier blind spot, it synthesizes an adversarial unit test replicating the exact failure: token invalidation under race conditions."* |
| **2:05 – 2:25** | Switch to **"COGNITIVE_MAP.md"** tab → Click **"Download"** | *"It also generates a complete Cognitive Map with an architectural Mermaid sequence diagram and PR review verdict. The developer can download `COGNITIVE_MAP.md` and attach it to their pull request. UnderstandGuard ensures that when AI writes code, humans truly understand it. Thank you!"* |
