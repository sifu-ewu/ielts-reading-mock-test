import { describe, it, expect } from 'vitest'
import {
  normalizeAnswer,
  checkAnswer,
  calculateBandScore,
  buildTestResult,
} from './scoring'
import type { Question, ReadingPassage, TestSession } from '../types/ielts'

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

describe('buildTestResult', () => {
  const passage: ReadingPassage = {
    id: 'p1', title: 't', content: 'c', type: 'academic',
    difficulty: 'medium', wordCount: 10, topic: 'x',
  }
  const questions: Question[] = [
    q({ id: 'a', passageId: 'p1', type: 'multiple-choice', correctAnswer: 'X', questionNumber: 1 }),
    q({ id: 'b', passageId: 'p1', type: 'multiple-choice', correctAnswer: 'Y', questionNumber: 2 }),
    q({ id: 'c', passageId: 'p1', type: 'true-false-not-given', correctAnswer: 'TRUE', questionNumber: 3 }),
  ]

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
    expect(r.feedback.detailedResults['multiple-choice'].attempted).toBe(2)
  })
})
