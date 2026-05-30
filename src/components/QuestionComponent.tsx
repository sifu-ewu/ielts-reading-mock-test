import React, { useState, useEffect } from 'react';
import type { Question } from '../types/ielts';

interface QuestionComponentProps {
  question: Question;
  userAnswer: string | string[] | undefined;
  onAnswerChange: (answer: string | string[]) => void;
  fontSize: 'small' | 'medium' | 'large';
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  fontSize,
}) => {
  const [localAnswer, setLocalAnswer] = useState<string | string[]>(userAnswer || '');

  useEffect(() => {
    setLocalAnswer(userAnswer || '');
  }, [userAnswer, question.id]);

  const handleAnswerChange = (answer: string | string[]) => {
    setLocalAnswer(answer);
    onAnswerChange(answer);
  };

  const fontClass =
    fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

  const wordLimitHint = () =>
    question.wordLimit
      ? `Use no more than ${question.wordLimit} word${question.wordLimit > 1 ? 's' : ''} from the passage.`
      : 'Use words from the passage.';

  const renderRadioGroup = (values: string[]) => (
    <div className="space-y-3">
      {values.map((value, index) => {
        const letter = String.fromCharCode(65 + index);
        return (
          <label
            key={value}
            className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={value}
              checked={localAnswer === value}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className={`flex-1 text-gray-800 ${fontClass}`}>
              <span className="font-medium text-gray-700">{letter}.</span>
              <span className="ml-2">{value}</span>
            </span>
          </label>
        );
      })}
    </div>
  );

  const renderTokenDropdown = () => (
    <select
      value={(localAnswer as string) || ''}
      onChange={(e) => handleAnswerChange(e.target.value)}
      className={`answer-input w-full ${fontClass}`}
    >
      <option value="">— Select —</option>
      {question.options?.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );

  const renderTextInput = (placeholder: string) => (
    <div>
      <input
        type="text"
        value={(localAnswer as string) || ''}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder={placeholder}
        className={`answer-input w-full ${fontClass}`}
        maxLength={120}
      />
      <p className="text-xs text-gray-500 mt-1">{wordLimitHint()}</p>
    </div>
  );

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return renderRadioGroup(question.options ?? []);
      case 'true-false-not-given':
        return renderRadioGroup(['TRUE', 'FALSE', 'NOT GIVEN']);
      case 'yes-no-not-given':
        return renderRadioGroup(['YES', 'NO', 'NOT GIVEN']);
      case 'matching-headings':
      case 'matching-information':
      case 'matching-features':
        return renderTokenDropdown();
      case 'short-answer':
        return renderTextInput('Type your answer here...');
      case 'sentence-completion':
      case 'summary-completion':
      case 'table-completion':
        return renderTextInput('Type the missing word(s)...');
      default:
        return renderTextInput('Type your answer here...');
    }
  };

  return (
    <div className="space-y-4">
      {/* Group instruction (shared across the question group) */}
      {question.groupInstruction && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <p className={`text-indigo-900 font-semibold ${fontClass}`}>{question.groupInstruction}</p>
        </div>
      )}

      {/* Shared group content: heading bank, summary text, notes/table */}
      {question.groupContent && (
        <pre
          className={`whitespace-pre-wrap font-sans bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800 ${fontClass}`}
        >
          {question.groupContent}
        </pre>
      )}

      {/* Per-question instruction */}
      {question.instruction && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className={`text-blue-800 font-medium ${fontClass}`}>{question.instruction}</p>
        </div>
      )}

      {/* Question */}
      <div className="space-y-3">
        <h4 className={`font-semibold text-gray-900 ${fontClass}`}>
          <span className="text-blue-700 mr-2">{question.questionNumber}.</span>
          {question.question}
        </h4>
        {renderQuestionContent()}
      </div>

      {/* Question info */}
      <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center">
          <span>Question {question.questionNumber}</span>
          <span>
            {question.points} point{question.points > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionComponent;
