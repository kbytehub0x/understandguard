# Winning Hackathon Ideas: Build with AI: Basics (Devpost)

**Target:** 1st Place ($1,250) / 2nd Place ($750)  
**Hackathon Focus:** Proof of Concept (PoC) executing **one task flawlessly end-to-end**, emphasizing AI Best Practices, eliminating **Cognitive Debt**, and following the **Flipped Interaction Method**.

---

## Evaluation Criteria Recap
* **Impact:** Tangible, real-world utility solving actual developer/user friction.
* **AI Implementation:** Deep, purposeful AI execution — **no shallow chat wrappers**.
* **Innovation:** Original perspective on AI agent workflows.
* **Execution:** Polished end-to-end flow with zero crashes in demo.
* **Presentation:** Clean 2-minute video showing both the planning documents (`scope.md`, `prd.md`, `spec.md`) and working software.

---

## 🏆 Idea 1: Cognitive Debt Auditor (Highest Judge Alignment)
> **Directly addresses Joe & Devpost's keynote on "Cognitive Debt" and agent accountability.**

* **The Problem:** Developers use AI coding agents (Claude Code, Cursor, Copilot) to generate code rapidly, but accumulate severe "Cognitive Debt" — code in the repo that the human cannot explain, debug, or maintain.
* **How It Works (End-to-End Workflow):**
  1. Ingests a local Git commit, diff, or file path.
  2. Runs a **Reverse-Interview**: The AI acts as an interviewer and tests the developer:
     * *"Line 34 adds an exponential backoff retry. What happens if the API rate limit is exceeded?"*
     * *"You imported `lodash.debounce`. Could this be handled natively?"*
  3. Identifies hidden architectural risks, dead logic, and unhandled edge cases.
  4. Generates a **Mental Model Cheat Sheet** (`COGNITIVE_MAP.md`) with a Mermaid diagram illustrating component interactions.
* **Tech Stack:** Node.js / TypeScript, Tailwind CSS, Gemini API / Claude API, Simple Web UI + CLI flag.
* **Video Demo Angle:** *"Watch how our tool eliminates cognitive debt by quizzing the developer on AI-generated commits before pushing to production."*

---

## 🚀 Idea 2: Doc-to-Skill Compiler (Evolution of Keyword-to-Skill)
> **Solves the real-world frustration of agents hallucinating on modern/niche documentation.**

* **The Problem:** Standard AI coding skills or prompt templates are generic. Coding agents constantly hallucinate when working with fast-evolving libraries (Tailwind v4, Next.js 15, Supabase v2, Hono, LangGraph).
* **How It Works (End-to-End Workflow):**
  1. User enters a **keyword / framework name** and a **documentation URL** (or uploads a docs markdown).
  2. The compiler scrapes and extracts:
     * Deprecated patterns to avoid.
     * Core idioms and boilerplate code snippets.
     * File organization rules.
  3. Compiles a standardized, battle-tested `SKILL.md` and `.cursorrules` file ready to drop into Claude Code, Cursor, or Antigravity.
  4. Validates the generated skill against sample queries to test accuracy.
* **Tech Stack:** Node.js / Python (Cheerio / BeautifulSoup or Firecrawl), Gemini API, lightweight web interface.
* **Video Demo Angle:** *"Enter 'Hono' + docs URL -> Instant custom agent skill with zero hallucinations."*

---

## 🎯 Idea 3: SpecPilot (The Flipped Interaction PRD Engine)
> **Directly productizes the "Flipped Interaction Method" into a guided app.**

* **The Problem:** Most AI projects fail because developers start with vague prompts ("build an expense tracker"). The AI guesses the architecture, leading to generic, brittle prototypes.
* **How It Works (End-to-End Workflow):**
  1. User inputs a raw, one-sentence idea.
  2. **The Flipped Interview:** The AI acts as a Principal Architect and asks 4–5 sequential clarifying questions (data schema, auth requirements, error boundaries, UI preferences).
  3. Synthesizes answers into the exact Devpost-compliant planning pack:
     * `scope.md` (Boundaries and MVP constraints)
     * `prd.md` (User journeys and requirements)
     * `spec.md` (Architecture diagram + schema definition)
     * `checklist.md` (Agent-executable task breakdown)
  4. One-click "Export to Repo" button.
* **Tech Stack:** React / Vite or Next.js, Gemini API, Markdown renderer + Mermaid.js.
* **Video Demo Angle:** *"Watch a 1-sentence prompt transform into an airtight planning document through a guided 2-minute AI interview."*

---

## 🛡️ Idea 4: EdgeCase — Adversarial QA & Bug Hunter
> **Proves high technical substance by breaking AI code before deployment.**

* **The Problem:** AI agents excel at generating "happy path" code, but fail silently on edge cases (null safety, strange Unicode, network drops, malformed JSON, race conditions).
* **How It Works (End-to-End Workflow):**
  1. Developer pastes an API endpoint, TypeScript function, or Python snippet.
  2. The engine generates 5 extreme adversarial test scenarios designed specifically to crash the function.
  3. Executes the test suite in a sandboxed runner and displays pass/fail metrics.
  4. Generates an automated "Hardened Patch" diff that fixes the vulnerabilities.
* **Tech Stack:** Node.js / Vitest / Jest, Python, Gemini 3.8 / 2.5 Flash, clean split-pane UI (Code vs Edge Case Matrix).
* **Video Demo Angle:** *"AI wrote this function. Watch EdgeCase find 3 silent vulnerabilities in 5 seconds and generate the fix."*

---

## 📊 Comparison Matrix

| Project Idea | Originality | Judge Alignment | Scope Feasibility (1 Week) | Demo 'Wow' Factor |
| :--- | :---: | :---: | :---: | :---: |
| **1. Cognitive Debt Auditor** | 9.8 / 10 | 10 / 10 (Direct tie-in) | High (CLI / Web) | Very High |
| **2. Doc-to-Skill Compiler** | 9.2 / 10 | 9.5 / 10 | High | High |
| **3. SpecPilot** | 9.0 / 10 | 9.8 / 10 (Flipped Interaction) | High | Very High |
| **4. EdgeCase** | 9.4 / 10 | 9.0 / 10 | Moderate-High | High |

---

## Recommended Next Steps
1. Pick one of the top ideas (Recommendation: **Idea 1** or **Idea 3** for maximal Devpost judge alignment).
2. Create `scope.md`, `prd.md`, and `spec.md` as required by the hackathon rubric.
3. Attend today's **"Cup of Joe" Office Hours** (Oct 6, 3:00 PM ET) in the Devpost Discord voice channel to pitch the chosen concept and get live feedback from Joe.
