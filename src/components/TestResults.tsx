import React from 'react';
import { Trophy, Target, Clock, BookOpen, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import type { TestSession } from '../types/ielts.ts';
import { getBandDescription, getDetailedBandDescription, calculatePercentage } from '../utils/scoring.ts';

interface TestResultsProps {
  testSession: TestSession | null;
}

const TestResults: React.FC<TestResultsProps> = ({ testSession }) => {
  if (!testSession) {
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

  // Calculate results
  const totalQuestions = testSession.questions.length;
  const answeredQuestions = Object.keys(testSession.answers).length;
  
  let correctAnswers = 0;
  testSession.questions.forEach(question => {
    const userAnswer = testSession.answers[question.id];
    const correctAnswer = question.correctAnswer;
    
    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      if (correctAnswer.length === userAnswer.length && 
          correctAnswer.every(ans => userAnswer.includes(ans))) {
        correctAnswers++;
      }
    } else if (typeof correctAnswer === 'string' && typeof userAnswer === 'string') {
      if (correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim()) {
        correctAnswers++;
      }
    }
  });

  const percentage = calculatePercentage(correctAnswers, totalQuestions);
  
  // Calculate band score (simplified)
  const bandScore = (() => {
    if (correctAnswers >= 36) return 8.5;
    if (correctAnswers >= 32) return 7.5;
    if (correctAnswers >= 28) return 6.5;
    if (correctAnswers >= 24) return 5.5;
    if (correctAnswers >= 20) return 4.5;
    if (correctAnswers >= 16) return 3.5;
    return 2.5;
  })();

  const timeSpent = testSession.endTime && testSession.startTime 
    ? Math.floor((testSession.endTime.getTime() - testSession.startTime.getTime()) / 1000 / 60)
    : 60;

  const getBandColor = (band: number) => {
    if (band >= 8.0) return 'text-green-600 bg-green-50 border-green-200';
    if (band >= 7.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (band >= 6.0) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (band >= 5.0) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPerformanceLevel = (band: number) => {
    if (band >= 8.0) return 'Excellent';
    if (band >= 7.0) return 'Very Good';
    if (band >= 6.0) return 'Good';
    if (band >= 5.0) return 'Modest';
    return 'Limited';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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

          {/* Main Results */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Band Score */}
              <div className={`border-2 rounded-lg p-6 text-center ${getBandColor(bandScore)}`}>
                <div className="text-3xl font-bold mb-2">{bandScore}</div>
                <div className="font-semibold">{getBandDescription(bandScore)}</div>
                <div className="text-sm mt-1">{getPerformanceLevel(bandScore)}</div>
              </div>

              {/* Score */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{correctAnswers}/{totalQuestions}</div>
                <div className="text-blue-700 font-semibold">Correct Answers</div>
                <div className="text-blue-600 text-sm">{percentage}% accuracy</div>
              </div>

              {/* Time */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">{timeSpent}</div>
                <div className="text-green-700 font-semibold">Minutes Used</div>
                <div className="text-green-600 text-sm">of 60 minutes</div>
              </div>

              {/* Completion */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">{answeredQuestions}/{totalQuestions}</div>
                <div className="text-purple-700 font-semibold">Questions Answered</div>
                <div className="text-purple-600 text-sm">
                  {Math.round((answeredQuestions / totalQuestions) * 100)}% completion
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detailed Analysis */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>Performance Analysis</span>
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {/* Band Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Band Score Description</h3>
                <p className="text-sm text-gray-700">
                  {getDetailedBandDescription(bandScore)}
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Strengths:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {percentage >= 80 && <li>• Excellent reading comprehension</li>}
                    {percentage >= 70 && <li>• Strong analytical skills</li>}
                    {percentage >= 60 && <li>• Good understanding of main ideas</li>}
                    {timeSpent < 50 && <li>• Efficient time management</li>}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Areas for Improvement:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {percentage < 60 && <li>• Focus on reading comprehension strategies</li>}
                    {percentage < 70 && <li>• Practice identifying key information</li>}
                    {timeSpent > 55 && <li>• Work on time management skills</li>}
                    {answeredQuestions < totalQuestions && <li>• Complete all questions within time limit</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Question by Question Review */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>Question Review</span>
              </h2>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {testSession.questions.map((question, index) => {
                  const userAnswer = testSession.answers[question.id];
                  const isCorrect = (() => {
                    if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer)) {
                      return question.correctAnswer.length === userAnswer.length && 
                             question.correctAnswer.every(ans => userAnswer.includes(ans));
                    }
                    if (typeof question.correctAnswer === 'string' && typeof userAnswer === 'string') {
                      return question.correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
                    }
                    return false;
                  })();

                  return (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-700">Q{index + 1}</span>
                        <span className="text-sm text-gray-600 capitalize">
                          {question.type.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {userAnswer ? (
                          isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 rounded"></div>
                        )}
                        <span className="text-sm font-medium">
                          {userAnswer ? (isCorrect ? 'Correct' : 'Incorrect') : 'Not answered'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Study Recommendations:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {bandScore < 6.0 && <li>• Focus on building vocabulary and basic comprehension</li>}
                  {bandScore < 7.0 && <li>• Practice skimming and scanning techniques</li>}
                  {bandScore < 8.0 && <li>• Work on inference and detailed comprehension</li>}
                  <li>• Practice with more mock tests</li>
                  <li>• Read academic texts regularly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Next Steps:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Take another practice test in 1-2 weeks</li>
                  <li>• Focus on your weakest question types</li>
                  <li>• Time yourself during practice sessions</li>
                  <li>• Review IELTS reading strategies</li>
                  <li>• Consider taking the official IELTS test</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-6 space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Take Another Test
          </button>
          <button 
            onClick={() => window.print()}
            className="btn-secondary"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
