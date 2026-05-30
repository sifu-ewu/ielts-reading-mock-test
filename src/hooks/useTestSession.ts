import { useState, useCallback, useEffect } from 'react';
import type { TestSession, TestResult } from '../types/ielts';
import { mockTestData } from '../data/mockTestData';
import { buildTestResult } from '../utils/scoring';
import {
  loadSession,
  saveSession,
  updateSession,
  clearSession,
  type PersistedSession,
} from '../utils/storage';

const TIME_LIMIT_MIN = 60;
const TIME_LIMIT_SEC = TIME_LIMIT_MIN * 60;

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

  // Evaluated once at mount: is there an unfinished saved test to resume?
  const [hasSavedSession] = useState(() => {
    const saved = loadSession();
    return !!saved && !saved.isCompleted;
  });

  const startTest = useCallback(() => {
    const session = freshSession();
    setTestSession(session);
    setCurrentQuestionIndex(0);
    setFlaggedQuestions(new Set());
    setVisitedQuestions(new Set([0]));
    setTestResult(null);
    const persisted: PersistedSession = {
      id: session.id,
      startTime: session.startTime.toISOString(),
      answers: {},
      flaggedQuestions: [],
      visitedQuestions: [0],
      currentQuestionIndex: 0,
      timeRemaining: TIME_LIMIT_SEC,
      isCompleted: false,
    };
    saveSession(persisted);
  }, []);

  const resumeTest = useCallback(() => {
    const saved = loadSession();
    if (!saved || saved.isCompleted) {
      startTest();
      return;
    }
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
      updateSession({ answers: next.answers });
      return next;
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => new Set(prev).add(index));
  }, []);

  const toggleFlag = useCallback((index: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  // Persist navigation / flag / visited state whenever it changes mid-test.
  useEffect(() => {
    if (testSession && !testSession.isCompleted) {
      updateSession({
        flaggedQuestions: [...flaggedQuestions],
        visitedQuestions: [...visitedQuestions],
        currentQuestionIndex,
      });
    }
  }, [flaggedQuestions, visitedQuestions, currentQuestionIndex, testSession]);

  const completeTest = useCallback(() => {
    setTestSession((prev) => {
      if (!prev) return prev;
      const finished: TestSession = { ...prev, endTime: new Date(), isCompleted: true };
      setTestResult(buildTestResult(finished));
      clearSession();
      return finished;
    });
  }, []);

  return {
    testSession,
    testResult,
    hasSavedSession,
    currentQuestionIndex,
    flaggedQuestions,
    visitedQuestions,
    startTest,
    resumeTest,
    restartTest,
    submitAnswer,
    goToQuestion,
    toggleFlag,
    completeTest,
  };
};
