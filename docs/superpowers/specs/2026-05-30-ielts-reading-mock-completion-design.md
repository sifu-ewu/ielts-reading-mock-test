# IELTS Reading Mock Test — Completion Design

**Date:** 2026-05-30
**Status:** Approved (design); pending spec review
**Author:** Claude (with sifu-ewu)

## 1. Goal

Turn the current partial demo (2 passages, 8 questions, several bugs) into one
complete, authentic-format IELTS Academic Reading mock test that runs end-to-end:

- **3 passages, 40 questions** spanning 9 question types, all original content with
  answer keys and explanations.
- **Correct scoring** — every question is winnable; band score derived from a single
  source of truth.
- **localStorage persistence** — answers, flags, navigation, and the timer survive a
  page refresh; an in-progress test offers Resume / Restart.
- **Full per-question review** — your answer vs. correct answer vs. explanation, plus
  band score, accuracy, time, and a per-type accuracy breakdown.
- All known bugs fixed; `npm run build` and `npm run lint` pass; scoring logic covered
  by unit tests.

Stack is unchanged: React 19 + TypeScript + Vite + Tailwind CSS v4, no backend.

## 2. Architecture

Keep the existing component architecture and the one-question-at-a-time UX (already
wired to navigation, flagging, and progress). The structural change is to make state
and scoring flow through a single path.

```
App
├── TestInstructions      (start screen; Resume/Restart if a saved session exists)
├── TestInterface         (in-progress test)
│   ├── PassageDisplay     (passage + highlighter)
│   ├── QuestionComponent  (renders the current question by type + group content)
│   └── NavigationPanel    (grid grouped by passage)
└── TestResults           (consumes one TestResult object)

hooks/
├── useTestSession   (owns session; computes TestResult via scoring utils)
├── useTimer         (deadline/remaining-seconds based; persisted)
└── useLocalStorage  (generic persisted state)

utils/
├── scoring.ts       (pure: checkAnswer, calculateBandScore, buildTestResult, feedback)
└── storage.ts       (load/save/clear session keys; (de)serialize Dates & Sets)

data/
└── mockTestData.ts  (3 passages, 40 questions, grouped)
```

**Single source of truth for results:** `useTestSession.completeTest()` builds the full
`TestResult` (correct count, band via `calculateBandScore`, feedback, per-type
breakdown) and exposes it. `App` passes that object to `TestResults`. The inline band
formula currently in `TestResults.tsx` is deleted — it consumes `TestResult` only.

## 3. Data model (hybrid "Model C")

The flat `Question[]` stays the answer/scoring/navigation unit (preserves the 1–40
numbering, persistence, and nav). Add **optional** grouping + answer-checking fields.
All additions are backward compatible.

```ts
export interface Question {
  id: string;
  passageId: string;
  type: QuestionType;
  questionNumber: number;          // 1..40, globally unique
  instruction: string;             // per-question fallback instruction
  question: string;
  options?: string[];              // choices for MC / matching / headings
  correctAnswer: string | string[];// canonical answer (array only for multi-select types)
  acceptableAnswers?: string[];    // NEW: extra accepted variants for text answers
  wordLimit?: number;              // NEW: e.g. 2 or 3, for completion/short-answer UI
  points: number;
  explanation?: string;

  // NEW grouping fields (display only; do not affect scoring)
  groupId?: string;                // questions sharing a group render shared content once
  groupInstruction?: string;       // shown once at the top of the group
  groupContent?: string;           // shared block: heading bank / summary text / table
}
```

`QuestionType` keeps its existing union. `diagram-labeling` remains in the type but is
not authored (needs imagery).

### Answer-value convention (the core bug fix)

The value a renderer submits MUST equal what scoring compares against. Convention:

| Type | Submitted value | `correctAnswer` holds |
|------|-----------------|------------------------|
| multiple-choice | the option's full text | the correct option's full text |
| true-false-not-given | `TRUE` / `FALSE` / `NOT GIVEN` | same |
| yes-no-not-given | `YES` / `NO` / `NOT GIVEN` | same |
| matching-headings | the chosen heading's roman numeral (e.g. `iv`) | that numeral |
| matching-information | the paragraph letter (e.g. `C`) | that letter |
| matching-features | the feature key letter (e.g. `B`) | that letter |
| sentence/summary-completion, short-answer, table-completion | typed text | canonical text; variants in `acceptableAnswers` |

`checkAnswer` normalizes both sides: trim, lowercase, collapse internal whitespace.
For text types it accepts a match against `[correctAnswer, ...acceptableAnswers]`.
This eliminates the existing matching-information bug (renderer emitted `D`, data held
`"Paragraph 4"`) by making renderer and data agree on the convention above.

## 4. Content plan (40 questions)

Three original academic passages (~700–850 words, paragraphs labeled A–F), authentic in
tone and difficulty. Distribution guarantees coverage of all supported types:

**Passage 1 (Q1–13)**
- Q1–5 Matching Headings (paragraph → heading bank of 8 roman numerals; bank in `groupContent`)
- Q6–9 True/False/Not Given
- Q10–13 Summary Completion (shared summary paragraph with numbered blanks in `groupContent`; `wordLimit` enforced)

**Passage 2 (Q14–26)**
- Q14–18 Multiple Choice
- Q19–22 Matching Information (which paragraph A–F contains X)
- Q23–26 Short Answer (NO MORE THAN THREE WORDS)

**Passage 3 (Q27–40)**
- Q27–31 Yes/No/Not Given
- Q32–35 Matching Features (match statements to researchers/categories; key in `groupContent`)
- Q36–40 Table/Note Completion (table shown in `groupContent`; one input per blank)

Each question has `correctAnswer`, optional `acceptableAnswers`, and an `explanation`
grounded in the passage. Every passage is `type: 'academic'`.

## 5. Persistence & timer

**storage.ts** persists under namespaced keys (e.g. `ielts-mock:session`):
- `answers`, `flaggedQuestions` (Set→array), `visitedQuestions` (Set→array),
  `currentQuestionIndex`, `startTime` (ISO), `isCompleted`.
- Timer state: `timeRemaining` (seconds) persisted on each tick.

**useTimer redesign:** drive from a persisted `timeRemaining` that decrements on a 1s
interval and is written to storage every tick (throttled). On mount it rehydrates from
storage, so a refresh resumes mid-clock instead of resetting to 60:00. Pause/Resume is
retained (this is a practice tool); paused time does not count down. Auto-submit at 0
is preserved. (This also reduces the long-run drift of the pure-interval approach.)

**Resume flow:** on load, if a non-completed saved session exists, `TestInstructions`
shows **Resume** (rehydrate session + timer) and **Restart** (clear storage, fresh
session). Completing a test or choosing Restart clears the in-progress keys.

Instructions copy is updated to state that pausing is allowed in practice mode (removing
the current contradiction with the Pause button).

## 6. Wire up dead features (header toolbar)

A compact toolbar in the test header:
- **Font size** A− / A / A+ — toggles `uiState.fontSize` (`small | medium | large`),
  already threaded through `PassageDisplay` and `QuestionComponent`.
- **Highlighter** — select text within the passage and the selection is wrapped in
  `<mark class="highlight">`; clicking a highlight removes it. Highlights live in
  component state for the current view (not persisted across reload — explicitly out of
  scope to keep range-tracking simple). If implementation proves risky, it will be
  flagged for a cut rather than allowed to overrun.

## 7. Results / review screen

`TestResults` consumes the `TestResult` object:
- **Summary band:** band score (+ descriptor), correct/40, accuracy %, minutes used,
  questions answered.
- **Per-type breakdown:** accuracy per question type (from `feedback.detailedResults`).
- **Per-question review**, grouped by passage, each row: number, type, your answer,
  correct answer, correct/incorrect/unanswered badge, and expandable explanation.
- **Filters:** All / Incorrect / Unanswered.
- **Actions:** Take Another Test (clears storage, returns to instructions — no full page
  reload) and Print (print-friendly styles).

## 8. Styling / CSS

Add the missing classes to `index.css`: `answer-input`, `test-container`,
`passage-text`, `.highlight`, plus small utilities for review cards and the toolbar.
Remove Vite boilerplate from `App.css` (the `#root` centering + logo-spin fight the app
layout). Keep the existing `btn-primary` / `btn-secondary` gradients.

## 9. Testing & quality

- Add **Vitest** (`npm run test`) and unit tests for the pure logic:
  - `checkAnswer`: exact, case/whitespace-insensitive, `acceptableAnswers`, array
    (multi-select) equality, empty/undefined answers.
  - `calculateBandScore`: boundary scores for academic mapping (e.g. 39→9.0, 30→6.5,
    0 → floor), and that every authored question is winnable (each `correctAnswer` is
    reachable from its renderer's emitted values).
  - `buildTestResult`: counts, band, and per-type breakdown for a known answer set.
- `npm run build` (tsc + vite) and `npm run lint` must pass with no errors.
- Update `README.md` to reflect the real feature set; delete `README-new.md`.

## 10. Out of scope (YAGNI)

- No backend, accounts, or multi-test library (single test only).
- No diagram-labeling questions (needs imagery).
- Highlights are not persisted across refresh.
- No Listening/Writing/Speaking sections.

## 11. Acceptance criteria

1. Start → answer all 40 → submit shows a band score and full review; every question is
   answerable and scorable.
2. Refresh mid-test resumes answers, flags, navigation, and the clock; Resume/Restart
   works from the start screen.
3. Font size and highlighter both function.
4. `npm run build`, `npm run lint`, and `npm run test` all pass.
5. No duplicate/contradictory band-score logic; `TestResults` renders from one
   `TestResult`.
