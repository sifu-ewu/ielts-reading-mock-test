import { describe, it, expect } from 'vitest'
import { mockTestData } from './mockTestData'

const SINGLE_TOKEN_TYPES = new Set([
  'multiple-choice', 'true-false-not-given', 'yes-no-not-given',
  'matching-headings', 'matching-information', 'matching-features',
])

describe('mockTestData integrity', () => {
  const { passages, questions } = mockTestData

  it('has well-formed, winnable questions', () => {
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
      } else {
        // Completion / short-answer: the correct answer must appear in its passage.
        const passage = passages.find((p) => p.id === q.passageId)!
        const haystack = passage.content.toLowerCase()
        const answer = (Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer).toLowerCase()
        expect(haystack.includes(answer), `q${q.questionNumber} answer "${answer}" must appear in the passage`).toBe(true)
      }
    }
  })

  it('numbers questions 1..N uniquely and ascending', () => {
    const nums = questions.map((q) => q.questionNumber)
    expect(new Set(nums).size).toBe(nums.length)
    expect([...nums].sort((a, b) => a - b)).toEqual(nums)
  })
})

describe('mockTestData totals', () => {
  it('has exactly 3 passages and 40 questions numbered 1..40', () => {
    expect(mockTestData.passages).toHaveLength(3)
    expect(mockTestData.questions).toHaveLength(40)
    expect(mockTestData.questions.map((q) => q.questionNumber)).toEqual(
      Array.from({ length: 40 }, (_, i) => i + 1),
    )
  })
})
