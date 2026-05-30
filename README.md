# IELTS Reading Mock Test

A complete, authentic-format IELTS **Academic Reading** mock test built with React, TypeScript and Vite. It delivers a full 60-minute test — 3 passages, 40 questions across 9 IELTS question types — with automatic band scoring, a detailed per-question review, and progress that survives a page refresh.

## ✨ Features

- **Authentic test** — 3 original academic passages and 40 questions:
  Matching Headings, True/False/Not Given, Summary Completion, Multiple Choice,
  Matching Information, Short Answer, Yes/No/Not Given, Matching Features, and
  Note/Table Completion.
- **60-minute timer** with auto-submit, pause/resume, and a low-time warning.
- **Resume after refresh** — answers, flags, navigation, and the remaining time are
  saved to `localStorage`; reopening the test offers **Resume** or **Start over**.
- **Accurate scoring** — every answer is normalised (case/whitespace, accepted variants)
  and converted to an IELTS band (1–9) using a proper raw-score conversion table.
- **Full review** — for each question see your answer, the correct answer, and an
  explanation; filter by All / Incorrect / Unanswered, with a per-question-type accuracy
  breakdown. Print-friendly.
- **Reading aids** — adjustable font size (A− / A / A+) and a passage highlighter
  (select to highlight; click a highlight to remove it).
- **Tested logic** — Vitest unit tests cover answer-checking, band-score conversion,
  result assembly, persistence, and verify that every authored question is winnable.

## 🛠️ Tech Stack

React 19 · TypeScript 5.8 (strict) · Vite 6 · Tailwind CSS v4 · lucide-react · Vitest + jsdom

## 📁 Project Structure

```
src/
├── components/        # TestInstructions, TestInterface, PassageDisplay,
│                      # QuestionComponent, NavigationPanel, TestResults
├── hooks/             # useTestSession (state + persistence + result), useTimer
├── utils/             # scoring.ts (answer check, band score, result), storage.ts
├── types/             # ielts.ts — shared interfaces
└── data/              # mockTestData.ts — passages + 40 questions
docs/superpowers/      # design spec and implementation plan
```

## 🏃 Getting Started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
```

### Scripts

- `npm run dev` — start the development server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
- `npm run test` — run the unit tests (Vitest)

## 🎯 Taking a Test

1. **Start** from the instructions screen (or **Resume** a saved test).
2. **Read** each passage — it sits beside its questions; minimise it for more room.
3. **Answer** by selecting or typing; answers save automatically as you go.
4. **Navigate & flag** with the per-passage question grid.
5. **Submit** manually or let the timer auto-submit at 00:00.
6. **Review** your band score, accuracy by question type, and every question with the
   correct answer and an explanation.

## 🧩 Customising the Test

- **Content:** edit `src/data/mockTestData.ts`. The data-integrity test
  (`src/data/mockTestData.test.ts`) enforces that every choice answer is a valid option
  and every completion answer appears in its passage — run `npm run test` after editing.
- **Scoring:** adjust the conversion tables in `src/utils/scoring.ts`.

## 📄 License

MIT
