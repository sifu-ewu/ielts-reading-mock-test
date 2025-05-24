import React from 'react';
import { BookOpen, Clock, Users, Target, PlayCircle } from 'lucide-react';

interface TestInstructionsProps {
  onStartTest: () => void;
}

const TestInstructions: React.FC<TestInstructionsProps> = ({ onStartTest }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white rounded-t-lg p-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">IELTS Reading Mock Test</h1>
                <p className="text-blue-100">Academic Reading Practice Test</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Test Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">Duration</h3>
                <p className="text-blue-700">60 minutes</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">Questions</h3>
                <p className="text-green-700">40 questions</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">Passages</h3>
                <p className="text-purple-700">3 reading texts</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Test Instructions</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Before You Begin:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>This test contains 3 reading passages with a total of 40 questions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>You have exactly 60 minutes to complete all questions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>The test will automatically submit when time expires</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>You can navigate between questions and flag them for review</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">During the Test:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>Read each passage carefully before attempting questions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>Answer all questions - there is no penalty for wrong answers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>Pay attention to word limits for short answer questions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span>Use the flag feature to mark questions you want to review</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Question Types:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <span className="font-medium text-green-700">• Multiple Choice</span>
                    <span className="font-medium text-green-700">• True/False/Not Given</span>
                    <span className="font-medium text-green-700">• Matching Headings</span>
                    <span className="font-medium text-green-700">• Gap Filling</span>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-green-700">• Short Answer Questions</span>
                    <span className="font-medium text-green-700">• Matching Information</span>
                    <span className="font-medium text-green-700">• Sentence Completion</span>
                    <span className="font-medium text-green-700">• Summary Completion</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Test-Taking Tips:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <ul className="space-y-1">
                  <li>• Skim the passage first to get an overview</li>
                  <li>• Read questions before detailed reading</li>
                  <li>• Manage your time - about 20 minutes per passage</li>
                  <li>• Look for keywords and synonyms</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Don't spend too long on difficult questions</li>
                  <li>• Transfer answers carefully</li>
                  <li>• Check spelling and grammar</li>
                  <li>• Use the remaining time to review flagged questions</li>
                </ul>
              </div>
            </div>

            {/* Technical Requirements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Technical Information:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Ensure stable internet connection throughout the test</li>
                <li>• Use a modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li>• The test will save your answers automatically</li>
                <li>• Avoid refreshing the page during the test</li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Make sure you are ready to begin. Once you start, the timer cannot be paused.
              </p>
              <button
                onClick={onStartTest}
                className="btn-primary flex items-center space-x-2 mx-auto px-8 py-3 text-lg"
              >
                <PlayCircle className="h-6 w-6" />
                <span>Start Test</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Good luck with your IELTS Reading practice test!</p>
        </div>
      </div>
    </div>
  );
};

export default TestInstructions;
