import React, { useState, useEffect } from 'react';
import type { Question } from '../types/ielts.ts';

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
  fontSize
}) => {
  const [localAnswer, setLocalAnswer] = useState<string | string[]>(userAnswer || '');

  useEffect(() => {
    setLocalAnswer(userAnswer || '');
  }, [userAnswer, question.id]);

  const handleAnswerChange = (answer: string | string[]) => {
    setLocalAnswer(answer);
    onAnswerChange(answer);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
        return (
          <label
            key={index}
            className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={localAnswer === option}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-700">{optionLetter}.</span>
              <span className={`ml-2 text-gray-800 ${getFontSizeClass()}`}>
                {option}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  );

  const renderTrueFalseNotGiven = () => (
    <div className="space-y-3">
      {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
        <label
          key={option}
          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={localAnswer === option}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-gray-800 font-medium ${getFontSizeClass()}`}>
            {option}
          </span>
        </label>
      ))}
    </div>
  );

  const renderYesNoNotGiven = () => (
    <div className="space-y-3">
      {['YES', 'NO', 'NOT GIVEN'].map((option) => (
        <label
          key={option}
          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option}
            checked={localAnswer === option}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <span className={`text-gray-800 font-medium ${getFontSizeClass()}`}>
            {option}
          </span>
        </label>
      ))}
    </div>
  );

  const renderShortAnswer = () => (
    <div>
      <input
        type="text"
        value={localAnswer as string}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        className={`answer-input w-full ${getFontSizeClass()}`}
        maxLength={100}
      />
      <p className="text-xs text-gray-500 mt-1">
        Maximum 3 words as specified in the instruction
      </p>
    </div>
  );

  const renderSentenceCompletion = () => (
    <div>
      <input
        type="text"
        value={localAnswer as string}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder="Complete the sentence..."
        className={`answer-input w-full ${getFontSizeClass()}`}
        maxLength={200}
      />
      <p className="text-xs text-gray-500 mt-1">
        Complete the sentence with words from the passage
      </p>
    </div>
  );

  const renderMatchingHeadings = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const optionNumber = (index + 1).toString();
        return (
          <label
            key={index}
            className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={optionNumber}
              checked={localAnswer === optionNumber}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-700">{optionNumber}.</span>
              <span className={`ml-2 text-gray-800 ${getFontSizeClass()}`}>
                {option}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  );

  const renderMatchingInformation = () => (
    <div className="space-y-3">
      {question.options?.map((option, index) => {
        const optionLetter = String.fromCharCode(65 + index);
        return (
          <label
            key={index}
            className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={optionLetter}
              checked={localAnswer === optionLetter}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-700">{optionLetter}.</span>
              <span className={`ml-2 text-gray-800 ${getFontSizeClass()}`}>
                {option}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  );

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'true-false-not-given':
        return renderTrueFalseNotGiven();
      case 'yes-no-not-given':
        return renderYesNoNotGiven();
      case 'short-answer':
        return renderShortAnswer();
      case 'sentence-completion':
      case 'summary-completion':
        return renderSentenceCompletion();
      case 'matching-headings':
        return renderMatchingHeadings();
      case 'matching-information':
      case 'matching-features':
        return renderMatchingInformation();
      default:
        return renderShortAnswer();
    }
  };

  return (
    <div className="space-y-4">
      {/* Instruction */}
      {question.instruction && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className={`text-blue-800 font-medium ${getFontSizeClass()}`}>
            {question.instruction}
          </p>
        </div>
      )}

      {/* Question */}
      <div className="space-y-3">
        <h4 className={`font-semibold text-gray-900 ${getFontSizeClass()}`}>
          {question.question}
        </h4>

        {/* Answer Input */}
        {renderQuestionContent()}
      </div>

      {/* Question Info */}
      <div className="text-xs text-gray-500 border-t border-gray-200 pt-3">
        <div className="flex justify-between items-center">
          <span>Question {question.questionNumber}</span>
          <span>{question.points} point{question.points > 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionComponent;
