import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Target, 
  BarChart3,
  Calendar,
  BookOpen,
  ArrowRight,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTestHistory } from '../../hooks/useTestHistory';

interface DashboardProps {
  onStartTest: () => void;
  onStartPractice: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export const UserDashboard: React.FC<DashboardProps> = ({ onStartTest, onStartPractice }) => {
  const { user } = useAuth();
  const { stats, getRecentTests, getProgressData } = useTestHistory();
  const recentTests = getRecentTests(5);
  const progressData = getProgressData();

  const getBandColor = (band: number) => {
    if (band >= 8) return 'text-green-600';
    if (band >= 7) return 'text-blue-600';
    if (band >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mb-4">
          Continue your IELTS preparation journey. Your target band score: {user?.preferences.targetBand || 7}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onStartTest}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
          >
            <BookOpen className="h-5 w-5" />
            <span>Start Full Test</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onStartPractice('medium')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors"
          >
            Quick Practice
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <span className={`text-2xl font-bold ${getBandColor(stats.bestBand)}`}>
                {stats.bestBand.toFixed(1)}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Best Band Score</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900">
                {stats.averageBand.toFixed(1)}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Average Band</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold text-gray-900">
                {Math.round(stats.totalPracticeTime)}h
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Practice Time</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <span className={`text-2xl font-bold ${stats.improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.improvementRate >= 0 ? '+' : ''}{stats.improvementRate.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Improvement</h3>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Progress Overview
          </h2>
          {progressData.length > 0 ? (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Progress chart visualization</p>
              {/* In a real implementation, you would use a charting library like recharts */}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No test data yet</p>
                <p className="text-gray-400 text-sm mt-1">Complete your first test to see progress</p>
              </div>
            </div>
          )}
        </div>

        {/* Strengths and Weaknesses */}
        {stats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Performance Analysis
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Strongest Areas</h3>
                <div className="space-y-2">
                  {stats.strongestQuestionTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 capitalize">
                        {type.replace(/-/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Areas to Improve</h3>
                <div className="space-y-2">
                  {stats.weakestQuestionTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 capitalize">
                        {type.replace(/-/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Tests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Recent Tests
        </h2>
        
        {recentTests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Band</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Duration</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map((test, index) => (
                  <tr key={test.id} className={index !== recentTests.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {test.testDate.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        test.testType === 'full' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {test.testType === 'full' ? 'Full Test' : 'Practice'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${getBandColor(test.result.band)}`}>
                        {test.result.band.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {test.result.score}/{test.totalQuestions}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDuration(test.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No tests completed yet</p>
            <p className="text-gray-400 text-sm mt-1">Start your first test to track progress</p>
          </div>
        )}
      </div>

      {/* Practice Recommendations */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onStartPractice('easy')}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
          >
            <h3 className="font-medium text-gray-900 mb-2">Easy Practice</h3>
            <p className="text-sm text-gray-600 mb-3">Build confidence with simpler passages</p>
            <span className="text-blue-600 text-sm font-medium">Start →</span>
          </button>

          <button
            onClick={() => onStartPractice('medium')}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
          >
            <h3 className="font-medium text-gray-900 mb-2">Medium Practice</h3>
            <p className="text-sm text-gray-600 mb-3">Challenge yourself with standard difficulty</p>
            <span className="text-blue-600 text-sm font-medium">Start →</span>
          </button>

          <button
            onClick={() => onStartPractice('hard')}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
          >
            <h3 className="font-medium text-gray-900 mb-2">Hard Practice</h3>
            <p className="text-sm text-gray-600 mb-3">Master complex academic passages</p>
            <span className="text-blue-600 text-sm font-medium">Start →</span>
          </button>
        </div>
      </div>
    </div>
  );
};