import React from 'react';
import type { ReadingPassage } from '../types/ielts.ts';

interface PassageDisplayProps {
  passage: ReadingPassage;
  fontSize: 'small' | 'medium' | 'large';
  highlightedText: string | null;
}

const PassageDisplay: React.FC<PassageDisplayProps> = ({
  passage,
  fontSize,
  highlightedText
}) => {
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const formatContent = (content: string) => {
    if (!highlightedText) return content;
    
    const regex = new RegExp(`(${highlightedText})`, 'gi');
    return content.replace(regex, '<mark class="highlight">$1</mark>');
  };

  const paragraphs = passage.content.split('\n\n').filter(p => p.trim());

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {passage.title}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="capitalize">{passage.type}</span>
          <span>•</span>
          <span className="capitalize">{passage.difficulty}</span>
          <span>•</span>
          <span>{passage.wordCount} words</span>
          {passage.source && (
            <>
              <span>•</span>
              <span>{passage.source}</span>
            </>
          )}
        </div>
      </div>

      <div className={`passage-text ${getFontSizeClass()} space-y-4`}>
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{
              __html: formatContent(paragraph)
            }}
          />
        ))}
      </div>

      {/* Topic indicator */}
      {passage.topic && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            Topic: {passage.topic}
          </span>
        </div>
      )}
    </div>
  );
};

export default PassageDisplay;
