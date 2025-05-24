import type { ReadingPassage, Question } from '../types/ielts.ts';

export const mockTestData = {
  passages: [
    {
      id: 'passage-1',
      title: 'The Rise of Artificial Intelligence in Healthcare',
      content: `Artificial Intelligence (AI) is revolutionizing healthcare by transforming how medical professionals diagnose, treat, and manage patient care. From machine learning algorithms that can detect cancer in medical imaging to natural language processing systems that analyze electronic health records, AI technologies are becoming increasingly sophisticated and valuable in clinical settings.

One of the most significant applications of AI in healthcare is medical imaging. Deep learning models can now analyze X-rays, MRIs, and CT scans with remarkable accuracy, often matching or exceeding the performance of experienced radiologists. For instance, Google's AI system for diabetic retinopathy screening has shown the ability to detect the condition with over 90% accuracy, potentially preventing blindness in millions of patients worldwide.

Another promising area is drug discovery and development. Traditional pharmaceutical research can take decades and cost billions of dollars to bring a new drug to market. AI algorithms can accelerate this process by analyzing vast databases of molecular structures, predicting how different compounds might interact with specific proteins, and identifying potential drug candidates much faster than conventional methods.

AI is also transforming patient monitoring and care management. Wearable devices equipped with AI can continuously track vital signs and alert healthcare providers to potential problems before they become critical. This proactive approach to healthcare could significantly reduce hospital readmissions and improve patient outcomes.

However, the integration of AI in healthcare also presents challenges. Privacy concerns regarding patient data, the need for regulatory frameworks to ensure AI safety and efficacy, and the potential for algorithmic bias are all important considerations. Additionally, there is concern about the impact on employment in the healthcare sector, as some routine tasks may become automated.

Despite these challenges, the potential benefits of AI in healthcare are enormous. As technology continues to advance and regulatory frameworks evolve, we can expect to see even more innovative applications that will improve patient care and make healthcare more accessible and efficient.`,
      type: 'academic',
      difficulty: 'medium',
      wordCount: 320,
      topic: 'Technology and Healthcare',
      source: 'Academic Reading Practice'
    },
    {
      id: 'passage-2',
      title: 'Urban Farming: Feeding Cities Sustainably',
      content: `As urban populations continue to grow worldwide, cities are exploring innovative ways to produce food locally and sustainably. Urban farming, which includes practices like vertical farming, rooftop gardens, and hydroponic systems, is emerging as a viable solution to food security challenges in metropolitan areas.

Vertical farming represents one of the most technologically advanced forms of urban agriculture. These facilities use controlled environments with LED lighting, climate control, and nutrient solutions to grow crops in stacked layers. This method can produce significantly higher yields per square foot compared to traditional farming while using 95% less water and no pesticides.

Community gardens have also gained popularity as a form of urban farming that brings social benefits alongside food production. These shared spaces allow residents to grow their own vegetables and herbs while fostering community connections and teaching sustainable practices to younger generations.

The economic impact of urban farming is becoming increasingly significant. Local food production reduces transportation costs and carbon emissions associated with shipping produce from rural areas. It also creates employment opportunities in urban areas and can revitalize abandoned or underutilized city spaces.

However, urban farming faces several obstacles. High startup costs for technology-intensive operations like vertical farms, limited available space in dense urban areas, and zoning regulations that may not accommodate agricultural activities are common challenges. Additionally, ensuring food safety and meeting health regulations can be complex in urban environments.

Despite these challenges, many cities are embracing urban farming initiatives. Singapore aims to produce 30% of its food locally by 2030, while cities like Detroit and Berlin have integrated urban agriculture into their urban planning strategies. As technology improves and costs decrease, urban farming is likely to play an increasingly important role in feeding the world's growing urban population.`,
      type: 'academic',
      difficulty: 'medium',
      wordCount: 290,
      topic: 'Urban Development and Agriculture',
      source: 'Academic Reading Practice'
    }
  ] as ReadingPassage[],

  questions: [
    // Passage 1 Questions
    {
      id: 'q1',
      passageId: 'passage-1',
      type: 'multiple-choice',
      questionNumber: 1,
      instruction: 'Choose the correct letter, A, B, C or D.',
      question: 'According to the passage, what is one of the most significant applications of AI in healthcare?',
      options: [
        'Electronic health records management',
        'Medical imaging analysis',
        'Patient appointment scheduling', 
        'Hospital administration'
      ],
      correctAnswer: 'Medical imaging analysis',
      points: 1,
      explanation: 'The passage clearly states that "One of the most significant applications of AI in healthcare is medical imaging."'
    },
    {
      id: 'q2',
      passageId: 'passage-1',
      type: 'true-false-not-given',
      questionNumber: 2,
      instruction: 'Do the following statements agree with the information given in the passage? Write TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.',
      question: 'Google\'s AI system for diabetic retinopathy screening has 100% accuracy.',
      correctAnswer: 'FALSE',
      points: 1,
      explanation: 'The passage states the system has "over 90% accuracy", not 100%.'
    },
    {
      id: 'q3',
      passageId: 'passage-1',
      type: 'short-answer',
      questionNumber: 3,
      instruction: 'Answer the question using NO MORE THAN THREE WORDS from the passage.',
      question: 'What type of approach to healthcare could reduce hospital readmissions?',
      correctAnswer: 'proactive approach',
      points: 1,
      explanation: 'The passage mentions "This proactive approach to healthcare could significantly reduce hospital readmissions".'
    },
    {
      id: 'q4',
      passageId: 'passage-1',
      type: 'multiple-choice',
      questionNumber: 4,
      instruction: 'Choose the correct letter, A, B, C or D.',
      question: 'Which of the following is mentioned as a challenge for AI integration in healthcare?',
      options: [
        'Lack of skilled professionals',
        'High cost of equipment',
        'Privacy concerns regarding patient data',
        'Insufficient research funding'
      ],
      correctAnswer: 'Privacy concerns regarding patient data',
      points: 1,
      explanation: 'The passage explicitly mentions "Privacy concerns regarding patient data" as one of the challenges.'
    },

    // Passage 2 Questions
    {
      id: 'q5',
      passageId: 'passage-2',
      type: 'true-false-not-given',
      questionNumber: 5,
      instruction: 'Do the following statements agree with the information given in the passage?',
      question: 'Vertical farming uses more water than traditional farming methods.',
      correctAnswer: 'FALSE',
      points: 1,
      explanation: 'The passage states that vertical farming uses "95% less water" than traditional farming.'
    },
    {
      id: 'q6',
      passageId: 'passage-2',
      type: 'sentence-completion',
      questionNumber: 6,
      instruction: 'Complete the sentence using NO MORE THAN TWO WORDS from the passage.',
      question: 'Community gardens provide _______ benefits in addition to food production.',
      correctAnswer: 'social benefits',
      points: 1,
      explanation: 'The passage mentions that community gardens "bring social benefits alongside food production".'
    },
    {
      id: 'q7',
      passageId: 'passage-2',
      type: 'multiple-choice',
      questionNumber: 7,
      instruction: 'Choose the correct letter, A, B, C or D.',
      question: 'What percentage of food does Singapore aim to produce locally by 2030?',
      options: [
        '20%',
        '25%',
        '30%',
        '35%'
      ],
      correctAnswer: '30%',
      points: 1,
      explanation: 'The passage states "Singapore aims to produce 30% of its food locally by 2030".'
    },
    {
      id: 'q8',
      passageId: 'passage-2',
      type: 'matching-information',
      questionNumber: 8,
      instruction: 'Match the information with the correct description.',
      question: 'Which paragraph mentions the economic benefits of urban farming?',
      options: [
        'Paragraph 1',
        'Paragraph 2', 
        'Paragraph 3',
        'Paragraph 4'
      ],
      correctAnswer: 'Paragraph 4',
      points: 1,
      explanation: 'Paragraph 4 discusses "The economic impact of urban farming".'
    }
  ] as Question[]
};
