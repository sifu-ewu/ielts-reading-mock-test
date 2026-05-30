import React, { useRef } from 'react';
import type { ReadingPassage } from '../types/ielts';

interface PassageDisplayProps {
  passage: ReadingPassage;
  fontSize: 'small' | 'medium' | 'large';
  highlightEnabled: boolean;
}

const PassageDisplay: React.FC<PassageDisplayProps> = ({ passage, fontSize, highlightEnabled }) => {
  const ref = useRef<HTMLDivElement>(null);
  const fontClass =
    fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

  // Wrap the current selection in <mark> when highlighting is on.
  const handleMouseUp = () => {
    if (!highlightEnabled) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !ref.current) return;
    const range = sel.getRangeAt(0);
    if (!ref.current.contains(range.commonAncestorContainer)) return;
    try {
      const mark = document.createElement('mark');
      mark.className = 'highlight';
      range.surroundContents(mark);
      sel.removeAllRanges();
    } catch {
      // Selection spans element boundaries — ignore.
    }
  };

  // Click a highlight to remove it.
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'MARK') {
      const parent = target.parentNode;
      if (!parent) return;
      while (target.firstChild) parent.insertBefore(target.firstChild, target);
      parent.removeChild(target);
    }
  };

  // Pair a lone label line (A–G) with the text block that follows it.
  const blocks = passage.content.split('\n\n');
  const paragraphs: { label?: string; text: string }[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i].trim();
    if (/^[A-G]$/.test(b) && i + 1 < blocks.length) {
      paragraphs.push({ label: b, text: blocks[++i].trim() });
    } else if (b) {
      paragraphs.push({ text: b });
    }
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{passage.title}</h2>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <span className="capitalize">{passage.type}</span>
          <span>•</span>
          <span className="capitalize">{passage.difficulty}</span>
          <span>•</span>
          <span>{passage.wordCount} words</span>
        </div>
      </div>

      <div
        ref={ref}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        className={`passage-text ${fontClass} space-y-4 ${highlightEnabled ? 'cursor-text' : ''}`}
      >
        {paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed text-gray-800">
            {p.label && <span className="font-bold mr-2">{p.label}</span>}
            {p.text}
          </p>
        ))}
      </div>

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
