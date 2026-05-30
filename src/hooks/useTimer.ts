import { useState, useEffect, useCallback } from 'react';
import { loadSession, updateSession } from '../utils/storage';

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
}

export const useTimer = (initialTime: number) => {
  // Seed from a saved, unfinished session so a refresh resumes mid-clock.
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const saved = loadSession();
    return saved && !saved.isCompleted ? saved.timeRemaining : initialTime;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

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

  return {
    timeRemaining,
    isRunning,
    isPaused,
    hasStarted,
    setTimeRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    stopTimer,
  };
};
