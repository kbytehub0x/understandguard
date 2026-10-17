# Product Requirements Document (PRD): UnderstandGuard

**Product:** UnderstandGuard  
**Tagline:** *"AI can write the code. UnderstandGuard makes sure you understand the change."*  
**Category:** Developer Tools & AI Governance  
**Hackathon Target:** Devpost — Build with AI: Basics (2026)  

---

## 1. Problem Statement & Motivation

### The Crisis: Cognitive Debt in the Age of AI Coding
With the rapid adoption of AI coding agents (Cursor, Claude Code, GitHub Copilot), software teams are shipping code faster than ever. However, velocity has introduced a dangerous new failure mode: **Cognitive Debt**.

> **Cognitive Debt** is code accepted into a codebase that the human author cannot explain, debug, or maintain under pressure.

### Why Existing Solutions Fail
1. **Passive AI Summaries:** Tools that generate PR summaries (e.g., *"This PR refactors auth"*) are passively skimmed or ignored. They create an illusion of understanding without enforcing comprehension.
2. **Traditional Linters:** Linters only verify syntax, types, and style; they cannot evaluate architectural intent, unhandled edge cases, or runtime race conditions.
3. **Generic AI Test Generators:** Generic AI test tools write hundreds of boilerplate tests for the happy path without knowing where the developer's actual blind spots are.

UnderstandGuard solves this by **flipping the interaction**: instead of explaining the code to the developer, **the AI interviews the developer**.

---

## 2. Target Personas

### Persona 1: Alex — The AI-Assisted Developer
* **Profile:** Full-stack engineer leveraging Cursor / Claude Code for 70%+ of day-to-day coding.
* **Pain Points:** 
  * Accepts AI-generated code blocks that work on the happy path.
  * Anxious about edge cases, rate limits, or race conditions hidden in generated code.
  * Dreads code review questions like *"Why did you implement the backoff this way?"*
* **Need:** A rapid pre-merge check that tests personal understanding and surfaces hidden bugs before pushing.

### Persona 2: Sarah — Senior Tech Lead & Code Reviewer
* **Profile:** Senior engineer reviewing 15+ pull requests every week.
* **Pain Points:** 
  * Overwhelmed by large, AI-generated PR diffs.
  * Cannot distinguish between code the author deeply understands vs. code the author blindly copied.
  * Spends hours debugging production outages caused by silent AI hallucinations.
* **Need:** An objective comprehension score and architectural map attached to the PR.

---

## 3. Key User Stories

* **US-1 (Diff Ingestion):** As a developer, I want to paste my AI-generated Git diff into UnderstandGuard so that it immediately analyzes the critical modified logic without reading irrelevant boilerplate.
* **US-2 (Reverse Interview):** As a developer, I want the tool to ask me 3 focused, line-specific questions about critical logic so that I can verify my own understanding.
* **US-3 (Comprehension Evaluation):** As a developer, I want real-time feedback on whether my answers demonstrate solid technical reasoning or vague hand-waving.
* **US-4 (Targeted Adversarial Testing):** As a developer, when I give a vague answer about an unverified function, I want UnderstandGuard to generate an adversarial test for that specific function so I can see how it fails in production.
* **US-5 (Cognitive Map Export):** As a reviewer, I want a generated `COGNITIVE_MAP.md` with an architectural Mermaid diagram and review verdict badge so I can review the PR with high confidence.

---

## 4. Feature Requirements (PoC Specifications)

### FR-1: Diff Ingestion & Structural Parsing
* Input box supporting raw unified diff text.
* Parsing via `parse-diff` to extract filenames, line ranges, and modified hunks.
* Pre-loaded sample selector: `auth.ts` (token refresh race condition & 429 backoff).

### FR-2: 3-Question Reverse Interview Engine
* Identifies critical functions (async calls, token refresh, mutexes, state mutations).
* Generates 3 targeted questions referencing exact line numbers:
  * **Q1 (State/Flow):** Traces data flow through the primary modified function.
  * **Q2 (Edge Case/Concurrency):** Probes behavior during network drops, race conditions, or rate limits.
  * **Q3 (Failure Mode):** Probes error boundaries and catch blocks.

### FR-3: Comprehension Scoring & Risk Flagging
* Evaluates developer answers against the actual diff mechanics.
* Flags shallow responses with a visible **"⚠️ Vague Explanation"** badge.
* Calculates a dynamic Comprehension Score:
  * **High Risk (0–50%):** ≥ 2 vague/incorrect answers → Verdict: *High Cognitive Debt — Review Required*.
  * **Medium Risk (51–75%):** 1 vague answer → Verdict: *Moderate Risk — Verify Flagged Functions*.
  * **Low Risk (76–100%):** 0 vague answers → Verdict: *Safe to Review*.

### FR-4: Context-Aware Adversarial Test Synthesizer
* Generates a targeted Jest/Vitest unit test directly attacking the function where the developer gave a vague response.
* Produces an immediate assertion failure preview (e.g., `expect(status).toBe(200) // got 500: Concurrency lock missing`).

### FR-5: Cognitive Map & Exportable Artifacts
* Generates exportable `COGNITIVE_MAP.md` containing:
  1. Executive Summary & Diff Metadata.
  2. Mermaid Sequence/Flow Diagram of the modified logic.
  3. Comprehension Score & Risk Flags.
  4. Adversarial Test Case with mitigation advice.

### FR-6: Demo Reliability Engine (`/demo` & Mock Mode)
* Dedicated `/demo` route pre-configured with the sample diff, sample vague responses, and instant evaluation.
* `?mock=true` toggle that returns deterministic JSON fixtures in < 100ms, insulating the video presentation from API latency or rate limits.

---

## 5. Success Metrics for the Hackathon PoC

| Metric | Target | Measurement Method |
| :--- | :---: | :--- |
| **Demo Runtime** | ≤ 2 minutes | Video recording duration |
| **Bug Detection Accuracy** | 100% on demo diff | Correctly identifies `refreshToken` concurrency vulnerability |
| **Artifact Readability** | < 30 seconds | First-glance comprehensibility of `COGNITIVE_MAP.md` |
| **Demo Reliability** | Zero runtime errors | Repeatable live demo via deterministic mock fallback |

---

## 6. Hackathon Alignment & Judging Rubric

* **Potential Impact:** Directly targets the highest-leverage problem in modern engineering: unmaintainable AI-generated codebases.
* **AI Implementation:** Purposeful use of Gemini API for reverse-interviewing and targeted test synthesis, avoiding shallow chatbot wrappers.
* **Innovation:** Introduces human-AI accountability via the Flipped Interaction Method.
* **Execution:** A complete, working single-task PoC with clean UI and zero broken states.
* **Presentation:** Tight 2-minute video accompanied by `scope.md`, `prd.md`, and `spec.md` planning artifacts.
