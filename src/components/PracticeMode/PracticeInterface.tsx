import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  Lightbulb,
  BookOpen,
  Award
} from 'lucide-react';
import type { Question, ReadingPassage } from '../../types/ielts';
import PassageDisplay from '../PassageDisplay';
import QuestionComponent from '../QuestionComponent';

interface PracticeInterfaceProps {
  passages: ReadingPassage[];
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (score: number, totalQuestions: number) => void;
  onExit: () => void;
}

interface AnswerFeedback {
  isCorrect: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export const PracticeInterface: React.FC<PracticeInterfaceProps> = ({
  passages,
  questions,
  difficulty,
  onComplete,
  onExit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [feedback, setFeedback] = useState<Record<string, AnswerFeedback>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const currentPassage = passages.find(p => p.id === currentQuestion?.passageId);
  const currentAnswer = answers[currentQuestion?.id];
  const currentFeedback = feedback[currentQuestion?.id];

  useEffect(() => {
    // Reset explanation view when changing questions
    setShowExplanation({});
  }, [currentQuestionIndex]);

  const handleAnswerSubmit = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    // Check answer immediately in practice mode
    const question = questions.find(q => q.id === questionId);
    if (question) {
      const isCorrect = checkAnswer(answer, question.correctAnswer);
      const newFeedback: AnswerFeedback = {
        isCorrect,
        userAnswer: answer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      };
      
      setFeedback(prev => ({ ...prev, [questionId]: newFeedback }));
      
      if (isCorrect && !feedback[questionId]) {
        setScore(prev => prev + 1);
      } else if (!isCorrect && feedback[questionId]?.isCorrect) {
        setScore(prev => prev - 1);
      }
    }
  };

  const checkAnswer = (userAnswer: string | string[], correctAnswer: string | string[]): boolean => {
    if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
      return userAnswer.length === correctAnswer.length && 
             userAnswer.every(ans => correctAnswer.includes(ans));
    } else if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
      return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }
    return false;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleExplanation = (questionId: string) => {
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Completed!</h2>
          <p className="text-gray-600 mb-6">
            You've completed the {difficulty} practice session
          </p>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {score}/{questions.length}
            </div>
            <div className="text-sm text-gray-600">
              Accuracy: {Math.round((score / questions.length) * 100)}%
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onComplete(score, questions.length)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View Detailed Results
            </button>
            <button
              onClick={onExit}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4" style={{maxWidth: '1024px'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Practice Mode</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor()}`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <button
                onClick={onExit}
                className="text-gray-600 hover:text-gray-900"
              >
                Exit Practice
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6" style={{maxWidth: '1024px'}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Passage */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-12rem)] overflow-hidden">
            {currentPassage && (
              <PassageDisplay
                passage={currentPassage}
                highlightedText={null}
                fontSize="medium"
              />
            )}
          </div>

          {/* Question and Feedback */}
          <div className="space-y-4">
            {/* Question */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {currentQuestion && (
                <QuestionComponent
                  question={currentQuestion}
                  userAnswer={currentAnswer}
                  onAnswerChange={(answer) => handleAnswerSubmit(currentQuestion.id, answer)}
                  fontSize="medium"
                />
              )}
            </div>

            {/* Instant Feedback */}
            {currentFeedback && (
              <div className={`rounded-lg p-4 border ${
                currentFeedback.isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start space-x-3">
                  {currentFeedback.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      currentFeedback.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {currentFeedback.isCorrect ? 'Correct!' : 'Incorrect'}
                    </p>
                    {!currentFeedback.isCorrect && (
                      <p className="text-sm text-gray-700 mt-1">
                        Correct answer: {
                          Array.isArray(currentFeedback.correctAnswer)
                            ? currentFeedback.correctAnswer.join(', ')
                            : currentFeedback.correctAnswer
                        }
                      </p>
                    )}
                  </div>
                </div>

                {currentFeedback.explanation && (
                  <div className="mt-3">
                    <button
                      onClick={() => toggleExplanation(currentQuestion.id)}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span>
                        {showExplanation[currentQuestion.id] ? 'Hide' : 'Show'} Explanation
                      </span>
                    </button>
                    
                    {showExplanation[currentQuestion.id] && (
                      <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                        <p className="text-sm text-gray-700">
                          {currentFeedback.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Progress Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Progress</h3>
                <span className="text-sm text-gray-600">
                  {Object.keys(answers).length} answered
                </span>
              </div>
              <div className="grid grid-cols-10 gap-1">
                {questions.map((q, idx) => {
                  const hasAnswer = !!answers[q.id];
                  const fb = feedback[q.id];
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`aspect-square rounded text-xs font-medium transition-colors ${
                        idx === currentQuestionIndex
                          ? 'bg-blue-600 text-white'
                          : fb
                          ? fb.isCorrect
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                          : hasAnswer
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <div className="text-sm text-gray-600">
                Score: {score}/{Object.keys(feedback).length}
              </div>

              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};