import { useState, useEffect, useCallback } from 'react';

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  hasStarted: boolean;
}

export const useTimer = (initialTime: number) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startTimer = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted]);

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
    let intervalId: NodeJS.Timeout;

    if (isRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeRemaining]);

  return {
    timeRemaining,
    isRunning,
    isPaused,
    hasStarted,
    startTimer,
    pauseTimer,
    resetTimer,
    stopTimer
  };
};
