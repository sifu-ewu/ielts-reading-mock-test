import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { TestResult } from '../types/ielts';

export interface TestHistoryItem {
  id: string;
  userId: string;
  testDate: Date;
  testType: 'full' | 'practice';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  result: TestResult;
  duration: number; // in seconds
  questionsAnswered: number;
  totalQuestions: number;
}

interface TestHistoryStats {
  totalTests: number;
  averageScore: number;
  averageBand: number;
  bestBand: number;
  totalPracticeTime: number; // in hours
  improvementRate: number; // percentage
  strongestQuestionTypes: string[];
  weakestQuestionTypes: string[];
}

export const useTestHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [stats, setStats] = useState<TestHistoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setHistory([]);
      setStats(null);
    }
  }, [user]);

  const loadHistory = () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem(`ielts-history-${user?.id}`);
      if (stored) {
        const parsedHistory = JSON.parse(stored);
        // Convert date strings back to Date objects
        const history = parsedHistory.map((item: any) => ({
          ...item,
          testDate: new Date(item.testDate)
        }));
        setHistory(history);
        calculateStats(history);
      }
    } catch (error) {
      console.error('Failed to load test history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (historyItems: TestHistoryItem[]) => {
    if (historyItems.length === 0) {
      setStats(null);
      return;
    }

    const totalTests = historyItems.length;
    const scores = historyItems.map(item => item.result.score);
    const bands = historyItems.map(item => item.result.band);
    
    const averageScore = scores.reduce((a, b) => a + b, 0) / totalTests;
    const averageBand = bands.reduce((a, b) => a + b, 0) / totalTests;
    const bestBand = Math.max(...bands);
    
    const totalPracticeTime = historyItems.reduce((total, item) => total + item.duration, 0) / 3600;
    
    // Calculate improvement rate (comparing first 20% tests to last 20%)
    const firstTests = Math.ceil(totalTests * 0.2);
    const lastTests = Math.ceil(totalTests * 0.2);
    const firstAvg = bands.slice(0, firstTests).reduce((a, b) => a + b, 0) / firstTests;
    const lastAvg = bands.slice(-lastTests).reduce((a, b) => a + b, 0) / lastTests;
    const improvementRate = ((lastAvg - firstAvg) / firstAvg) * 100;

    // Analyze question types
    const questionTypeStats: Record<string, { correct: number; total: number }> = {};
    
    historyItems.forEach(item => {
      if (item.result.detailedResults) {
        Object.entries(item.result.detailedResults).forEach(([type, stats]) => {
          if (!questionTypeStats[type]) {
            questionTypeStats[type] = { correct: 0, total: 0 };
          }
          questionTypeStats[type].correct += stats.correct;
          questionTypeStats[type].total += stats.attempted;
        });
      }
    });

    // Find strongest and weakest question types
    const typeAccuracies = Object.entries(questionTypeStats).map(([type, stats]) => ({
      type,
      accuracy: stats.total > 0 ? stats.correct / stats.total : 0
    }));

    typeAccuracies.sort((a, b) => b.accuracy - a.accuracy);
    
    const strongestQuestionTypes = typeAccuracies.slice(0, 3).map(t => t.type);
    const weakestQuestionTypes = typeAccuracies.slice(-3).map(t => t.type);

    setStats({
      totalTests,
      averageScore,
      averageBand,
      bestBand,
      totalPracticeTime,
      improvementRate,
      strongestQuestionTypes,
      weakestQuestionTypes
    });
  };

  const addTestResult = (testResult: Omit<TestHistoryItem, 'id' | 'userId'>) => {
    if (!user) return;

    const newItem: TestHistoryItem = {
      ...testResult,
      id: `test-${Date.now()}`,
      userId: user.id
    };

    const updatedHistory = [...history, newItem];
    setHistory(updatedHistory);
    calculateStats(updatedHistory);

    // Save to localStorage
    localStorage.setItem(`ielts-history-${user.id}`, JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    if (!user) return;
    
    setHistory([]);
    setStats(null);
    localStorage.removeItem(`ielts-history-${user.id}`);
  };

  const getRecentTests = (count: number = 5) => {
    return history
      .sort((a, b) => b.testDate.getTime() - a.testDate.getTime())
      .slice(0, count);
  };

  const getTestsByType = (type: 'full' | 'practice') => {
    return history.filter(item => item.testType === type);
  };

  const getProgressData = () => {
    return history
      .sort((a, b) => a.testDate.getTime() - b.testDate.getTime())
      .map(item => ({
        date: item.testDate,
        band: item.result.band,
        score: item.result.score
      }));
  };

  return {
    history,
    stats,
    isLoading,
    addTestResult,
    clearHistory,
    getRecentTests,
    getTestsByType,
    getProgressData
  };
};