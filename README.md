# 🛡️ UnderstandGuard

> **"AI can write the code. UnderstandGuard makes sure you understand the change."**

[![Hackathon](https://img.shields.io/badge/Devpost-Build_with_AI:_Basics-emerald?style=for-the-badge)](https://devpost.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Flipped Interaction](https://img.shields.io/badge/Method-Flipped_Interaction-amber?style=for-the-badge)](#the-solution-flipped-interaction)

UnderstandGuard is a pre-merge accountability and cognitive debt auditor for AI coding agents (Claude Code, Cursor, GitHub Copilot). Instead of passively summarizing PRs, it **reverses the interaction**: the AI interviews the developer on critical lines, exposes shallow comprehension, and synthesizes targeted adversarial tests.

---

## ⚡ Quick Links & Planning Artifacts

As required by the **Devpost: Build with AI — Basics** hackathon guidelines:

* 🎯 **[`scope.md`](./scope.md)** — Project boundaries, MVP criteria, and explicit out-of-scope constraints.
* 📋 **[`prd.md`](./prd.md)** — User personas (AI developer vs. tech lead), user journeys, and success metrics.
* 📐 **[`spec.md`](./spec.md)** — Technical architecture, Mermaid sequence flows, diff-aware risk analysis, and API schemas.
* 📦 **[`fixtures/`](./fixtures/)** — Demo diff (`auth.patch`), question fixtures, and adversarial test suites.

---

## 🚨 The Problem: "Cognitive Debt"

AI coding assistants can generate large changes in seconds, but developers may accept code they cannot fully explain. This velocity introduces **Cognitive Debt**.

> **Cognitive Debt** is code accepted into a codebase that the human author cannot explain, debug, or maintain under pressure.

* **Passive AI Summaries Fail:** Summaries like *"This PR refactors auth"* are skimmed and ignored. They create the illusion of understanding without enforcing comprehension.
* **Linters Miss Intent:** Static analyzers check types and syntax, but cannot detect logical race conditions, unhandled rate limits (HTTP 429), or state desynchronization.
* **Reviewers are Overwhelmed:** Senior engineers cannot distinguish between code an author deeply understands and code they blindly copied.

---

## 💡 The Solution: Flipped Interaction + Adversarial Testing

UnderstandGuard transforms PR review into an active verification loop:

```mermaid
flowchart LR
    A["1. Git Diff Ingested"] --> B["2. AI Spots Critical Changes"]
    B --> C["3. Reverse Interview (3 Questions)"]
    C --> D["4. Developer Answers"]
    D --> E["5. Comprehension Score & Risk Detection"]
    E --> F["6. Targeted Adversarial Test + COGNITIVE_MAP.md"]
```

1. **Diff-aware Risk Analysis:** Automatically parses unified diffs and isolates high-risk hunks (concurrency, auth tokens, error boundaries).
2. **Reverse Interview:** The AI acts as a Principal Architect, asking 3 line-specific probing questions.
3. **Comprehension Scoring:** Evaluates technical accuracy vs. vague hand-waving (e.g. *"It handles errors gracefully"* triggers `⚠️ Vague Explanation`).
4. **Targeted Adversarial Testing:** Generates a runnable Vitest test that deliberately breaks the exact function the author could not explain.
5. **Architectural Map Export:** Produces `COGNITIVE_MAP.md` with a Mermaid sequence diagram and review verdict.

---

## 🎬 Demo Flow (`/demo`, Paced for 2:15 – 2:30)

UnderstandGuard includes a dedicated `/demo` route pre-loaded with a realistic 42-line `auth.ts` diff:

| Timestamp | Visual Action | What the Judges See |
| :--- | :--- | :--- |
| **0:00 – 0:25** | Hero screen & terminal (`/demo`) | *"This is UnderstandGuard, built for Build With AI: Basics. AI assistants can generate large code changes quickly, but developers may accept changes they cannot fully explain..."* |
| **0:25 – 0:50** | Diff Viewer (`/demo`) | Reviewing `src/auth.ts` (token refresh flow with missing concurrency lock on line 48). |
| **0:50 – 1:15** | Reverse Interview | System asks 3 line-specific questions targeting lines 41, 48, and 70. |
| **1:15 – 1:40** | Vague Answer Input | Developer enters vague answer for Q2 (*"Handles errors gracefully"*); system flags **"⚠️ Vague Explanation"** and running score drops. |
| **1:40 – 2:05** | Solid Answers & Adversarial Test | Developer enters solid technical answers; system generates test targeting `refreshToken()` with reproducible failure assertion. |
| **2:05 – 2:25** | Export Dashboard & Download | Reviews `COGNITIVE_MAP.md` Mermaid sequence diagram and downloads architectural artifact. |

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons.
* **Diff Parsing:** `parse-diff` for unified diff hunk and line analysis.
* **AI Orchestration:** Google Gemini 1.5 Flash via `@google/generative-ai`.
* **Reliable Demo Mode:** Built-in deterministic mock router (`?mock=true`) with pre-baked fixtures for reliable presentations and judge evaluation; live Gemini generation is available when an API key is configured.

---

## 🚀 Running Locally

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/understandguard.git
cd understandguard
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env.local
# Add your GEMINI_API_KEY (Optional - Mock mode works completely offline!)
```

### 3. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for custom diff analysis, or [http://localhost:3000/demo](http://localhost:3000/demo) for the one-click presentation demo.

### 4. Build Production Bundle
```bash
npm run build
npm start
```

---

## 🏆 Hackathon Alignment

| Criteria | How UnderstandGuard Delivers |
| :--- | :--- |
| **Impact** | Solves the primary bottleneck of modern software engineering: unmaintainable AI-generated PRs. |
| **AI Implementation** | Uses AI to enforce developer accountability through targeted reverse-interviewing and test synthesis, rather than shallow chatbots. |
| **Innovation** | Operationalizes the *Flipped Interaction Method* into a functional pre-merge tool. |
| **Execution** | Clean, bug-free single-task PoC with instant reset capabilities and deterministic mock safety. |
| **Presentation** | Fully documented with `scope.md`, `prd.md`, `spec.md`, and a rehearsed 2-minute video script.
