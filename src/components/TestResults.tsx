import React, { useState } from 'react';
import { Trophy, Target, Clock, BookOpen, TrendingUp, AlertCircle, CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import type { TestSession, TestResult } from '../types/ielts';
import { getBandDescription, getDetailedBandDescription, calculatePercentage } from '../utils/scoring';

interface TestResultsProps {
  testSession: TestSession | null;
  testResult: TestResult | null;
  onRetake: () => void;
}

type Filter = 'all' | 'incorrect' | 'unanswered';

const formatAnswer = (value: string | string[] | undefined): string => {
  if (value === undefined || value === '') return '—';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  return value;
};

const TestResults: React.FC<TestResultsProps> = ({ testSession, testResult, onRetake }) => {
  const [filter, setFilter] = useState<Filter>('all');

  if (!testSession || !testResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">No test results available</h2>
          <p className="text-gray-600">Please complete a test first.</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    // Show every question (not just the active filter) before printing.
    setFilter('all');
    setTimeout(() => window.print(), 60);
  };

  const { bandScore, correctAnswers, totalQuestions, timeSpent, feedback, answers } = testResult;
  const answeredCount = answers.filter((a) => a.answer !== '' && !(Array.isArray(a.answer) && a.answer.length === 0)).length;
  const percentage = calculatePercentage(correctAnswers, totalQuestions);
  const resultById = new Map(answers.map((a) => [a.questionId, a]));

  const getBandColor = (band: number) => {
    if (band >= 8.0) return 'text-green-600 bg-green-50 border-green-200';
    if (band >= 7.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (band >= 6.0) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (band >= 5.0) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const visibleQuestions = testSession.questions.filter((q) => {
    const r = resultById.get(q.id);
    const answered = r ? r.answer !== '' && !(Array.isArray(r.answer) && r.answer.length === 0) : false;
    if (filter === 'incorrect') return answered && !r?.isCorrect;
    if (filter === 'unanswered') return !answered;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="test-container max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Test Results</h1>
                <p className="text-blue-100">IELTS Reading Mock Test</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className={`border-2 rounded-lg p-6 text-center ${getBandColor(bandScore)}`}>
                <div className="text-3xl font-bold mb-2">{bandScore.toFixed(1)}</div>
                <div className="font-semibold">Band Score</div>
                <div className="text-sm mt-1">{getBandDescription(bandScore)}</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{correctAnswers}/{totalQuestions}</div>
                <div className="text-blue-700 font-semibold">Correct Answers</div>
                <div className="text-blue-600 text-sm">{percentage}% accuracy</div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{timeSpent}</div>
                <div className="text-green-700 font-semibold">Minutes Used</div>
                <div className="text-green-600 text-sm">of 60 minutes</div>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">{answeredCount}/{totalQuestions}</div>
                <div className="text-purple-700 font-semibold">Questions Answered</div>
                <div className="text-purple-600 text-sm">{Math.round((answeredCount / totalQuestions) * 100)}% completion</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Performance Analysis</span>
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Band Score Description</h3>
                <p className="text-sm text-gray-700">{getDetailedBandDescription(bandScore)}</p>
              </div>
              {feedback.strengths.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Strengths:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {feedback.strengths.map((s) => <li key={s}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {feedback.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Areas for Improvement:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {feedback.weaknesses.map((w) => <li key={w}>• {w}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Per-type breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Accuracy by Question Type</h2>
            </div>
            <div className="p-4 space-y-3">
              {Object.entries(feedback.detailedResults).map(([type, r]) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-700">{type.replace(/-/g, ' ')}</span>
                    <span className="font-medium text-gray-600">
                      {r.correct}/{r.attempted} ({Math.round(r.accuracy * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.round(r.accuracy * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question-by-question review */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="border-b border-gray-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>Question Review</span>
            </h2>
            <div className="flex items-center space-x-2 no-print">
              {(['all', 'incorrect', 'unanswered'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-sm capitalize border ${
                    filter === f ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 space-y-3">
            {visibleQuestions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No questions match this filter.</p>
            )}
            {visibleQuestions.map((q) => {
              const r = resultById.get(q.id);
              const userAns = r?.answer;
              const answered = userAns !== undefined && userAns !== '' && !(Array.isArray(userAns) && userAns.length === 0);
              const isCorrect = !!r?.isCorrect;
              return (
                <div key={q.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-800">Q{q.questionNumber}</span>
                        <span className="text-xs text-gray-500 capitalize">{q.type.replace(/-/g, ' ')}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{q.question}</p>
                      <div className="text-sm mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                          Your answer: <strong>{answered ? formatAnswer(userAns) : 'Not answered'}</strong>
                        </span>
                        <span className="text-gray-700">
                          Correct answer: <strong>{formatAnswer(q.correctAnswer)}</strong>
                        </span>
                      </div>
                      {q.explanation && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer no-print">Why?</summary>
                          <p className="text-xs text-gray-600 mt-1">{q.explanation}</p>
                        </details>
                      )}
                    </div>
                    <div className="shrink-0">
                      {!answered ? (
                        <MinusCircle className="h-5 w-5 text-gray-400" />
                      ) : isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
          </div>
          <div className="p-4">
            <ul className="text-sm text-gray-600 space-y-1">
              {feedback.recommendations.map((rec) => <li key={rec}>• {rec}</li>)}
              <li>• Take another practice test in 1–2 weeks.</li>
              <li>• Review the explanations for every question you missed.</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-6 space-x-4 no-print">
          <button onClick={onRetake} className="btn-primary">Take Another Test</button>
          <button onClick={handlePrint} className="btn-secondary">Print Results</button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
