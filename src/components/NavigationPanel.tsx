import React from 'react';
import { CheckCircle, Circle, Flag } from 'lucide-react';

interface NavGroup {
  label: string;
  start: number; // inclusive 0-based index
  end: number; // inclusive 0-based index
}

interface NavigationPanelProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Set<number>;
  visitedQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onQuestionSelect: (index: number) => void;
  groups?: NavGroup[];
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  visitedQuestions,
  flaggedQuestions,
  onQuestionSelect,
  groups,
}) => {
  const getQuestionStatus = (index: number) => {
    if (answeredQuestions.has(index)) return 'answered';
    if (visitedQuestions.has(index)) return 'visited';
    return 'unvisited';
  };

  const getQuestionClass = (index: number) => {
    const status = getQuestionStatus(index);
    const isCurrent = index === currentQuestionIndex;
    let baseClass =
      'relative w-8 h-8 flex items-center justify-center text-xs font-medium border-2 rounded cursor-pointer transition-all duration-200 ';
    if (isCurrent) baseClass += 'ring-2 ring-blue-300 ';
    switch (status) {
      case 'answered':
        baseClass += isCurrent
          ? 'bg-green-600 border-green-600 text-white '
          : 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200 ';
        break;
      case 'visited':
        baseClass += isCurrent
          ? 'bg-yellow-600 border-yellow-600 text-white '
          : 'bg-yellow-100 border-yellow-500 text-yellow-700 hover:bg-yellow-200 ';
        break;
      default:
        baseClass += isCurrent
          ? 'bg-blue-600 border-blue-600 text-white '
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 ';
    }
    return baseClass;
  };

  const renderButton = (index: number) => (
    <div key={index} className="relative">
      <button
        onClick={() => onQuestionSelect(index)}
        className={getQuestionClass(index)}
        title={`Question ${index + 1}${flaggedQuestions.has(index) ? ' (Flagged)' : ''}`}
      >
        {index + 1}
      </button>
      {flaggedQuestions.has(index) && (
        <Flag className="absolute -top-1 -right-1 w-3 h-3 text-yellow-600" />
      )}
    </div>
  );

  const effectiveGroups: NavGroup[] =
    groups && groups.length > 0
      ? groups
      : [{ label: 'Questions', start: 0, end: totalQuestions - 1 }];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h4 className="font-semibold text-gray-900 mb-3">Question Navigation</h4>

      {/* Legend */}
      <div className="mb-4 space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-100 border border-green-500 rounded flex items-center justify-center">
            <CheckCircle className="w-2.5 h-2.5 text-green-600" />
          </div>
          <span className="text-gray-600">Answered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 rounded flex items-center justify-center">
            <Circle className="w-2.5 h-2.5 text-yellow-600" />
          </div>
          <span className="text-gray-600">Visited</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span className="text-gray-600">Not visited</span>
        </div>
        <div className="flex items-center space-x-2">
          <Flag className="w-3 h-3 text-yellow-600" />
          <span className="text-gray-600">Flagged</span>
        </div>
      </div>

      {/* Grouped grids */}
      <div className="space-y-4">
        {effectiveGroups.map((group) => {
          const indices: number[] = [];
          for (let i = group.start; i <= group.end; i++) indices.push(i);
          return (
            <div key={group.label}>
              <div className="text-xs font-medium text-gray-500 mb-2">
                {group.label}{' '}
                <span className="text-gray-400">
                  (Q{group.start + 1}–{group.end + 1})
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">{indices.map(renderButton)}</div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-600">Total:</span>
          <span className="font-medium">{totalQuestions}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-green-600">Answered:</span>
          <span className="font-medium text-green-600">{answeredQuestions.size}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-yellow-600">Flagged:</span>
          <span className="font-medium text-yellow-600">{flaggedQuestions.size}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Remaining:</span>
          <span className="font-medium">{totalQuestions - answeredQuestions.size}</span>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
