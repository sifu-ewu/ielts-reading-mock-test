import { useState, useEffect, useCallback } from 'react';
import { Clock, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import type { UIState } from './types/ielts';
import TestInterface from './components/TestInterface.tsx';
import TestResults from './components/TestResults.tsx';
import TestInstructions from './components/TestInstructions.tsx';
import { LoginForm } from './components/Auth/LoginForm.tsx';
import { SignupForm } from './components/Auth/SignupForm.tsx';
import { UserDashboard } from './components/Dashboard/UserDashboard.tsx';
import { PracticeInterface } from './components/PracticeMode/PracticeInterface.tsx';
import { useTimer } from './hooks/useTimer.ts';
import { useTestSession } from './hooks/useTestSession.ts';
import { useTestHistory } from './hooks/useTestHistory.ts';
import { useAuth } from './contexts/AuthContext.tsx';
import { practiceTests } from './data/mockTestData.ts';
import './App.css';

type AppView = 'auth' | 'dashboard' | 'instructions' | 'test' | 'practice' | 'results';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [practiceDifficulty, setPracticeDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [uiState] = useState<UIState>({
    isLoading: false,
    error: null,
    showInstructions: false,
    showResults: false,
    highlightedText: null,
    fontSize: 'medium'
  });

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addTestResult } = useTestHistory();
  const { 
    testSession, 
    startTest, 
    submitAnswer, 
    completeTest
  } = useTestSession();

  const { 
    timeRemaining, 
    isRunning, 
    startTimer, 
    pauseTimer,
    resetTimer
  } = useTimer(3600); // 60 minutes

  const [testStartTime, setTestStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('auth');
      }
    }
  }, [isAuthenticated, authLoading]);

  const handleStartFullTest = () => {
    setCurrentView('instructions');
  };

  const handleStartPractice = (difficulty: 'easy' | 'medium' | 'hard') => {
    setPracticeDifficulty(difficulty);
    setCurrentView('practice');
  };

  const handleBeginTest = () => {
    setCurrentView('test');
    startTest();
    startTimer();
    setTestStartTime(new Date());
  };

  const handleCompleteTest = useCallback(() => {
    const testResult = completeTest();
    
    if (testResult && testStartTime) {
      const duration = Math.floor((new Date().getTime() - testStartTime.getTime()) / 1000);
      
      addTestResult({
        testDate: testStartTime,
        testType: 'full',
        difficulty: 'mixed',
        result: testResult,
        duration,
        questionsAnswered: Object.keys(testSession?.answers || {}).length,
        totalQuestions: testSession?.questions.length || 0
      });
    }
    
    resetTimer();
    setCurrentView('results');
  }, [completeTest, testStartTime, addTestResult, testSession, resetTimer]);

  const handlePracticeComplete = (score: number, totalQuestions: number) => {
    
    addTestResult({
      testDate: new Date(),
      testType: 'practice',
      difficulty: practiceDifficulty,
      result: {
        score,
        totalQuestions,
        band: (score / totalQuestions) * 9, // Simple band calculation for practice
        timeTaken: 0,
        answers: [],
        recommendations: [],
        detailedResults: {}
      },
      duration: 0,
      questionsAnswered: score,
      totalQuestions
    });

    setCurrentView('dashboard');
  };

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && isRunning && currentView === 'test') {
      handleCompleteTest();
    }
  }, [timeRemaining, isRunning, currentView, handleCompleteTest]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Authentication View
  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          {authMode === 'login' ? (
            <LoginForm
              onSuccess={() => setCurrentView('dashboard')}
              onSwitchToSignup={() => setAuthMode('signup')}
            />
          ) : (
            <SignupForm
              onSuccess={() => setCurrentView('dashboard')}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      </div>
    );
  }

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4" style={{maxWidth: '1024px'}}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">IELTS Reading Practice</h1>
              </div>
              <button
                onClick={() => {
                  setCurrentView('auth');
                  setAuthMode('login');
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" style={{maxWidth: '1024px'}}>
          <UserDashboard
            onStartTest={handleStartFullTest}
            onStartPractice={handleStartPractice}
          />
        </main>
      </div>
    );
  }

  // Practice Mode View
  if (currentView === 'practice') {
    const practiceData = practiceTests[practiceDifficulty];
    return (
      <PracticeInterface
        passages={practiceData.passages}
        questions={practiceData.questions}
        difficulty={practiceDifficulty}
        onComplete={handlePracticeComplete}
        onExit={() => setCurrentView('dashboard')}
      />
    );
  }

  // Test Instructions View
  if (currentView === 'instructions') {
    return <TestInstructions onStartTest={handleBeginTest} />;
  }

  // Test Results View
  if (currentView === 'results') {
    return (
      <div className="min-h-screen bg-gray-50">
        <TestResults 
          testSession={testSession} 
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      </div>
    );
  }

  // Main Test View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4" style={{maxWidth: '1024px'}}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">IELTS Reading Mock Test</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
              {/* Timer */}
              <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-mono font-semibold">
                  {formatTime(timeRemaining)}
                </span>
                {timeRemaining < 300 && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              {/* Test Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={isRunning ? pauseTimer : startTimer}
                  className="btn-secondary text-sm sm:text-base"
                >
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={handleCompleteTest}
                  className="btn-primary flex items-center space-x-2 text-sm sm:text-base"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Submit Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="test-container">
        {uiState.isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading test content...</p>
            </div>
          </div>
        ) : uiState.error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Test</h3>
            <p className="text-red-600">{uiState.error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary mt-4"
            >
              Reload Page
            </button>
          </div>
        ) : (
          <TestInterface 
            testSession={testSession}
            onSubmitAnswer={submitAnswer}
            timeRemaining={timeRemaining}
            fontSize={uiState.fontSize}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500" style={{maxWidth: '1024px'}}>
          <p>IELTS Reading Mock Test System • Practice makes perfect</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
