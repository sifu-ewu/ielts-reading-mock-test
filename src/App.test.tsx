import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, within, act } from '@testing-library/react'
import App from './App'
import { saveSession } from './utils/storage'

describe('App (end-to-end flow)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  const startTest = () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /start test/i }))
  }

  it('renders the instructions screen first', () => {
    render(<App />)
    expect(screen.getByText(/Test Instructions/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start test/i })).toBeInTheDocument()
  })

  it('starts the test and shows the first question of 40', () => {
    startTest()
    expect(screen.getByText(/Question 1 of 40/i)).toBeInTheDocument()
  })

  it('navigates to the next question', () => {
    startTest()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/Question 2 of 40/i)).toBeInTheDocument()
  })

  it('submits with no answers and shows a band score of 0', () => {
    startTest()
    fireEvent.click(screen.getByRole('button', { name: /submit test/i }))
    expect(screen.getByText(/Test Results/i)).toBeInTheDocument()
    expect(screen.getByText('Band Score')).toBeInTheDocument()
    // The "Correct Answers" card (bg-blue-50) should read 0/40.
    const correctCard = screen.getByText('Correct Answers').closest('.bg-blue-50') as HTMLElement
    expect(within(correctCard).getByText('0/40')).toBeInTheDocument()
  })

  it('scores a correctly answered question', () => {
    startTest()
    // Q1 is matching-headings rendered as a dropdown; "iii" is the correct heading.
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'iii' } })
    fireEvent.click(screen.getByRole('button', { name: /submit test/i }))
    expect(screen.getByText(/Test Results/i)).toBeInTheDocument()
    // The "Correct Answers" card (bg-blue-50) should now read 1/40.
    const correctCard = screen.getByText('Correct Answers').closest('.bg-blue-50') as HTMLElement
    expect(within(correctCard).getByText('1/40')).toBeInTheDocument()
  })

  it('auto-submits when the timer reaches zero (regression)', () => {
    // Seed an in-progress session with 1 second left so a single tick expires it.
    saveSession({
      id: 'resume-1',
      startTime: new Date('2026-01-01T00:00:00Z').toISOString(),
      answers: {},
      flaggedQuestions: [],
      visitedQuestions: [0],
      currentQuestionIndex: 0,
      timeRemaining: 1,
      isCompleted: false,
    })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /^resume$/i }))
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    expect(screen.getByText(/Test Results/i)).toBeInTheDocument()
  })
})
