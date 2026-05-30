import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flag, BookOpen, Clock, Type, Highlighter } from 'lucide-react';
import type { TestSession } from '../types/ielts';
import PassageDisplay from './PassageDisplay';
import QuestionComponent from './QuestionComponent';
import NavigationPanel from './NavigationPanel';

type FontSize = 'small' | 'medium' | 'large';

interface TestInterfaceProps {
  testSession: TestSession | null;
  onSubmitAnswer: (questionId: string, answer: string | string[]) => void;
  timeRemaining: number;
  fontSize: FontSize;
  onFontSizeChange: (size: FontSize) => void;
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
  flaggedQuestions: Set<number>;
  onToggleFlag: (index: number) => void;
  visitedQuestions: Set<number>;
}

const TestInterface: React.FC<TestInterfaceProps> = ({
  testSession,
  onSubmitAnswer,
  timeRemaining,
  fontSize,
  onFontSizeChange,
  currentQuestionIndex,
  onNavigate,
  flaggedQuestions,
  onToggleFlag,
  visitedQuestions,
}) => {
  const [showPassage, setShowPassage] = useState(true);
  const [highlightEnabled, setHighlightEnabled] = useState(false);

  if (!testSession) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No test session available</p>
      </div>
    );
  }

  const { questions, passages, answers } = testSession;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const currentPassage = passages.find((p) => p.id === currentQuestion?.passageId);

  const isAnswered = (value: string | string[] | undefined) =>
    value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0);

  const answeredIndices = new Set(
    questions
      .map((q, i) => (isAnswered(answers[q.id]) ? i : -1))
      .filter((i) => i !== -1),
  );
  const answeredCount = answeredIndices.size;

  // Build navigation groups: one per passage (questions are contiguous by passage).
  const groups = passages
    .map((p, idx) => {
      const indices = questions
        .map((q, i) => (q.passageId === p.id ? i : -1))
        .filter((i) => i !== -1);
      if (indices.length === 0) return null;
      return {
        label: `Passage ${idx + 1}`,
        start: Math.min(...indices),
        end: Math.max(...indices),
      };
    })
    .filter((g): g is { label: string; start: number; end: number } => g !== null);

  const toolbarBtn = (active: boolean) =>
    `p-2 rounded border text-sm ${
      active
        ? 'bg-blue-600 border-blue-600 text-white'
        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center space-x-1">
          <Type className="h-4 w-4 text-gray-500" />
          <button onClick={() => onFontSizeChange('small')} className={toolbarBtn(fontSize === 'small')} title="Small text">A−</button>
          <button onClick={() => onFontSizeChange('medium')} className={toolbarBtn(fontSize === 'medium')} title="Medium text">A</button>
          <button onClick={() => onFontSizeChange('large')} className={toolbarBtn(fontSize === 'large')} title="Large text">A+</button>
        </div>
        <button
          onClick={() => setHighlightEnabled((v) => !v)}
          className={`flex items-center space-x-1 ${toolbarBtn(highlightEnabled)}`}
          title="Toggle highlighter; click a highlight to remove it"
        >
          <Highlighter className="h-4 w-4" />
          <span className="hidden sm:inline">{highlightEnabled ? 'Highlighter on' : 'Highlighter'}</span>
        </button>
        <span className="text-xs text-gray-500 ml-auto">
          {answeredCount}/{totalQuestions} answered
        </span>
      </div>

      <div className="flex flex-col space-y-6 lg:grid lg:grid-cols-12 lg:gap-6 lg:space-y-0">
        {/* Left Panel - Passage */}
        <div
          className={`${showPassage ? 'lg:col-span-6' : 'lg:col-span-3'} bg-white rounded-lg shadow-sm border border-gray-200`}
        >
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Reading Passage</h3>
              </div>
              <button
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
              highlightEnabled={highlightEnabled}
            />
          )}
        </div>

        {/* Center Panel - Questions */}
        <div
          className={`${showPassage ? 'lg:col-span-4' : 'lg:col-span-6'} bg-white rounded-lg shadow-sm border border-gray-200`}
        >
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </h3>
              <button
                onClick={() => onToggleFlag(currentQuestionIndex)}
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
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium capitalize">{currentQuestion?.type.replace(/-/g, ' ')}</span>
            </div>
          </div>

          <div className="p-4 min-h-96 max-h-[70vh] overflow-y-auto">
            {currentQuestion && (
              <QuestionComponent
                question={currentQuestion}
                userAnswer={answers[currentQuestion.id]}
                onAnswerChange={(answer) => onSubmitAnswer(currentQuestion.id, answer)}
                fontSize={fontSize}
              />
            )}
          </div>

          {/* Prev / Next */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onNavigate(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <div className="text-sm text-gray-600 font-medium">
                {answeredCount} of {totalQuestions} answered
              </div>
              <button
                onClick={() => onNavigate(currentQuestionIndex + 1)}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Navigation & Progress */}
        <div className="lg:col-span-2 space-y-4 order-first lg:order-last">
          {timeRemaining < 600 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-700">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Time Warning</span>
              </div>
              <p className="text-sm text-red-600 mt-1">Less than 10 minutes remaining!</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Progress</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="font-medium text-green-600">{answeredCount}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Flagged:</span>
                <span className="font-medium text-yellow-600">{flaggedQuestions.size}</span>
              </div>
              <div className="flex justify-between">
                <span>Visited:</span>
                <span className="font-medium text-blue-600">{visitedQuestions.size}/{totalQuestions}</span>
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <NavigationPanel
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            answeredQuestions={answeredIndices}
            visitedQuestions={visitedQuestions}
            flaggedQuestions={flaggedQuestions}
            onQuestionSelect={onNavigate}
            groups={groups}
          />
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
