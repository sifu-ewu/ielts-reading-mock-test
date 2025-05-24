import { useState, useCallback } from 'react';
import type { TestSession, UserAnswer, TestResult, Question } from '../types/ielts.ts';
import { mockTestData } from '../data/mockTestData.ts';
import { calculateBandScore } from '../utils/scoring.ts';

export const useTestSession = () => {
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const startTest = useCallback(() => {
    const session: TestSession = {
      id: `test_${Date.now()}`,
      startTime: new Date(),
      timeLimit: 60, // 60 minutes
      isCompleted: false,
      isPaused: false,
      currentQuestionIndex: 0,
      answers: {},
      passages: mockTestData.passages,
      questions: mockTestData.questions
    };
    setTestSession(session);
  }, []);

  const submitAnswer = useCallback((questionId: string, answer: string | string[]) => {
    if (!testSession) return;

    setTestSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: answer
        }
      };
    });
  }, [testSession]);

  const navigateToQuestion = useCallback((questionIndex: number) => {
    if (!testSession) return;

    setTestSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentQuestionIndex: questionIndex
      };
    });
  }, [testSession]);

  const completeTest = useCallback(() => {
    if (!testSession) return;

    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - testSession.startTime.getTime()) / 1000 / 60);

    // Calculate results
    const userAnswers: UserAnswer[] = [];
    let correctAnswers = 0;

    testSession.questions.forEach(question => {
      const userAnswer = testSession.answers[question.id];
      const isCorrect = checkAnswer(question.correctAnswer, userAnswer);
      
      if (isCorrect) correctAnswers++;

      userAnswers.push({
        questionId: question.id,
        answer: userAnswer || '',
        timeSpent: 0, // TODO: Track individual question time
        isCorrect
      });
    });

    const score = correctAnswers;
    const bandScore = calculateBandScore(score, testSession.passages[0]?.type || 'academic');

    const result: TestResult = {
      sessionId: testSession.id,
      totalQuestions: testSession.questions.length,
      correctAnswers,
      score,
      bandScore,
      timeSpent,
      answers: userAnswers,
      completedAt: endTime,
      feedback: {
        overallPerformance: getBandDescription(bandScore),
        strengths: getStrengths(userAnswers),
        weaknesses: getWeaknesses(userAnswers),
        recommendations: getRecommendations(bandScore),
        detailedResults: getDetailedResults(userAnswers, testSession.questions)
      }
    };

    setTestResult(result);
    setIsTestCompleted(true);
    
    setTestSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        endTime,
        isCompleted: true
      };
    });
  }, [testSession]);

  return {
    testSession,
    isTestCompleted,
    testResult,
    startTest,
    submitAnswer,
    navigateToQuestion,
    completeTest
  };
};

// Helper functions
function checkAnswer(correctAnswer: string | string[], userAnswer: string | string[]): boolean {
  if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
    return correctAnswer.length === userAnswer.length && 
           correctAnswer.every(ans => userAnswer.includes(ans));
  }
  if (typeof correctAnswer === 'string' && typeof userAnswer === 'string') {
    return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
  }
  return false;
}

function getBandDescription(bandScore: number): string {
  if (bandScore >= 8.5) return "Excellent - Very strong command of the language";
  if (bandScore >= 7.5) return "Very Good - Good command with minimal errors";
  if (bandScore >= 6.5) return "Good - Generally effective command";
  if (bandScore >= 5.5) return "Competent - Modest command with some limitations";
  if (bandScore >= 4.5) return "Modest - Limited command with frequent problems";
  return "Limited - Basic command with significant limitations";
}

function getStrengths(answers: UserAnswer[]): string[] {
  const strengths: string[] = [];
  const correctCount = answers.filter(a => a.isCorrect).length;
  const accuracy = correctCount / answers.length;

  if (accuracy >= 0.8) strengths.push("Excellent overall comprehension");
  if (accuracy >= 0.7) strengths.push("Strong reading skills");
  if (accuracy >= 0.6) strengths.push("Good understanding of main ideas");

  return strengths;
}

function getWeaknesses(answers: UserAnswer[]): string[] {
  const weaknesses: string[] = [];
  const incorrectCount = answers.filter(a => !a.isCorrect).length;
  const accuracy = (answers.length - incorrectCount) / answers.length;

  if (accuracy < 0.5) weaknesses.push("Difficulty with reading comprehension");
  if (accuracy < 0.6) weaknesses.push("Need to improve detail identification");
  if (accuracy < 0.7) weaknesses.push("Could benefit from more vocabulary practice");

  return weaknesses;
}

function getRecommendations(bandScore: number): string[] {
  const recommendations: string[] = [];
  
  if (bandScore < 6.0) {
    recommendations.push("Focus on building vocabulary");
    recommendations.push("Practice skimming and scanning techniques");
    recommendations.push("Read more academic texts daily");
  } else if (bandScore < 7.0) {
    recommendations.push("Work on identifying writer's opinion and attitude");
    recommendations.push("Practice inference questions");
  } else {
    recommendations.push("Focus on complex question types");
    recommendations.push("Practice under time pressure");
  }

  return recommendations;
}

function getDetailedResults(answers: UserAnswer[], questions: Question[]): Record<string, any> {
  const results: Record<string, any> = {};
  
  // Group by question type
  const questionTypes = questions.reduce((acc, q) => {
    if (!acc[q.type]) acc[q.type] = [];
    acc[q.type].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  Object.entries(questionTypes).forEach(([type, typeQuestions]) => {
    const typeAnswers = answers.filter(a => 
      typeQuestions.some((q: Question) => q.id === a.questionId)
    );
    const correct = typeAnswers.filter(a => a.isCorrect).length;
    
    results[type] = {
      attempted: typeAnswers.length,
      correct,
      accuracy: typeAnswers.length > 0 ? correct / typeAnswers.length : 0
    };
  });

  return results;
}
