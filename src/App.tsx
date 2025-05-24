import { useState, useEffect } from 'react';
import { Clock, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import type { UIState } from './types/ielts';
import TestInterface from './components/TestInterface.tsx';
import TestResults from './components/TestResults.tsx';
import TestInstructions from './components/TestInstructions.tsx';
import { useTimer } from './hooks/useTimer.ts';
import { useTestSession } from './hooks/useTestSession.ts';
import './App.css';

function App() {
  const [uiState, setUIState] = useState<UIState>({
    isLoading: false,
    error: null,
    showInstructions: true,
    showResults: false,
    highlightedText: null,
    fontSize: 'medium'
  });

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
    pauseTimer
  } = useTimer(3600); // 60 minutes

  const handleStartTest = () => {
    setUIState(prev => ({ ...prev, showInstructions: false }));
    startTest();
    startTimer();
  };

  const handleCompleteTest = () => {
    completeTest();
    setUIState(prev => ({ ...prev, showResults: true }));
  };

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      handleCompleteTest();
    }
  }, [timeRemaining, isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (uiState.showInstructions) {
    return <TestInstructions onStartTest={handleStartTest} />;
  }

  if (uiState.showResults) {
    return <TestResults testSession={testSession} />;
  }

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
