import { describe, it, expect, beforeEach } from 'vitest'
import { loadSession, saveSession, updateSession, clearSession, type PersistedSession } from './storage'

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
  it('merges partial updates', () => {
    saveSession(sample)
    updateSession({ timeRemaining: 1200 })
    expect(loadSession()?.timeRemaining).toBe(1200)
    expect(loadSession()?.id).toBe('s1')
  })
  it('does nothing when updating with no session', () => {
    updateSession({ timeRemaining: 10 })
    expect(loadSession()).toBeNull()
  })
  it('clears', () => {
    saveSession(sample)
    clearSession()
    expect(loadSession()).toBeNull()
  })
})
