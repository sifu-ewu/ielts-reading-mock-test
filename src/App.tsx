import { useState, useEffect } from 'react';
import { Clock, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import type { UIState } from './types/ielts';
import TestInterface from './components/TestInterface';
import TestResults from './components/TestResults';
import TestInstructions from './components/TestInstructions';
import { useTimer } from './hooks/useTimer';
import { useTestSession } from './hooks/useTestSession';
import './App.css';

const TEST_SECONDS = 3600; // 60 minutes

function App() {
  const [uiState, setUIState] = useState<UIState>({
    isLoading: false,
    error: null,
    showInstructions: true,
    showResults: false,
    highlightedText: null,
    fontSize: 'medium',
  });

  const {
    testSession,
    testResult,
    hasSavedSession,
    currentQuestionIndex,
    flaggedQuestions,
    visitedQuestions,
    startTest,
    resumeTest,
    restartTest,
    submitAnswer,
    goToQuestion,
    toggleFlag,
    completeTest,
  } = useTestSession();

  const {
    timeRemaining,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimeRemaining,
  } = useTimer(TEST_SECONDS);

  const handleStartTest = () => {
    setUIState((prev) => ({ ...prev, showInstructions: false, showResults: false }));
    startTest();
    resetTimer();
    setTimeRemaining(TEST_SECONDS);
    startTimer();
  };

  const handleResume = () => {
    setUIState((prev) => ({ ...prev, showInstructions: false, showResults: false }));
    resumeTest();
    startTimer();
  };

  const handleRestart = () => {
    restartTest();
    resetTimer();
    setTimeRemaining(TEST_SECONDS);
    setUIState((prev) => ({ ...prev, showInstructions: false, showResults: false }));
    startTimer();
  };

  const handleCompleteTest = () => {
    completeTest();
    pauseTimer();
    setUIState((prev) => ({ ...prev, showResults: true, showInstructions: false }));
  };

  const handleRetake = () => {
    restartTest();
    resetTimer();
    setTimeRemaining(TEST_SECONDS);
    setUIState((prev) => ({ ...prev, showResults: false, showInstructions: false }));
    startTimer();
  };

  const handleFontSizeChange = (fontSize: UIState['fontSize']) => {
    setUIState((prev) => ({ ...prev, fontSize }));
  };

  // Auto-submit when time runs out.
  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      handleCompleteTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (uiState.showInstructions) {
    return (
      <TestInstructions
        onStartTest={handleStartTest}
        hasSavedSession={hasSavedSession}
        onResume={handleResume}
        onRestart={handleRestart}
      />
    );
  }

  if (uiState.showResults) {
    return <TestResults testSession={testSession} testResult={testResult} onRetake={handleRetake} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="test-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">IELTS Reading Mock Test</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div
                className={`flex items-center space-x-2 border rounded-lg p-3 ${
                  timeRemaining < 300 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <Clock className="h-5 w-5" />
                <span className="text-lg font-mono font-semibold">{formatTime(timeRemaining)}</span>
                {timeRemaining < 300 && <AlertCircle className="h-5 w-5 text-red-500" />}
              </div>

              <div className="flex items-center space-x-2">
                <button onClick={isRunning ? pauseTimer : startTimer} className="btn-secondary text-sm sm:text-base">
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button onClick={handleCompleteTest} className="btn-primary flex items-center space-x-2 text-sm sm:text-base">
                  <CheckCircle className="h-4 w-4" />
                  <span>Submit Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="test-container">
        <TestInterface
          testSession={testSession}
          onSubmitAnswer={submitAnswer}
          timeRemaining={timeRemaining}
          fontSize={uiState.fontSize}
          onFontSizeChange={handleFontSizeChange}
          currentQuestionIndex={currentQuestionIndex}
          onNavigate={goToQuestion}
          flaggedQuestions={flaggedQuestions}
          onToggleFlag={toggleFlag}
          visitedQuestions={visitedQuestions}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="test-container text-center text-sm text-gray-500">
          <p>IELTS Reading Mock Test System • Practice makes perfect</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
