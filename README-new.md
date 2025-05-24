# IELTS Reading Mock Test System

A comprehensive IELTS Reading Mock Test System built with React, TypeScript, and Vite. This system provides an authentic IELTS reading test experience with interactive interface, real-time timer, multiple question types, and automatic scoring.

## 🚀 Features

### Core Features
- **Interactive Test Interface**: Clean, distraction-free test-taking environment
- **60-Minute Timer**: Real-time countdown with auto-submit functionality
- **Multiple Question Types**: Support for all IELTS reading question formats:
  - Multiple Choice
  - True/False/Not Given
  - Matching Headings
  - Gap Filling (Fill in the blanks)
  - Short Answer Questions
  - Matching Information

### Test Management
- **Progress Tracking**: Visual progress indicators and question navigation
- **Question Flagging**: Mark questions for review
- **Answer Persistence**: Answers are saved as you type
- **Automatic Scoring**: IELTS band calculation based on official scoring criteria
- **Detailed Results**: Performance analysis with recommendations

### User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Modern UI**: Clean, professional interface suitable for test environment
- **Font Loading**: Inter font family for optimal readability

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom IELTS theme
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Timer**: Custom useTimer hook with countdown functionality
- **Scoring**: Custom IELTS band calculation algorithms

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── TestInterface.tsx     # Main test interface
│   ├── PassageDisplay.tsx    # Reading passage viewer
│   ├── QuestionComponent.tsx # Dynamic question renderer
│   ├── NavigationPanel.tsx   # Question navigation grid
│   ├── TestInstructions.tsx  # Pre-test instructions
│   └── TestResults.tsx       # Results and scoring display
├── hooks/               # Custom React hooks
│   ├── useTimer.ts          # Timer functionality
│   └── useTestSession.ts    # Test state management
├── types/               # TypeScript type definitions
│   └── ielts.ts            # IELTS-specific types
├── utils/               # Utility functions
│   └── scoring.ts          # IELTS scoring algorithms
├── data/                # Mock data
│   └── mockTestData.ts     # Sample reading passages and questions
└── assets/              # Static assets
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mock
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Usage

### Taking a Test

1. **Start**: Click "Start Test" from the instructions screen
2. **Navigate**: Use the question navigation panel to move between questions
3. **Answer**: Select or type answers based on question type
4. **Flag**: Mark questions for review using the flag button
5. **Submit**: Test auto-submits when timer expires, or submit manually
6. **Results**: View detailed scoring and performance analysis

### Question Types

#### Multiple Choice
- Select one correct answer from multiple options
- Radio button interface for single selection

#### True/False/Not Given
- Determine if statements are True, False, or Not Given based on the passage
- Three-option selection for each statement

#### Matching Headings
- Match paragraph headings to sections of the text
- Dropdown selection interface

#### Gap Filling
- Fill in missing words or phrases in sentences
- Text input fields with character limits

#### Short Answer Questions
- Provide brief answers to specific questions
- Text input with word/character limits

#### Matching Information
- Match information to specific paragraphs or sections
- Dropdown selection interface

## 🎨 Customization

### Theme Colors
The system uses a custom IELTS color palette defined in `tailwind.config.js`:
- Primary: Blue (#1e40af)
- Secondary: Dark gray (#374151)
- Accent: Green (#059669)
- Warning: Yellow (#d97706)
- Error: Red (#dc2626)

### Adding New Test Data
Edit `src/data/mockTestData.ts` to add new reading passages and questions. Follow the existing structure for consistency.

### Modifying Scoring
Update `src/utils/scoring.ts` to adjust band calculation algorithms or add new scoring criteria.

## 🧪 Testing

The system includes comprehensive TypeScript type checking and can be extended with unit tests. The current mock data includes:
- 2 academic reading passages
- 8 questions across different question types
- Realistic IELTS content and difficulty

## 📚 IELTS Standards Compliance

This system follows official IELTS Reading test standards:
- 60-minute time limit
- Academic reading passage difficulty
- Official question types and formats
- Standard band scoring (1-9 scale)
- Authentic test-taking experience

## 🤝 Contributing

1. Follow the coding guidelines in `.github/copilot-instructions.md`
2. Use TypeScript for all new components
3. Implement proper error handling and loading states
4. Follow IELTS test format standards
5. Maintain responsive design principles

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the VS Code tasks for common operations
2. Review TypeScript types in `src/types/ielts.ts`
3. Examine component implementations for usage examples
4. Test with the provided mock data
