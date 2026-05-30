# IELTS Reading Mock Test Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the partial 8-question demo into one complete, authentic IELTS Academic Reading mock test (3 passages / 40 questions) with correct scoring, localStorage persistence with resume, a full per-question review, and working font-size + highlighter controls.

**Architecture:** Keep the React 19 + TS + Vite + Tailwind v4 SPA and the one-question-at-a-time UX. Centralize all scoring in pure functions in `utils/scoring.ts`; `useTestSession` produces a single `TestResult` that `TestResults` consumes. Add `utils/storage.ts` for localStorage. Use the hybrid data model: flat `Question[]` plus optional `groupId`/`groupInstruction`/`groupContent` + `acceptableAnswers`/`wordLimit` fields.

**Tech Stack:** React 19, TypeScript 5.8 (strict, `verbatimModuleSyntax`), Vite 6, Tailwind CSS v4, lucide-react, Vitest + jsdom (new).

**Conventions:**
- All commits go directly on `main` and are pushed to `origin/main` (no feature branches/PRs).
- `verbatimModuleSyntax` is on → type-only imports MUST use `import type`.
- Answer-value convention (the core scoring fix): the value a renderer submits equals the stored `correctAnswer`.
  - multiple-choice → option's full text
  - true-false-not-given → `TRUE`/`FALSE`/`NOT GIVEN`
  - yes-no-not-given → `YES`/`NO`/`NOT GIVEN`
  - matching-headings → roman-numeral token (`i`..`viii`)
  - matching-information / matching-features → letter token (`A`..`F`)
  - sentence/summary/table completion, short-answer → typed text (canonical in `correctAnswer`, variants in `acceptableAnswers`)

---

## Task 1: Add Vitest test tooling

**Files:**
- Modify: `package.json` (devDeps + scripts)
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json` (exclude test files from production typecheck)
- Create: `src/utils/sanity.test.ts`

- [ ] **Step 1: Install dev dependencies**

Run: `npm install -D vitest@^2 jsdom@^25`
(Also runs the previously-missing `npm install` for all deps.)

- [ ] **Step 2: Add test scripts to `package.json`**

In `"scripts"` add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Configure Vitest in `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 4: Exclude test files from the production typecheck**

In `tsconfig.app.json`, add an `exclude` key (sibling of `include`) so `tsc -b` doesn't type-check `*.test.ts`:
```json
  "include": ["src"],
  "exclude": ["src/**/*.test.ts", "src/**/*.test.tsx"]
```

- [ ] **Step 5: Write a sanity test**

`src/utils/sanity.test.ts`:
```ts
import { describe, it, expect } from 'vitest'

describe('test tooling', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run the test**

Run: `npm run test`
Expected: 1 passing test.

- [ ] **Step 7: Verify build still works**

Run: `npm run build`
Expected: succeeds (test file excluded).

- [ ] **Step 8: Commit & push**

```bash
git add -A && git commit -m "chore: add Vitest test tooling"
git push origin main
```

---

## Task 2: Extend the Question type model

**Files:**
- Modify: `src/types/ielts.ts`

- [ ] **Step 1: Add optional fields to `Question`**

Replace the `Question` interface with:
```ts
export interface Question {
  id: string;
  passageId: string;
  type: QuestionType;
  questionNumber: number;
  instruction: string;
  question: string;
  options?: string[];                 // tokens (matching) or full texts (MC)
  correctAnswer: string | string[];
  acceptableAnswers?: string[];       // extra accepted variants for text answers
  wordLimit?: number;                 // e.g. 2 or 3 for completion/short-answer
  points: number;
  explanation?: string;
  groupId?: string;                   // questions sharing a group
  groupInstruction?: string;          // shown above the question
  groupContent?: string;              // shared block: heading bank / summary / table
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run build`
Expected: succeeds (fields are optional; existing data still valid).

- [ ] **Step 3: Commit & push**

```bash
git add -A && git commit -m "feat: add grouping and answer-variant fields to Question type"
git push origin main
```

---

## Task 3: Scoring — `normalizeAnswer` + `checkAnswer`

**Files:**
- Modify: `src/utils/scoring.ts`
- Create: `src/utils/scoring.test.ts`

- [ ] **Step 1: Write failing tests**

`src/utils/scoring.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { normalizeAnswer, checkAnswer } from './scoring'
import type { Question } from '../types/ielts'

const q = (over: Partial<Question>): Question => ({
  id: 'x', passageId: 'p', type: 'short-answer', questionNumber: 1,
  instruction: '', question: '', correctAnswer: '', points: 1, ...over,
})

describe('normalizeAnswer', () => {
  it('trims, lowercases, collapses whitespace', () => {
    expect(normalizeAnswer('  Social   Benefits ')).toBe('social benefits')
  })
})

describe('checkAnswer', () => {
  it('matches case/space-insensitively', () => {
    expect(checkAnswer(q({ correctAnswer: 'proactive approach' }), 'Proactive  Approach')).toBe(true)
  })
  it('accepts acceptableAnswers variants', () => {
    expect(checkAnswer(q({ correctAnswer: 'social benefits', acceptableAnswers: ['social'] }), 'social')).toBe(true)
  })
  it('rejects wrong answers', () => {
    expect(checkAnswer(q({ correctAnswer: 'TRUE', type: 'true-false-not-given' }), 'FALSE')).toBe(false)
  })
  it('treats undefined/empty as incorrect', () => {
    expect(checkAnswer(q({ correctAnswer: 'TRUE' }), undefined)).toBe(false)
    expect(checkAnswer(q({ correctAnswer: 'TRUE' }), '')).toBe(false)
  })
  it('compares array answers order-independently', () => {
    expect(checkAnswer(q({ correctAnswer: ['A', 'C'] }), ['C', 'A'])).toBe(true)
    expect(checkAnswer(q({ correctAnswer: ['A', 'C'] }), ['A', 'B'])).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test`
Expected: FAIL (`normalizeAnswer`/`checkAnswer` not exported).

- [ ] **Step 3: Implement at the top of `src/utils/scoring.ts`**

Add (keep existing exports below for now):
```ts
import type { Question } from '../types/ielts';

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function checkAnswer(
  question: Question,
  userAnswer: string | string[] | undefined,
): boolean {
  if (userAnswer === undefined) return false;
  const correct = question.correctAnswer;

  if (Array.isArray(correct)) {
    if (!Array.isArray(userAnswer)) return false;
    if (correct.length !== userAnswer.length) return false;
    const a = correct.map(normalizeAnswer).sort();
    const b = userAnswer.map(normalizeAnswer).sort();
    return a.every((v, i) => v === b[i]);
  }

  if (Array.isArray(userAnswer)) return false;
  if (userAnswer.trim() === '') return false;
  const accepted = [correct, ...(question.acceptableAnswers ?? [])].map(normalizeAnswer);
  return accepted.includes(normalizeAnswer(userAnswer));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit & push**

```bash
git add -A && git commit -m "feat: add normalizeAnswer and checkAnswer with variant support"
git push origin main
```

---

## Task 4: Scoring — threshold-based `calculateBandScore`

**Files:**
- Modify: `src/utils/scoring.ts` (replace `calculateBandScore`)
- Modify: `src/utils/scoring.test.ts`

Note: the current `calculateBandScore` is broken — `Object.entries` iterates the numeric-keyed map ascending, so the loop returns the floor band for almost any score. Replace it with explicit descending threshold tables.

- [ ] **Step 1: Add failing tests**

Append to `src/utils/scoring.test.ts`:
```ts
import { calculateBandScore } from './scoring'

describe('calculateBandScore (academic)', () => {
  const cases: [number, number][] = [
    [40, 9.0], [39, 9.0], [38, 8.5], [37, 8.5], [36, 8.0], [35, 8.0],
    [34, 7.5], [33, 7.5], [32, 7.0], [30, 7.0], [29, 6.5], [27, 6.5],
    [26, 6.0], [23, 6.0], [22, 5.5], [19, 5.5], [18, 5.0], [15, 5.0],
    [14, 4.5], [13, 4.5], [12, 4.0], [10, 4.0], [9, 3.5], [6, 3.0], [0, 0.0],
  ]
  it.each(cases)('score %i -> band %f', (score, band) => {
    expect(calculateBandScore(score, 'academic')).toBe(band)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test`
Expected: FAIL (old logic returns wrong bands).

- [ ] **Step 3: Replace `calculateBandScore` in `src/utils/scoring.ts`**

Remove the `import { BAND_SCORE_MAPPING } ...` line and the old function body; replace with:
```ts
const ACADEMIC_BANDS: [number, number][] = [
  [39, 9.0], [37, 8.5], [35, 8.0], [33, 7.5], [30, 7.0], [27, 6.5],
  [23, 6.0], [19, 5.5], [15, 5.0], [13, 4.5], [10, 4.0], [8, 3.5],
  [6, 3.0], [4, 2.5], [3, 2.0], [1, 1.0], [0, 0.0],
];

const GENERAL_BANDS: [number, number][] = [
  [40, 9.0], [39, 8.5], [38, 8.0], [36, 7.5], [34, 7.0], [32, 6.5],
  [30, 6.0], [27, 5.5], [23, 5.0], [19, 4.5], [15, 4.0], [12, 3.5],
  [9, 3.0], [6, 2.5], [4, 2.0], [1, 1.0], [0, 0.0],
];

export function calculateBandScore(
  correctAnswers: number,
  testType: 'academic' | 'general' = 'academic',
): number {
  const c = Math.max(0, Math.min(40, Math.round(correctAnswers)));
  const table = testType === 'general' ? GENERAL_BANDS : ACADEMIC_BANDS;
  for (const [threshold, band] of table) {
    if (c >= threshold) return band;
  }
  return 0;
}
```

(Leave the other helpers — `getScoreRequirements`, `calculatePercentage`, `getBandDescription`, `getDetailedBandDescription` — unchanged.)

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: succeeds (BAND_SCORE_MAPPING in types is now unused but still exported — fine).

- [ ] **Step 6: Commit & push**

```bash
git add -A && git commit -m "fix: correct band-score calculation with descending thresholds"
git push origin main
```

---

## Task 5: Scoring — `buildTestResult` + feedback

**Files:**
- Modify: `src/utils/scoring.ts`
- Modify: `src/utils/scoring.test.ts`

- [ ] **Step 1: Add failing test**

Append to `src/utils/scoring.test.ts`:
```ts
import { buildTestResult } from './scoring'
import type { ReadingPassage, TestSession } from '../types/ielts'

const passage: ReadingPassage = {
  id: 'p1', title: 't', content: 'c', type: 'academic',
  difficulty: 'medium', wordCount: 10, topic: 'x',
}
const questions: Question[] = [
  q({ id: 'a', passageId: 'p1', type: 'multiple-choice', correctAnswer: 'X', questionNumber: 1 }),
  q({ id: 'b', passageId: 'p1', type: 'multiple-choice', correctAnswer: 'Y', questionNumber: 2 }),
  q({ id: 'c', passageId: 'p1', type: 'true-false-not-given', correctAnswer: 'TRUE', questionNumber: 3 }),
]

describe('buildTestResult', () => {
  it('counts correct answers and builds per-type breakdown', () => {
    const session: TestSession = {
      id: 's', startTime: new Date('2026-01-01T00:00:00Z'),
      endTime: new Date('2026-01-01T00:30:00Z'), timeLimit: 60,
      isCompleted: true, isPaused: false, currentQuestionIndex: 0,
      answers: { a: 'X', b: 'Z', c: 'TRUE' },
      passages: [passage], questions,
    }
    const r = buildTestResult(session)
    expect(r.correctAnswers).toBe(2)
    expect(r.totalQuestions).toBe(3)
    expect(r.timeSpent).toBe(30)
    expect(r.bandScore).toBe(calculateBandScore(2, 'academic'))
    expect(r.feedback.detailedResults['multiple-choice'].correct).toBe(1)
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test`
Expected: FAIL (`buildTestResult` not exported).

- [ ] **Step 3: Implement in `src/utils/scoring.ts`**

Add imports at top (merge with existing `import type`):
```ts
import type { Question, TestSession, TestResult, UserAnswer, TestFeedback } from '../types/ielts';
```
Append:
```ts
export function buildTestResult(session: TestSession): TestResult {
  const userAnswers: UserAnswer[] = session.questions.map((question) => ({
    questionId: question.id,
    answer: session.answers[question.id] ?? '',
    timeSpent: 0,
    isCorrect: checkAnswer(question, session.answers[question.id]),
  }));

  const correctAnswers = userAnswers.filter((a) => a.isCorrect).length;
  const testType = session.passages[0]?.type ?? 'academic';
  const bandScore = calculateBandScore(correctAnswers, testType);
  const completedAt = session.endTime ?? new Date();
  const timeSpent = Math.max(
    0,
    Math.round((completedAt.getTime() - session.startTime.getTime()) / 60000),
  );

  return {
    sessionId: session.id,
    totalQuestions: session.questions.length,
    correctAnswers,
    score: correctAnswers,
    bandScore,
    timeSpent,
    answers: userAnswers,
    completedAt,
    feedback: buildFeedback(userAnswers, session.questions, bandScore),
  };
}

export function buildFeedback(
  answers: UserAnswer[],
  questions: Question[],
  bandScore: number,
): TestFeedback {
  const total = answers.length || 1;
  const correct = answers.filter((a) => a.isCorrect).length;
  const accuracy = correct / total;

  const strengths: string[] = [];
  if (accuracy >= 0.8) strengths.push('Excellent overall comprehension');
  if (accuracy >= 0.7) strengths.push('Strong reading skills');
  if (accuracy >= 0.6) strengths.push('Good understanding of main ideas');

  const weaknesses: string[] = [];
  if (accuracy < 0.7) weaknesses.push('Could benefit from more vocabulary practice');
  if (accuracy < 0.6) weaknesses.push('Work on identifying specific detail');
  if (accuracy < 0.5) weaknesses.push('Difficulty with overall comprehension');

  const recommendations: string[] = [];
  if (bandScore < 6.0) {
    recommendations.push('Focus on building vocabulary');
    recommendations.push('Practice skimming and scanning techniques');
  } else if (bandScore < 7.0) {
    recommendations.push("Work on identifying the writer's opinion and attitude");
    recommendations.push('Practice inference questions');
  } else {
    recommendations.push('Focus on the hardest question types');
    recommendations.push('Practice under strict time pressure');
  }

  const detailedResults: TestFeedback['detailedResults'] = {};
  for (const question of questions) {
    const a = answers.find((x) => x.questionId === question.id);
    const answered = a && a.answer !== '' && !(Array.isArray(a.answer) && a.answer.length === 0);
    const bucket = (detailedResults[question.type] ??= { attempted: 0, correct: 0, accuracy: 0 });
    if (answered) bucket.attempted += 1;
    if (a?.isCorrect) bucket.correct += 1;
  }
  for (const key of Object.keys(detailedResults)) {
    const b = detailedResults[key];
    b.accuracy = b.attempted > 0 ? b.correct / b.attempted : 0;
  }

  return {
    overallPerformance: getBandDescription(bandScore),
    strengths,
    weaknesses,
    recommendations,
    detailedResults,
  };
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit & push**

```bash
git add -A && git commit -m "feat: add buildTestResult and feedback builder"
git push origin main
```

---

## Task 6: localStorage persistence utilities

**Files:**
- Create: `src/utils/storage.ts`
- Create: `src/utils/storage.test.ts`

- [ ] **Step 1: Write failing tests**

`src/utils/storage.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { loadSession, saveSession, clearSession, type PersistedSession } from './storage'

const sample: PersistedSession = {
  id: 's1', startTime: '2026-01-01T00:00:00.000Z',
  answers: { q1: 'A' }, flaggedQuestions: [2], visitedQuestions: [0, 1],
  currentQuestionIndex: 1, timeRemaining: 3500, isCompleted: false,
}

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips a session', () => {
    saveSession(sample)
    expect(loadSession()).toEqual(sample)
  })
  it('returns null when empty', () => {
    expect(loadSession()).toBeNull()
  })
  it('returns null on corrupt data', () => {
    localStorage.setItem('ielts-mock:session-v1', '{not json')
    expect(loadSession()).toBeNull()
  })
  it('clears', () => {
    saveSession(sample)
    clearSession()
    expect(loadSession()).toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement `src/utils/storage.ts`**

```ts
const KEY = 'ielts-mock:session-v1';

export interface PersistedSession {
  id: string;
  startTime: string;                       // ISO
  answers: Record<string, string | string[]>;
  flaggedQuestions: number[];
  visitedQuestions: number[];
  currentQuestionIndex: number;
  timeRemaining: number;                    // seconds
  isCompleted: boolean;
}

export function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
}

export function saveSession(session: PersistedSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export function updateSession(partial: Partial<PersistedSession>): void {
  const current = loadSession();
  if (!current) return;
  saveSession({ ...current, ...partial });
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test`
Expected: PASS.

- [ ] **Step 5: Commit & push**

```bash
git add -A && git commit -m "feat: add localStorage session persistence utils"
git push origin main
```

---

## Task 7: Data validation test + author Passage 1 (Q1–13)

**Files:**
- Create: `src/data/mockTestData.test.ts`
- Modify: `src/data/mockTestData.ts` (begin full rewrite — Passage 1 + Q1–13)

This task introduces the winnability test and the canonical content format. Passages 2 and 3 (Tasks 8–9) follow the same shape.

- [ ] **Step 1: Write the validation test (gates ALL content)**

`src/data/mockTestData.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { mockTestData } from './mockTestData'

const SINGLE_TOKEN_TYPES = new Set([
  'multiple-choice', 'true-false-not-given', 'yes-no-not-given',
  'matching-headings', 'matching-information', 'matching-features',
])

describe('mockTestData integrity', () => {
  const { passages, questions } = mockTestData

  it('has well-formed questions', () => {
    for (const q of questions) {
      expect(q.id, `q${q.questionNumber} id`).toBeTruthy()
      expect(passages.some((p) => p.id === q.passageId), `q${q.questionNumber} passage`).toBe(true)
      expect(q.explanation, `q${q.questionNumber} explanation`).toBeTruthy()
      // For token-choice types the correct answer must be one of the rendered options.
      if (SINGLE_TOKEN_TYPES.has(q.type)) {
        expect(Array.isArray(q.options), `q${q.questionNumber} options`).toBe(true)
        const opts = q.options ?? []
        const answers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]
        for (const a of answers) {
          expect(opts, `q${q.questionNumber} answer "${a}" must be an option`).toContain(a)
        }
      }
    }
  })

  it('numbers questions 1..N uniquely and ascending', () => {
    const nums = questions.map((q) => q.questionNumber)
    expect(new Set(nums).size).toBe(nums.length)
    expect([...nums].sort((a, b) => a - b)).toEqual(nums)
  })
})
```

(Note: the final "exactly 40 questions / 3 passages" assertion is added in Task 9 once all content exists, so intermediate tasks stay green.)

- [ ] **Step 2: Run to verify failure**

Run: `npm run test`
Expected: FAIL — the old `matching-information` q8 stores `"Paragraph 4"` which is not in its options, violating the convention.

- [ ] **Step 3: Rewrite `src/data/mockTestData.ts` — header + Passage 1**

Replace the file. Passage 1 is the canonical worked example; author ~750 words with paragraphs labeled `A`–`F` inside `content` (use `\n\n` between paragraphs, each starting with its label, e.g. `"A\n\nText..."`). Provide Q1–13 exactly per this structure (full, real content — no placeholders):

```ts
import type { ReadingPassage, Question } from '../types/ielts';

export const mockTestData = {
  passages: [
    {
      id: 'passage-1',
      title: 'Bioluminescence: Living Light',
      content: `A\n\n<~150 words introducing bioluminescence>\n\nB\n\n<~150 words>\n\nC\n\n<...>\n\nD\n\n<...>\n\nE\n\n<...>\n\nF\n\n<...>`,
      type: 'academic',
      difficulty: 'medium',
      wordCount: 750,
      topic: 'Biology',
      source: 'Academic Reading Practice',
    },
    // passage-2 added in Task 8, passage-3 in Task 9
  ] as ReadingPassage[],

  questions: [
    // --- Passage 1, Q1-5: Matching Headings ---
    {
      id: 'q1', passageId: 'passage-1', type: 'matching-headings', questionNumber: 1,
      groupId: 'p1-headings',
      groupInstruction: 'Questions 1–5: The passage has six paragraphs A–F. Choose the correct heading for paragraphs A–E from the list of headings below.',
      groupContent: 'List of Headings\ni  How light is produced chemically\nii  Defensive uses of light\niii  A definition and distribution\niv  Communication in the deep sea\nv  Human applications in research\nvi  The cost of producing light\nvii  Attracting prey\nviii  Future medical uses',
      instruction: 'Choose the correct heading for Paragraph A.',
      question: 'Paragraph A',
      options: ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'],
      correctAnswer: 'iii',
      points: 1,
      explanation: 'Paragraph A defines bioluminescence and where it occurs.',
    },
    // q2..q5 same shape (Paragraph B..E), each correctAnswer a distinct numeral from the bank
    // --- Q6-9: True/False/Not Given ---
    {
      id: 'q6', passageId: 'passage-1', type: 'true-false-not-given', questionNumber: 6,
      groupId: 'p1-tfng',
      groupInstruction: 'Questions 6–9: Do the following statements agree with the information in the passage? Write TRUE, FALSE, or NOT GIVEN.',
      instruction: 'Write TRUE, FALSE or NOT GIVEN.',
      question: '<statement grounded in the passage>',
      options: ['TRUE', 'FALSE', 'NOT GIVEN'],
      correctAnswer: 'TRUE',
      points: 1,
      explanation: '<why, citing the passage>',
    },
    // q7..q9
    // --- Q10-13: Summary Completion ---
    {
      id: 'q10', passageId: 'passage-1', type: 'summary-completion', questionNumber: 10,
      groupId: 'p1-summary',
      groupInstruction: 'Questions 10–13: Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.',
      groupContent: 'Many organisms produce light through a reaction between a molecule called (10) ________ and the enzyme (11) ________. The reaction is described as "cold" because it wastes very little (12) ________. In the ocean, the most common colour of this light is (13) ________.',
      instruction: 'Write your answer for gap 10.',
      question: 'Question 10',
      correctAnswer: 'luciferin',
      acceptableAnswers: [],
      wordLimit: 2,
      points: 1,
      explanation: '<cite the passage sentence>',
    },
    // q11..q13
  ] as Question[],
};
```

Author the real prose and the remaining Q2–q5, q7–q9, q11–q13 to the same standard. Every `correctAnswer` for matching/MC/TF types MUST appear in that question's `options`. Every completion/short-answer `correctAnswer` MUST be a word/phrase that actually appears in the passage.

- [ ] **Step 4: Run the validation + scoring tests**

Run: `npm run test`
Expected: PASS for `mockTestData.test.ts` (for the 13 questions present) and all scoring tests.

- [ ] **Step 5: Commit & push**

```bash
git add -A && git commit -m "feat: add data validation test and author Passage 1 (Q1-13)"
git push origin main
```

---

## Task 8: Author Passage 2 (Q14–26)

**Files:**
- Modify: `src/data/mockTestData.ts`

- [ ] **Step 1: Add `passage-2` to the `passages` array**

~780-word academic passage, paragraphs A–F, distinct neutral topic (e.g. "The Economics of Urban Green Space"). Same object shape as Passage 1.

- [ ] **Step 2: Add Q14–26 to the `questions` array**

- Q14–18 **multiple-choice**: `options` are 4 full-text choices; `correctAnswer` is the exact correct option text.
- Q19–22 **matching-information**: `groupInstruction` "Which paragraph contains the following information? Write the correct letter A–F."; `options: ['A','B','C','D','E','F']`; `correctAnswer` a letter; add `groupContent: 'NB You may use any letter more than once.'` where applicable.
- Q23–26 **short-answer**: `instruction` "Answer using NO MORE THAN THREE WORDS"; `wordLimit: 3`; `correctAnswer` is text from the passage; add spelling/synonym variants in `acceptableAnswers`.

Every token-type `correctAnswer` must be in its `options`; every text answer must appear in the passage; every question needs an `explanation`.

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: PASS (26 questions now present and well-formed).

- [ ] **Step 4: Commit & push**

```bash
git add -A && git commit -m "feat: author Passage 2 (Q14-26)"
git push origin main
```

---

## Task 9: Author Passage 3 (Q27–40) + finalize count assertion

**Files:**
- Modify: `src/data/mockTestData.ts`
- Modify: `src/data/mockTestData.test.ts`

- [ ] **Step 1: Add `passage-3` + Q27–40**

~820-word academic passage, paragraphs A–G, distinct topic (e.g. "How Children Acquire Language").
- Q27–31 **yes-no-not-given**: `options: ['YES','NO','NOT GIVEN']`; `correctAnswer` one of them.
- Q32–35 **matching-features**: `groupContent` lists features, e.g. `'A  Chomsky\nB  Skinner\nC  Tomasello'`; `options: ['A','B','C']`; `correctAnswer` a letter; `groupInstruction` explains matching statements to researchers.
- Q36–40 **table-completion**: `groupContent` is a small text table/notes with numbered blanks `(36) ________`; each question is one blank with `wordLimit` and `correctAnswer` text from the passage.

- [ ] **Step 2: Add the final totals assertion**

Append to `src/data/mockTestData.test.ts`:
```ts
describe('mockTestData totals', () => {
  it('has exactly 3 passages and 40 questions numbered 1..40', () => {
    expect(mockTestData.passages).toHaveLength(3)
    expect(mockTestData.questions).toHaveLength(40)
    expect(mockTestData.questions.map((q) => q.questionNumber)).toEqual(
      Array.from({ length: 40 }, (_, i) => i + 1),
    )
  })
})
```

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: PASS (all 40 questions present and winnable).

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Commit & push**

```bash
git add -A && git commit -m "feat: author Passage 3 (Q27-40); 40-question test complete"
git push origin main
```

---

## Task 10: Rework `useTestSession` (scoring + persistence + nav state + resume)

**Files:**
- Modify: `src/hooks/useTestSession.ts`

Move navigation/flag/visited state into the hook and persist via `storage.ts`; produce `TestResult` via `buildTestResult`.

- [ ] **Step 1: Replace `src/hooks/useTestSession.ts`**

```ts
import { useState, useCallback, useEffect } from 'react';
import type { TestSession, TestResult } from '../types/ielts';
import { mockTestData } from '../data/mockTestData';
import { buildTestResult } from '../utils/scoring';
import { loadSession, saveSession, clearSession, type PersistedSession } from '../utils/storage';

const TIME_LIMIT_MIN = 60;

function freshSession(): TestSession {
  return {
    id: `test_${Date.now()}`,
    startTime: new Date(),
    timeLimit: TIME_LIMIT_MIN,
    isCompleted: false,
    isPaused: false,
    currentQuestionIndex: 0,
    answers: {},
    passages: mockTestData.passages,
    questions: mockTestData.questions,
  };
}

export const useTestSession = () => {
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));

  const savedSession = loadSession();
  const hasSavedSession = !!savedSession && !savedSession.isCompleted;

  const persist = useCallback((session: TestSession, extra: Partial<PersistedSession> = {}) => {
    const base: PersistedSession = {
      id: session.id,
      startTime: session.startTime.toISOString(),
      answers: session.answers,
      flaggedQuestions: [...flaggedQuestions],
      visitedQuestions: [...visitedQuestions],
      currentQuestionIndex,
      timeRemaining: TIME_LIMIT_MIN * 60,
      isCompleted: session.isCompleted,
    };
    const prev = loadSession();
    saveSession({ ...base, timeRemaining: prev?.timeRemaining ?? base.timeRemaining, ...extra });
  }, [flaggedQuestions, visitedQuestions, currentQuestionIndex]);

  const startTest = useCallback(() => {
    const session = freshSession();
    setTestSession(session);
    setCurrentQuestionIndex(0);
    setFlaggedQuestions(new Set());
    setVisitedQuestions(new Set([0]));
    setTestResult(null);
    saveSession({
      id: session.id,
      startTime: session.startTime.toISOString(),
      answers: {},
      flaggedQuestions: [],
      visitedQuestions: [0],
      currentQuestionIndex: 0,
      timeRemaining: TIME_LIMIT_MIN * 60,
      isCompleted: false,
    });
  }, []);

  const resumeTest = useCallback(() => {
    const saved = loadSession();
    if (!saved) { startTest(); return; }
    setTestSession({
      id: saved.id,
      startTime: new Date(saved.startTime),
      timeLimit: TIME_LIMIT_MIN,
      isCompleted: false,
      isPaused: false,
      currentQuestionIndex: saved.currentQuestionIndex,
      answers: saved.answers,
      passages: mockTestData.passages,
      questions: mockTestData.questions,
    });
    setCurrentQuestionIndex(saved.currentQuestionIndex);
    setFlaggedQuestions(new Set(saved.flaggedQuestions));
    setVisitedQuestions(new Set(saved.visitedQuestions));
    setTestResult(null);
  }, [startTest]);

  const restartTest = useCallback(() => {
    clearSession();
    startTest();
  }, [startTest]);

  const submitAnswer = useCallback((questionId: string, answer: string | string[]) => {
    setTestSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, answers: { ...prev.answers, [questionId]: answer } };
      persist(next, { answers: next.answers });
      return next;
    });
  }, [persist]);

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => new Set(prev).add(index));
  }, []);

  const toggleFlag = useCallback((index: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  }, []);

  // Persist nav/flag/visited whenever they change and a test is active.
  useEffect(() => {
    if (testSession && !testSession.isCompleted) {
      const saved = loadSession();
      if (saved) {
        saveSession({
          ...saved,
          flaggedQuestions: [...flaggedQuestions],
          visitedQuestions: [...visitedQuestions],
          currentQuestionIndex,
        });
      }
    }
  }, [flaggedQuestions, visitedQuestions, currentQuestionIndex, testSession]);

  const completeTest = useCallback(() => {
    setTestSession((prev) => {
      if (!prev) return prev;
      const finished = { ...prev, endTime: new Date(), isCompleted: true };
      setTestResult(buildTestResult(finished));
      clearSession();
      return finished;
    });
  }, []);

  return {
    testSession, testResult, hasSavedSession,
    currentQuestionIndex, flaggedQuestions, visitedQuestions,
    startTest, resumeTest, restartTest,
    submitAnswer, goToQuestion, toggleFlag, completeTest,
  };
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds (App/TestInterface still compile; they're updated in later tasks but their current props remain compatible until then — if not, proceed to Tasks 15/17 before building). If type errors arise from removed exports (`navigateToQuestion`), they are fixed in Task 15/17.

- [ ] **Step 3: Run tests**

Run: `npm run test`
Expected: PASS (pure utils unaffected).

- [ ] **Step 4: Commit & push**

```bash
git add -A && git commit -m "refactor: useTestSession owns nav/flag state, persistence, and TestResult"
git push origin main
```

---

## Task 11: Persist & resume the timer

**Files:**
- Modify: `src/hooks/useTimer.ts`

- [ ] **Step 1: Update `useTimer` to seed from storage and persist each tick**

Replace the body so it (a) initializes `timeRemaining` from the saved session if present, and (b) writes `timeRemaining` to storage every tick:
```ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { loadSession, updateSession } from '../utils/storage';

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
}

export const useTimer = (initialTime: number) => {
  const saved = loadSession();
  const seed = saved && !saved.isCompleted ? saved.timeRemaining : initialTime;

  const [timeRemaining, setTimeRemaining] = useState(seed);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const remainingRef = useRef(timeRemaining);
  remainingRef.current = timeRemaining;

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    setHasStarted(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    setHasStarted(false);
  }, [initialTime]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;
    const id = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev <= 1 ? 0 : prev - 1;
        updateSession({ timeRemaining: next });
        if (next === 0) setIsRunning(false);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, timeRemaining]);

  return { timeRemaining, isRunning, isPaused, hasStarted, setTimeRemaining, startTimer, pauseTimer, resetTimer, stopTimer };
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit & push**

```bash
git add -A && git commit -m "feat: persist and resume the exam timer across reloads"
git push origin main
```

---

## Task 12: Question rendering — fix conventions + group content + completion

**Files:**
- Modify: `src/components/QuestionComponent.tsx`

- [ ] **Step 1: Render group instruction + group content above the question**

In the returned JSX, before the existing instruction block, add (only when present):
```tsx
{question.groupInstruction && (
  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
    <p className={`text-indigo-900 font-semibold ${getFontSizeClass()}`}>{question.groupInstruction}</p>
  </div>
)}
{question.groupContent && (
  <pre className={`whitespace-pre-wrap font-sans bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 ${getFontSizeClass()}`}>{question.groupContent}</pre>
)}
```

- [ ] **Step 2: Replace the three matching renderers with one token-dropdown**

Delete `renderMatchingHeadings` and `renderMatchingInformation`; add:
```tsx
const renderTokenDropdown = (placeholder: string) => (
  <select
    value={(localAnswer as string) || ''}
    onChange={(e) => handleAnswerChange(e.target.value)}
    className={`answer-input w-full ${getFontSizeClass()}`}
  >
    <option value="">{placeholder}</option>
    {question.options?.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);
```

- [ ] **Step 3: Add a word-limit hint helper and use it in completion/short-answer**

```tsx
const wordLimitHint = () =>
  question.wordLimit
    ? `Use no more than ${question.wordLimit} word${question.wordLimit > 1 ? 's' : ''} from the passage.`
    : 'Use words from the passage.';
```
Update `renderShortAnswer` and `renderSentenceCompletion` to show `{wordLimitHint()}` instead of the hard-coded hints, and to use `className="answer-input w-full ..."` (already used).

- [ ] **Step 4: Update the `switch` in `renderQuestionContent`**

```tsx
case 'matching-headings':
case 'matching-information':
case 'matching-features':
  return renderTokenDropdown('— Select —');
case 'table-completion':
  return renderSentenceCompletion();
```
(Keep `multiple-choice`, `true-false-not-given`, `yes-no-not-given`, `short-answer`, `sentence-completion`, `summary-completion`, `default` as-is.)

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: succeeds (remove now-unused option-letter logic to satisfy `noUnusedLocals`).

- [ ] **Step 6: Commit & push**

```bash
git add -A && git commit -m "feat: group content rendering + token dropdowns + word-limit hints"
git push origin main
```

---

## Task 13: Passage paragraph labels + highlighter

**Files:**
- Modify: `src/components/PassageDisplay.tsx`

- [ ] **Step 1: Render paragraph labels and add select-to-highlight**

Replace the component body so each paragraph whose first line is a bare label (`A`–`G`) renders that label as a bold tag, and add a highlighter: wrap the passage text in a container; on `mouseup`, if there is a non-empty selection inside the passage, wrap it in `<mark class="highlight">`; clicking a `<mark>` unwraps it.

```tsx
import React, { useRef } from 'react';
import type { ReadingPassage } from '../types/ielts';

interface PassageDisplayProps {
  passage: ReadingPassage;
  fontSize: 'small' | 'medium' | 'large';
  highlightEnabled: boolean;
}

const PassageDisplay: React.FC<PassageDisplayProps> = ({ passage, fontSize, highlightEnabled }) => {
  const ref = useRef<HTMLDivElement>(null);
  const fontClass = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

  const handleMouseUp = () => {
    if (!highlightEnabled) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !ref.current) return;
    const range = sel.getRangeAt(0);
    if (!ref.current.contains(range.commonAncestorContainer)) return;
    try {
      const mark = document.createElement('mark');
      mark.className = 'highlight';
      range.surroundContents(mark);
      sel.removeAllRanges();
    } catch {
      /* selection spans element boundaries — ignore */
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'MARK') {
      const parent = target.parentNode!;
      while (target.firstChild) parent.insertBefore(target.firstChild, target);
      parent.removeChild(target);
    }
  };

  const blocks = passage.content.split('\n\n');
  // Pair a lone label line (A-G) with the following text block.
  const paragraphs: { label?: string; text: string }[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i].trim();
    if (/^[A-G]$/.test(b) && i + 1 < blocks.length) {
      paragraphs.push({ label: b, text: blocks[++i].trim() });
    } else if (b) {
      paragraphs.push({ text: b });
    }
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{passage.title}</h2>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <span className="capitalize">{passage.type}</span><span>•</span>
          <span className="capitalize">{passage.difficulty}</span><span>•</span>
          <span>{passage.wordCount} words</span>
        </div>
      </div>
      <div
        ref={ref}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className={`passage-text ${fontClass} space-y-4 ${highlightEnabled ? 'cursor-text' : ''}`}
      >
        {paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed text-gray-800">
            {p.label && <span className="font-bold mr-2">{p.label}</span>}
            {p.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PassageDisplay;
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: fails only where `TestInterface` still passes `highlightedText` — fixed in Task 15. Otherwise succeeds.

- [ ] **Step 3: Commit & push**

```bash
git add -A && git commit -m "feat: paragraph labels and select-to-highlight in the passage"
git push origin main
```

---

## Task 14: Navigation grid grouped by passage

**Files:**
- Modify: `src/components/NavigationPanel.tsx`

- [ ] **Step 1: Accept passage groupings and render segmented grids**

Add an optional prop `groups?: { label: string; start: number; end: number }[]` (indices, inclusive). If provided, render one labeled 1-based grid per group; otherwise fall back to the current flat grid. Keep the existing legend, `getQuestionClass`, and summary stats. The per-button rendering stays identical; only the outer loop changes to iterate groups.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds (prop is optional).

- [ ] **Step 3: Commit & push**

```bash
git add -A && git commit -m "feat: group the question navigation grid by passage"
git push origin main
```

---

## Task 15: TestInterface — toolbar + wire hook state

**Files:**
- Modify: `src/components/TestInterface.tsx`

- [ ] **Step 1: Update props to take hook-owned state + font/highlight controls**

New `TestInterfaceProps`:
```ts
interface TestInterfaceProps {
  testSession: TestSession | null;
  onSubmitAnswer: (questionId: string, answer: string | string[]) => void;
  timeRemaining: number;
  fontSize: 'small' | 'medium' | 'large';
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void;
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
  flaggedQuestions: Set<number>;
  onToggleFlag: (index: number) => void;
  visitedQuestions: Set<number>;
}
```
Remove the local `useState` for `currentQuestionIndex`, `flaggedQuestions`, `visitedQuestions` (now props). Keep local `showPassage`. Add local `highlightEnabled` state.

- [ ] **Step 2: Add a toolbar above the panels**

A small bar with font-size buttons (`A−`/`A`/`A+` calling `onFontSizeChange('small'|'medium'|'large')`) and a Highlighter toggle button (`setHighlightEnabled(v => !v)`), using lucide `Highlighter`, `Type` icons.

- [ ] **Step 3: Replace navigation handlers to use props**

`handleQuestionNavigation(i)` → `onNavigate(i)`; Prev/Next call `onNavigate(currentQuestionIndex ± 1)`; flag buttons call `onToggleFlag(currentQuestionIndex)`. Pass `groups` to `NavigationPanel` built from `testSession.passages` (compute each passage's question index range). Pass `highlightEnabled` to `PassageDisplay` and remove the old `highlightedText` prop usage.

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: succeeds.

- [ ] **Step 5: Commit & push**

```bash
git add -A && git commit -m "feat: test toolbar (font size + highlighter) and hook-driven navigation"
git push origin main
```

---

## Task 16: TestResults — consume TestResult + full review

**Files:**
- Modify: `src/components/TestResults.tsx`

- [ ] **Step 1: Change props to accept the computed result**

```ts
interface TestResultsProps {
  testSession: TestSession | null;
  testResult: TestResult | null;
  onRetake: () => void;
}
```
Delete the inline band-score `(() => { if (correctAnswers >= 36) ... })()` and the manual correctness recomputation. Read `bandScore`, `correctAnswers`, `timeSpent`, `feedback` from `testResult`. Guard: if `!testResult || !testSession` show the empty state.

- [ ] **Step 2: Replace the Question Review block with per-question detail**

For each question, show: number, type, your answer (from `testSession.answers`, rendered readably — join arrays with `, `; show "Not answered" when empty), the correct answer (`question.correctAnswer`, arrays joined), a correct/incorrect/unanswered badge (from `testResult.answers[i].isCorrect`), and an expandable `question.explanation`. Add filter buttons (All / Incorrect / Unanswered) backed by local `useState`.

- [ ] **Step 3: Add per-type accuracy breakdown**

Render `testResult.feedback.detailedResults` as rows: type label, `correct/attempted`, accuracy %.

- [ ] **Step 4: Fix actions**

"Take Another Test" calls `onRetake()` (no `window.location.reload()`); keep Print via `window.print()`.

- [ ] **Step 5: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: succeeds.

- [ ] **Step 6: Commit & push**

```bash
git add -A && git commit -m "feat: results screen consumes TestResult with full per-question review"
git push origin main
```

---

## Task 17: TestInstructions resume/restart + App wiring

**Files:**
- Modify: `src/components/TestInstructions.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add Resume/Restart to `TestInstructions`**

Props:
```ts
interface TestInstructionsProps {
  onStartTest: () => void;
  hasSavedSession: boolean;
  onResume: () => void;
  onRestart: () => void;
}
```
When `hasSavedSession`, show a banner with **Resume previous test** (`onResume`) and **Start over** (`onRestart`); otherwise show the existing **Start Test** button (`onStartTest`). Update the line "the timer cannot be paused" → "you may pause the timer at any time" (this is a practice test).

- [ ] **Step 2: Rewrite `App.tsx` wiring**

- Pull `hasSavedSession`, `currentQuestionIndex`, `flaggedQuestions`, `visitedQuestions`, `testResult`, `resumeTest`, `restartTest`, `goToQuestion`, `toggleFlag` from `useTestSession`.
- Add `onFontSizeChange` updating `uiState.fontSize`.
- `handleStartTest`/`handleResume`: hide instructions, `startTest()`/`resumeTest()`, `startTimer()`.
- `handleRetake`: `restartTest()`, reset timer (`resetTimer()` + `setTimeRemaining(3600)`), set `showInstructions: true`, `showResults: false`.
- On mount, if `hasSavedSession` keep showing instructions (with resume banner).
- Pass the new props through to `TestInterface`, `TestResults`, `TestInstructions`.
- Auto-submit effect unchanged (calls `handleCompleteTest`).

- [ ] **Step 3: Verify build + lint + tests**

Run: `npm run build && npm run lint && npm run test`
Expected: all succeed.

- [ ] **Step 4: Commit & push**

```bash
git add -A && git commit -m "feat: resume/restart flow and full App wiring"
git push origin main
```

---

## Task 18: Styling — add missing CSS classes; clean App.css

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`

- [ ] **Step 1: Add the referenced utility classes to `index.css`**

Append definitions for `.answer-input`, `.test-container`, `.passage-text`, `.highlight` (plus review-card spacing). Example:
```css
.test-container { max-width: 1024px; margin: 0 auto; padding: 1.5rem 1rem; }
.passage-text p { margin-bottom: 1rem; }
.answer-input {
  border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px;
  background: #fff; transition: border-color .15s, box-shadow .15s;
}
.answer-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15); }
.highlight { background: #fde68a; border-radius: 2px; cursor: pointer; }
@media print { .no-print { display: none !important; } }
```

- [ ] **Step 2: Clean `App.css`**

Remove the Vite boilerplate (`#root` centering + `max-width: 1280px` + `text-align: center`, `.logo`, `logo-spin`, `.card`, `.read-the-docs`). Leave the file empty or with a short comment, so the app uses full width and left-aligned text.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit & push**

```bash
git add -A && git commit -m "style: define missing utility classes and remove Vite boilerplate"
git push origin main
```

---

## Task 19: README, cleanup, and final verification

**Files:**
- Modify: `README.md`
- Delete: `README-new.md`
- Delete: `src/assets/react.svg` (if now unused)

- [ ] **Step 1: Update `README.md`**

Correct the feature list to match reality: 3 passages / 40 questions, persistence with resume, full review, font-size + highlighter, Vitest tests. Add `npm run test` to the scripts list. Fix the `cd mock` clone instruction to the real folder name.

- [ ] **Step 2: Delete stale files**

```bash
git rm README-new.md
```
Remove `src/assets/react.svg` only if nothing imports it (grep first).

- [ ] **Step 3: Full verification gate**

Run, and confirm each passes:
```bash
npm run lint
npm run test
npm run build
```
Expected: lint clean, all tests pass, build succeeds.

- [ ] **Step 4: Manual smoke test**

Run: `npm run preview` (after build) or `npm run dev`. Verify in the browser:
1. Instructions → Start → 40 questions navigable; passage shows beside questions.
2. Answer several questions of each type; refresh mid-test → answers, flags, navigation, and clock resume; instructions offer Resume/Restart.
3. Font-size buttons change text size; highlighter marks and un-marks selected passage text.
4. Submit → results show a sensible band score, per-type breakdown, and per-question review with your answer / correct answer / explanation; filters work; "Take Another Test" returns to a fresh test.

- [ ] **Step 5: Commit & push**

```bash
git add -A && git commit -m "docs: update README; remove stale files; finalize"
git push origin main
```

---

## Self-Review

**Spec coverage:**
- §2 single-source results → Tasks 5, 10, 16. ✓
- §3 data model + answer convention → Tasks 2, 12; enforced by Task 7 test. ✓
- §4 content (40 Qs, 9 types) → Tasks 7–9. ✓
- §5 persistence + timer resume → Tasks 6, 10, 11, 17. ✓
- §6 font size + highlighter → Tasks 12, 13, 15. ✓
- §7 review screen → Task 16. ✓
- §8 CSS → Task 18. ✓
- §9 testing + README → Tasks 1, 3–9, 19. ✓
- §10 out-of-scope respected (no backend, no diagram-labeling, highlights not persisted). ✓
- §11 acceptance criteria → Task 19 verification gate. ✓

**Placeholder scan:** Content tasks (7–9) intentionally generate creative prose against a strict validation test; all code-bearing steps contain complete code. Passage-1 object is the worked template; Passages 2–3 specify exact types/options/answer rules per question range.

**Type consistency:** `checkAnswer(question, answer)`, `calculateBandScore(n, type)`, `buildTestResult(session)`, `PersistedSession`, and the hook return shape are used identically across tasks 10/11/16/17. Renderer-emitted values match `correctAnswer` per the convention table and are enforced by `mockTestData.test.ts`.
