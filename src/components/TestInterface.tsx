import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flag, BookOpen, Clock } from 'lucide-react';
import type { TestSession } from '../types/ielts.ts';
import PassageDisplay from './PassageDisplay.tsx';
import QuestionComponent from './QuestionComponent.tsx';
import NavigationPanel from './NavigationPanel.tsx';

interface TestInterfaceProps {
  testSession: TestSession | null;
  onSubmitAnswer: (questionId: string, answer: string | string[]) => void;
  timeRemaining: number;
  fontSize: 'small' | 'medium' | 'large';
}

const TestInterface: React.FC<TestInterfaceProps> = ({
  testSession,
  onSubmitAnswer,
  timeRemaining,
  fontSize
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [showPassage, setShowPassage] = useState(true);

  useEffect(() => {
    setVisitedQuestions(prev => new Set([...prev, currentQuestionIndex]));
  }, [currentQuestionIndex]);

  if (!testSession) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No test session available</p>
      </div>
    );
  }

  const currentQuestion = testSession.questions[currentQuestionIndex];
  const currentPassage = testSession.passages.find(p => p.id === currentQuestion?.passageId);
  const totalQuestions = testSession.questions.length;

  const handleQuestionNavigation = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
      setVisitedQuestions(prev => new Set([...prev, index]));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      handleQuestionNavigation(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      handleQuestionNavigation(currentQuestionIndex - 1);
    }
  };

  const handleFlagQuestion = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(testSession.answers).length;
  };

  return (
    <div className="flex flex-col space-y-6 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0 h-full">
      {/* Mobile Progress Panel - Shows first on mobile */}
      <div className="lg:hidden bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm">
          <span>Progress: {getAnsweredQuestionsCount()}/{totalQuestions}</span>
          <span>Question {currentQuestionIndex + 1}</span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(getAnsweredQuestionsCount() / totalQuestions) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Left Panel - Passage */}
      <div className={`${showPassage ? 'lg:col-span-6' : 'lg:col-span-3'} bg-white rounded-lg shadow-sm border border-gray-200`}>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Reading Passage
              </h3>
            </div>            <button
              onClick={() => setShowPassage(!showPassage)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showPassage ? 'Minimize' : 'Expand'}
            </button>
          </div>
          {currentPassage && (
            <p className="text-sm text-gray-600 mt-1">
              {currentPassage.title} • {currentPassage.wordCount} words
            </p>
          )}
        </div>
        
        {showPassage && currentPassage && (
          <PassageDisplay 
            passage={currentPassage} 
            fontSize={fontSize}
            highlightedText={null}
          />
        )}
      </div>      {/* Center Panel - Questions */}
      <div className={`${showPassage ? 'lg:col-span-4' : 'lg:col-span-6'} bg-white rounded-lg shadow-sm border border-gray-200`}>
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFlagQuestion}
                className={`p-2 rounded ${
                  flaggedQuestions.has(currentQuestionIndex)
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={flaggedQuestions.has(currentQuestionIndex) ? 'Unflag question' : 'Flag for review'}
              >
                <Flag className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">{currentQuestion?.type.replace('-', ' ')}</span>
            {currentQuestion && (
              <span className="ml-2">• {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        <div className="p-4 min-h-96 max-h-screen overflow-y-auto">
          {currentQuestion && (
            <QuestionComponent
              question={currentQuestion}
              userAnswer={testSession.answers[currentQuestion.id]}
              onAnswerChange={(answer: string | string[]) => onSubmitAnswer(currentQuestion.id, answer)}
              fontSize={fontSize}
            />
          )}
        </div>        {/* Question Navigation */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="text-sm text-gray-600 text-center">
              <div className="font-medium">{getAnsweredQuestionsCount()} of {totalQuestions} answered</div>
              <div className="lg:hidden mt-1">
                <button
                  onClick={handleFlagQuestion}
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                    flaggedQuestions.has(currentQuestionIndex)
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="h-3 w-3" />
                  <span>{flaggedQuestions.has(currentQuestionIndex) ? 'Unflag' : 'Flag'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>      {/* Right Panel - Navigation & Progress */}
      <div className="lg:col-span-2 space-y-4 order-first lg:order-last">
        {/* Timer Warning */}
        {timeRemaining < 600 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-red-700">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Time Warning</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Less than 10 minutes remaining!
            </p>
          </div>
        )}

        {/* Progress Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Progress</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Answered:</span>
              <span className="font-medium text-green-600">
                {getAnsweredQuestionsCount()}/{totalQuestions}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Flagged:</span>
              <span className="font-medium text-yellow-600">
                {flaggedQuestions.size}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Visited:</span>
              <span className="font-medium text-blue-600">
                {visitedQuestions.size}/{totalQuestions}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(getAnsweredQuestionsCount() / totalQuestions) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Question Navigation Grid */}
        <NavigationPanel
          totalQuestions={totalQuestions}
          currentQuestionIndex={currentQuestionIndex}
          answeredQuestions={new Set(Object.keys(testSession.answers).map(id => 
            testSession.questions.findIndex(q => q.id === id)
          ).filter(index => index !== -1))}
          visitedQuestions={visitedQuestions}
          flaggedQuestions={flaggedQuestions}
          onQuestionSelect={handleQuestionNavigation}
        />
      </div>
    </div>
  );
};

export default TestInterface;
