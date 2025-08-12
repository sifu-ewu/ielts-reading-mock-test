import type { ReadingPassage, Question } from '../types/ielts.ts';

// Enhanced mock test data with 3 complete passages as per IELTS format
export const mockTestData = {
  passages: [
    {
      id: 'passage-1',
      title: 'The History of Timekeeping Devices',
      content: `Throughout human history, the measurement of time has been crucial for the development of civilization. From ancient sundials to atomic clocks, humanity's quest for accurate timekeeping has driven technological innovation across millennia.

The earliest known timekeeping devices were sundials, used by ancient Egyptians around 1500 BCE. These simple instruments used the shadow cast by the sun to indicate the time of day. However, sundials had obvious limitations – they were useless at night and on cloudy days. This led to the development of water clocks, or clepsydrae, which measured time by the regulated flow of water from one vessel to another.

The mechanical clock emerged in medieval Europe during the 13th century. These early clocks used a verge escapement mechanism and were primarily installed in church towers. The invention of the pendulum clock by Christiaan Huygens in 1656 marked a significant leap in accuracy, reducing daily error from about 15 minutes to just 15 seconds.

The 18th century saw the development of marine chronometers by John Harrison, solving the critical problem of determining longitude at sea. These precise timepieces enabled safer navigation and facilitated global exploration and trade. The industrial revolution further drove improvements in timekeeping, as factory schedules demanded synchronization and punctuality.

The 20th century brought revolutionary changes with the invention of quartz clocks in 1927 and atomic clocks in 1955. Quartz technology made accurate timekeeping affordable for everyone, while atomic clocks achieved unprecedented precision, losing less than one second in millions of years. Today's atomic clocks use the vibrations of cesium atoms to define the second with extraordinary accuracy.

Modern timekeeping has evolved beyond mere measurement to become integral to technologies like GPS satellites, computer networks, and financial trading systems. The synchronization of time across global networks is essential for everything from internet communications to scientific research. As we advance into the quantum age, optical lattice clocks promise even greater precision, potentially revolutionizing our understanding of fundamental physics.

The journey from sundials to quantum clocks reflects humanity's persistent drive to measure and master time. Each advancement has not only improved accuracy but has also enabled new technologies and ways of organizing society. As we continue to push the boundaries of temporal precision, who knows what future innovations await?`,
      type: 'academic',
      difficulty: 'easy',
      wordCount: 385,
      topic: 'History and Technology',
      source: 'Academic Reading Practice'
    },
    {
      id: 'passage-2',
      title: 'The Economics of Renewable Energy Transition',
      content: `The global transition to renewable energy represents one of the most significant economic transformations of the 21st century. As countries grapple with climate change commitments and energy security concerns, the economic implications of shifting from fossil fuels to renewable sources have become increasingly complex and far-reaching.

Initially, renewable energy technologies faced significant economic barriers. High capital costs, technological limitations, and entrenched fossil fuel infrastructure made renewables appear economically unviable. However, dramatic cost reductions have transformed this landscape. Solar photovoltaic costs have declined by over 90% since 2010, while wind energy costs have fallen by 70%. These reductions stem from technological improvements, economies of scale, and learning curve effects as production has expanded globally.

The employment implications of the renewable transition are multifaceted. While traditional fossil fuel industries face job losses, the renewable sector has emerged as a significant employer. The International Renewable Energy Agency reports that the sector employed 13.7 million people globally in 2022, with solar photovoltaic being the largest employer at 4.9 million jobs. However, these new jobs often require different skills and geographic locations than traditional energy employment, creating transition challenges for affected communities.

Investment patterns have shifted dramatically. Global renewable energy investment reached $1.8 trillion in 2023, surpassing fossil fuel investment for the first time. This shift reflects not only environmental concerns but also improving renewable economics. Many institutional investors now view fossil fuel assets as potential stranded assets, vulnerable to policy changes and technological disruption. Conversely, renewable projects increasingly attract mainstream financial backing due to stable, long-term returns.

The macroeconomic effects extend beyond the energy sector. Countries heavily dependent on fossil fuel exports face significant fiscal challenges as demand shifts. Conversely, nations with abundant renewable resources gain new comparative advantages. Energy independence through renewables can improve trade balances and reduce vulnerability to geopolitical energy shocks. Additionally, the electrification of transport and heating creates new economic interdependencies and infrastructure requirements.

Grid integration and energy storage present both challenges and opportunities. The intermittent nature of wind and solar requires significant investment in grid flexibility, storage solutions, and demand response systems. While this adds costs, it also drives innovation in battery technology, smart grids, and energy management systems, creating new industries and economic opportunities.

Policy frameworks play a crucial role in shaping transition economics. Carbon pricing, renewable subsidies, and regulatory mandates influence investment decisions and transition pace. The design of these policies significantly impacts economic efficiency and distributional effects. Well-designed policies can accelerate deployment while minimizing economic disruption, while poor policy design can increase costs and create market distortions.

Looking ahead, the economic implications of the renewable transition will continue to evolve. Emerging technologies like green hydrogen, advanced nuclear, and carbon capture may reshape the energy economics landscape. The speed and nature of the transition will profoundly impact global economic competitiveness, employment patterns, and wealth distribution for decades to come.`,
      type: 'academic',
      difficulty: 'medium',
      wordCount: 465,
      topic: 'Economics and Environment',
      source: 'Academic Reading Practice'
    },
    {
      id: 'passage-3',
      title: 'Neuroplasticity: The Brain\'s Remarkable Ability to Reorganize',
      content: `For decades, neuroscientists believed that the adult brain was essentially fixed, with neural connections established in childhood remaining largely unchanged throughout life. This dogma has been thoroughly overturned by research into neuroplasticity – the brain's remarkable ability to reorganize itself by forming new neural connections throughout life. This discovery has profound implications for learning, recovery from brain injury, and our understanding of human potential.

Neuroplasticity occurs at multiple levels, from cellular changes to large-scale cortical remapping. At the cellular level, synaptic plasticity involves the strengthening or weakening of connections between neurons based on their activity patterns. Long-term potentiation (LTP) and long-term depression (LTD) are fundamental mechanisms whereby repeated stimulation can enhance or diminish synaptic transmission. These processes underlie learning and memory formation, allowing experiences to physically reshape neural circuits.

Structural plasticity involves more dramatic changes, including the growth of new dendrites, the formation of new synapses, and even adult neurogenesis – the birth of new neurons in specific brain regions. The discovery of adult neurogenesis in the hippocampus and olfactory bulb challenged the long-held belief that humans are born with all the neurons they will ever have. Environmental enrichment, physical exercise, and learning have been shown to enhance neurogenesis, suggesting that lifestyle choices can influence brain structure.

Perhaps most dramatically, the brain can undergo large-scale reorganization following injury. Studies of stroke patients have revealed the brain's capacity to reassign functions from damaged areas to healthy regions. This cortical remapping can be remarkable – for instance, in individuals who lose their sight, brain areas typically devoted to vision can be recruited for enhanced auditory or tactile processing. This cross-modal plasticity demonstrates the brain's adaptive flexibility.

The discovery of neuroplasticity has revolutionized rehabilitation approaches. Constraint-induced movement therapy, for example, forces stroke patients to use affected limbs, driving cortical reorganization and functional recovery. Similarly, intensive training programs based on neuroplasticity principles have shown promise in treating conditions ranging from dyslexia to chronic pain. The key insight is that targeted, repetitive practice can drive beneficial brain changes at any age.

Recent research has also revealed the dark side of neuroplasticity. Just as the brain can be rewired in adaptive ways, maladaptive plasticity can contribute to various disorders. Chronic pain, for instance, can involve sensitization of pain pathways, while addiction hijacks reward circuits through plasticity mechanisms. Understanding these processes is crucial for developing interventions that promote beneficial plasticity while preventing or reversing harmful changes.

The implications of neuroplasticity extend beyond medicine to education and personal development. The recognition that adult brains remain malleable has encouraged lifelong learning initiatives and challenged age-based stereotypes about learning capacity. Brain training programs, while controversial in their specific claims, reflect growing public awareness that cognitive abilities can be enhanced through practice.

Looking forward, emerging technologies are opening new frontiers in harnessing neuroplasticity. Non-invasive brain stimulation techniques like transcranial magnetic stimulation (TMS) and transcranial direct current stimulation (tDCS) can modulate neural activity and potentially enhance plasticity. Combined with targeted training, these approaches may accelerate recovery from brain injury or enhance cognitive performance.

As our understanding of neuroplasticity deepens, it continues to transform our view of the brain from a static organ to a dynamic, adaptive system capable of remarkable change throughout life. This paradigm shift offers hope for those affected by neurological conditions and inspires us all to recognize the potential for growth and adaptation inherent in our neural architecture.`,
      type: 'academic',
      difficulty: 'hard',
      wordCount: 578,
      topic: 'Neuroscience and Psychology',
      source: 'Academic Reading Practice'
    }
  ] as ReadingPassage[],

  questions: [
    // Passage 1 Questions (Questions 1-13)
    {
      id: 'q1',
      passageId: 'passage-1',
      type: 'multiple-choice',
      questionNumber: 1,
      instruction: 'Choose the correct letter, A, B, C, or D.',
      question: 'What was the main limitation of sundials mentioned in the passage?',
      options: [
        'They were expensive to construct',
        'They could not be used at night or in cloudy weather',
        'They were not accurate enough for navigation',
        'They required complex mathematical calculations'
      ],
      correctAnswer: 'B',
      points: 1,
      explanation: 'The passage explicitly states that sundials "were useless at night and on cloudy days."'
    },
    {
      id: 'q2',
      passageId: 'passage-1',
      type: 'multiple-choice',
      questionNumber: 2,
      instruction: 'Choose the correct letter, A, B, C, or D.',
      question: 'The invention of the pendulum clock reduced daily error from approximately:',
      options: [
        '15 hours to 15 minutes',
        '15 minutes to 15 seconds',
        '15 seconds to 1 second',
        '1 hour to 15 minutes'
      ],
      correctAnswer: 'B',
      points: 1,
      explanation: 'The passage states that the pendulum clock reduced "daily error from about 15 minutes to just 15 seconds."'
    },
    {
      id: 'q3',
      passageId: 'passage-1',
      type: 'true-false-not-given',
      questionNumber: 3,
      instruction: 'Do the following statements agree with the information given in the passage?',
      question: 'Water clocks were invented because sundials had limitations.',
      options: ['TRUE', 'FALSE', 'NOT GIVEN'],
      correctAnswer: 'TRUE',
      points: 1,
      explanation: 'The passage indicates that the limitations of sundials "led to the development of water clocks."'
    },
    {
      id: 'q4',
      passageId: 'passage-1',
      type: 'true-false-not-given',
      questionNumber: 4,
      instruction: 'Do the following statements agree with the information given in the passage?',
      question: 'John Harrison\'s marine chronometers were primarily used for measuring altitude.',
      options: ['TRUE', 'FALSE', 'NOT GIVEN'],
      correctAnswer: 'FALSE',
      points: 1,
      explanation: 'The passage states that marine chronometers solved "the critical problem of determining longitude at sea," not altitude.'
    },
    {
      id: 'q5',
      passageId: 'passage-1',
      type: 'true-false-not-given',
      questionNumber: 5,
      instruction: 'Do the following statements agree with the information given in the passage?',
      question: 'Optical lattice clocks are currently the most accurate timekeeping devices.',
      options: ['TRUE', 'FALSE', 'NOT GIVEN'],
      correctAnswer: 'NOT GIVEN',
      points: 1,
      explanation: 'The passage mentions optical lattice clocks promise greater precision but doesn\'t state they are currently the most accurate.'
    },
    {
      id: 'q6',
      passageId: 'passage-1',
      type: 'matching-information',
      questionNumber: 6,
      instruction: 'Which paragraph contains the following information? Write the correct letter, A-G.',
      question: 'A description of how modern technology depends on precise timekeeping',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      correctAnswer: 'F',
      points: 1,
      explanation: 'Paragraph F discusses how GPS satellites, computer networks, and financial trading systems depend on synchronized time.'
    },
    {
      id: 'q7',
      passageId: 'passage-1',
      type: 'sentence-completion',
      questionNumber: 7,
      instruction: 'Complete the sentences below with NO MORE THAN TWO WORDS from the passage.',
      question: 'The earliest known timekeeping devices used by ancient Egyptians were _____.',
      correctAnswer: 'sundials',
      points: 1,
      explanation: 'The passage states "The earliest known timekeeping devices were sundials, used by ancient Egyptians."'
    },
    {
      id: 'q8',
      passageId: 'passage-1',
      type: 'sentence-completion',
      questionNumber: 8,
      instruction: 'Complete the sentences below with NO MORE THAN TWO WORDS from the passage.',
      question: 'Mechanical clocks in medieval Europe used a _____ mechanism.',
      correctAnswer: 'verge escapement',
      points: 1,
      explanation: 'The passage mentions that early mechanical clocks "used a verge escapement mechanism."'
    },
    {
      id: 'q9',
      passageId: 'passage-1',
      type: 'short-answer',
      questionNumber: 9,
      instruction: 'Answer the questions below using NO MORE THAN THREE WORDS.',
      question: 'In what year were quartz clocks invented?',
      correctAnswer: '1927',
      points: 1,
      explanation: 'The passage states "the invention of quartz clocks in 1927."'
    },
    {
      id: 'q10',
      passageId: 'passage-1',
      type: 'short-answer',
      questionNumber: 10,
      instruction: 'Answer the questions below using NO MORE THAN THREE WORDS.',
      question: 'What type of atoms do modern atomic clocks use for measurement?',
      correctAnswer: 'cesium atoms',
      points: 1,
      explanation: 'The passage mentions that "atomic clocks use the vibrations of cesium atoms."'
    },
    {
      id: 'q11',
      passageId: 'passage-1',
      type: 'matching-headings',
      questionNumber: 11,
      instruction: 'Choose the correct heading for paragraphs B-E from the list below.',
      question: 'Paragraph B',
      options: [
        'i. The impact on global exploration',
        'ii. Early alternatives to sun-based timing',
        'iii. Revolution in affordability',
        'iv. The birth of mechanical timekeeping',
        'v. Precision for the masses',
        'vi. Beyond earthly applications'
      ],
      correctAnswer: 'ii',
      points: 1,
      explanation: 'Paragraph B discusses water clocks as an alternative to sundials.'
    },
    {
      id: 'q12',
      passageId: 'passage-1',
      type: 'matching-headings',
      questionNumber: 12,
      instruction: 'Choose the correct heading for paragraphs B-E from the list below.',
      question: 'Paragraph D',
      options: [
        'i. The impact on global exploration',
        'ii. Early alternatives to sun-based timing',
        'iii. Revolution in affordability',
        'iv. The birth of mechanical timekeeping',
        'v. Precision for the masses',
        'vi. Beyond earthly applications'
      ],
      correctAnswer: 'i',
      points: 1,
      explanation: 'Paragraph D discusses marine chronometers and their role in navigation and global exploration.'
    },
    {
      id: 'q13',
      passageId: 'passage-1',
      type: 'summary-completion',
      questionNumber: 13,
      instruction: 'Complete the summary using words from the box below.',
      question: 'The development of timekeeping devices reflects humanity\'s _____ to measure time accurately. Each advancement has enabled new _____ and ways of organizing _____.',
      options: [
        'desire', 'drive', 'need', 'technologies', 'sciences', 'society', 'culture', 'systems'
      ],
      correctAnswer: ['drive', 'technologies', 'society'],
      points: 1,
      explanation: 'The passage concludes with these exact terms describing the impact of timekeeping advances.'
    },

    // Passage 2 Questions (Questions 14-26)
    {
      id: 'q14',
      passageId: 'passage-2',
      type: 'multiple-choice',
      questionNumber: 14,
      instruction: 'Choose the correct letter, A, B, C, or D.',
      question: 'According to the passage, what has been the approximate reduction in solar photovoltaic costs since 2010?',
      options: [
        '70%',
        '80%',
        '90%',
        '95%'
      ],
      correctAnswer: 'C',
      points: 1,
      explanation: 'The passage states "Solar photovoltaic costs have declined by over 90% since 2010."'
    },
    {
      id: 'q15',
      passageId: 'passage-2',
      type: 'multiple-choice',
      questionNumber: 15,
      instruction: 'Choose the correct letter, A, B, C, or D.',
      question: 'Which renewable energy sector employed the most people globally in 2022?',
      options: [
        'Wind energy',
        'Hydroelectric power',
        'Solar photovoltaic',
        'Geothermal energy'
      ],
      correctAnswer: 'C',
      points: 1,
      explanation: 'The passage indicates "solar photovoltaic being the largest employer at 4.9 million jobs."'
    },
    {
      id: 'q16',
      passageId: 'passage-2',
      type: 'yes-no-not-given',
      questionNumber: 16,
      instruction: 'Do the following statements agree with the views of the writer?',
      question: 'The renewable energy transition will definitely benefit all countries equally.',
      options: ['YES', 'NO', 'NOT GIVEN'],
      correctAnswer: 'NO',
      points: 1,
      explanation: 'The passage discusses how countries dependent on fossil fuel exports face challenges while those with renewable resources gain advantages, indicating unequal benefits.'
    },
    {
      id: 'q17',
      passageId: 'passage-2',
      type: 'yes-no-not-given',
      questionNumber: 17,
      instruction: 'Do the following statements agree with the views of the writer?',
      question: 'Investment in renewable energy exceeded fossil fuel investment for the first time in 2023.',
      options: ['YES', 'NO', 'NOT GIVEN'],
      correctAnswer: 'YES',
      points: 1,
      explanation: 'The passage explicitly states this occurred in 2023.'
    },
    {
      id: 'q18',
      passageId: 'passage-2',
      type: 'matching-features',
      questionNumber: 18,
      instruction: 'Match each statement with the correct category A, B, or C.',
      question: 'Creation of 13.7 million jobs globally',
      options: [
        'A. Challenges of renewable transition',
        'B. Benefits of renewable transition',
        'C. Future uncertainties'
      ],
      correctAnswer: 'B',
      points: 1,
      explanation: 'Job creation is presented as a positive aspect of the renewable sector.'
    },
    {
      id: 'q19',
      passageId: 'passage-2',
      type: 'matching-features',
      questionNumber: 19,
      instruction: 'Match each statement with the correct category A, B, or C.',
      question: 'Need for different skills in new locations',
      options: [
        'A. Challenges of renewable transition',
        'B. Benefits of renewable transition',
        'C. Future uncertainties'
      ],
      correctAnswer: 'A',
      points: 1,
      explanation: 'This is described as creating "transition challenges for affected communities."'
    },
    {
      id: 'q20',
      passageId: 'passage-2',
      type: 'sentence-completion',
      questionNumber: 20,
      instruction: 'Complete the sentences below with NO MORE THAN THREE WORDS from the passage.',
      question: 'Many institutional investors now view fossil fuel assets as potential _____.',
      correctAnswer: 'stranded assets',
      points: 1,
      explanation: 'The passage uses this exact term to describe how investors view fossil fuel assets.'
    },
    {
      id: 'q21',
      passageId: 'passage-2',
      type: 'sentence-completion',
      questionNumber: 21,
      instruction: 'Complete the sentences below with NO MORE THAN THREE WORDS from the passage.',
      question: 'The intermittent nature of wind and solar requires investment in grid flexibility, storage solutions, and _____ systems.',
      correctAnswer: 'demand response',
      points: 1,
      explanation: 'The passage lists these three requirements for managing intermittent renewable energy.'
    },
    {
      id: 'q22',
      passageId: 'passage-2',
      type: 'short-answer',
      questionNumber: 22,
      instruction: 'Answer the questions below using NO MORE THAN TWO WORDS AND/OR A NUMBER.',
      question: 'How much did global renewable energy investment reach in 2023?',
      correctAnswer: '$1.8 trillion',
      points: 1,
      explanation: 'The passage states "Global renewable energy investment reached $1.8 trillion in 2023."'
    },
    {
      id: 'q23',
      passageId: 'passage-2',
      type: 'table-completion',
      questionNumber: 23,
      instruction: 'Complete the table below with NO MORE THAN TWO WORDS from the passage.',
      question: 'Cost reduction factors: technological improvements, economies of scale, and _____ effects',
      correctAnswer: 'learning curve',
      points: 1,
      explanation: 'The passage lists these three factors for cost reductions in renewable energy.'
    },
    {
      id: 'q24',
      passageId: 'passage-2',
      type: 'matching-information',
      questionNumber: 24,
      instruction: 'Which paragraph contains the following information?',
      question: 'Examples of emerging technologies that may affect future energy economics',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      correctAnswer: 'H',
      points: 1,
      explanation: 'The final paragraph mentions green hydrogen, advanced nuclear, and carbon capture as emerging technologies.'
    },
    {
      id: 'q25',
      passageId: 'passage-2',
      type: 'multiple-choice',
      questionNumber: 25,
      instruction: 'Choose the correct letter, A, B, C, or D.',
      question: 'What does the passage suggest about policy frameworks?',
      options: [
        'They have minimal impact on the transition',
        'They only affect renewable energy deployment',
        'They significantly influence investment decisions and transition pace',
        'They always increase economic efficiency'
      ],
      correctAnswer: 'C',
      points: 1,
      explanation: 'The passage states policy frameworks "influence investment decisions and transition pace."'
    },
    {
      id: 'q26',
      passageId: 'passage-2',
      type: 'summary-completion',
      questionNumber: 26,
      instruction: 'Complete the summary using ONE WORD ONLY from the passage for each answer.',
      question: 'The renewable energy transition faces both challenges and opportunities. While the _____ nature of some renewable sources requires new infrastructure, this drives _____ in energy storage and smart grid technologies.',
      correctAnswer: ['intermittent', 'innovation'],
      points: 1,
      explanation: 'The passage uses these specific terms when discussing grid integration challenges and opportunities.'
    },

    // Passage 3 Questions (Questions 27-40)
    {
      id: 'q27',
      passageId: 'passage-3',
      type: 'multiple-choice',
      questionNumber: 27,
      instruction: 'Choose the correct letter, A, B, C, or D.',
      question: 'What was the traditional belief about the adult brain that has been overturned?',
      options: [
        'It could grow new neurons throughout life',
        'It was capable of learning new skills',
        'It remained essentially fixed after childhood',
        'It could recover from any injury'
      ],
      correctAnswer: 'C',
      points: 1,
      explanation: 'The passage states scientists believed "the adult brain was essentially fixed, with neural connections established in childhood remaining largely unchanged."'
    },
    {
      id: 'q28',
      passageId: 'passage-3',
      type: 'multiple-choice',
      questionNumber: 28,
      instruction: 'Choose the correct letter, A, B, C, or D.',
      question: 'According to the passage, where does adult neurogenesis occur?',
      options: [
        'Throughout the entire brain',
        'Only in the cortex',
        'In the hippocampus and olfactory bulb',
        'Only in damaged brain regions'
      ],
      correctAnswer: 'C',
      points: 1,
      explanation: 'The passage specifically mentions "adult neurogenesis in the hippocampus and olfactory bulb."'
    },
    {
      id: 'q29',
      passageId: 'passage-3',
      type: 'yes-no-not-given',
      questionNumber: 29,
      instruction: 'Do the following statements agree with the claims of the writer?',
      question: 'Neuroplasticity always produces beneficial changes in the brain.',
      options: ['YES', 'NO', 'NOT GIVEN'],
      correctAnswer: 'NO',
      points: 1,
      explanation: 'The passage discusses "the dark side of neuroplasticity" and mentions maladaptive plasticity contributing to disorders.'
    },
    {
      id: 'q30',
      passageId: 'passage-3',
      type: 'yes-no-not-given',
      questionNumber: 30,
      instruction: 'Do the following statements agree with the claims of the writer?',
      question: 'Physical exercise can enhance the growth of new neurons.',
      options: ['YES', 'NO', 'NOT GIVEN'],
      correctAnswer: 'YES',
      points: 1,
      explanation: 'The passage states "physical exercise...have been shown to enhance neurogenesis."'
    },
    {
      id: 'q31',
      passageId: 'passage-3',
      type: 'matching-information',
      questionNumber: 31,
      instruction: 'Which paragraph contains the following information?',
      question: 'Examples of how neuroplasticity can contribute to medical conditions',
      options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
      correctAnswer: 'F',
      points: 1,
      explanation: 'Paragraph F discusses how chronic pain and addiction involve maladaptive plasticity.'
    },
    {
      id: 'q32',
      passageId: 'passage-3',
      type: 'matching-headings',
      questionNumber: 32,
      instruction: 'Choose the correct heading for the paragraph from the list below.',
      question: 'Paragraph E',
      options: [
        'i. Molecular mechanisms of change',
        'ii. Therapeutic applications',
        'iii. Educational implications',
        'iv. Technological enhancements',
        'v. Negative consequences'
      ],
      correctAnswer: 'ii',
      points: 1,
      explanation: 'Paragraph E discusses rehabilitation approaches and therapeutic applications of neuroplasticity.'
    },
    {
      id: 'q33',
      passageId: 'passage-3',
      type: 'sentence-completion',
      questionNumber: 33,
      instruction: 'Complete the sentences below with NO MORE THAN THREE WORDS from the passage.',
      question: 'The strengthening or weakening of connections between neurons is called _____.',
      correctAnswer: 'synaptic plasticity',
      points: 1,
      explanation: 'The passage defines "synaptic plasticity involves the strengthening or weakening of connections between neurons."'
    },
    {
      id: 'q34',
      passageId: 'passage-3',
      type: 'sentence-completion',
      questionNumber: 34,
      instruction: 'Complete the sentences below with NO MORE THAN THREE WORDS from the passage.',
      question: 'In blind individuals, brain areas for vision can be used for enhanced _____ processing.',
      correctAnswer: 'auditory or tactile',
      points: 1,
      explanation: 'The passage mentions these areas can be recruited for "enhanced auditory or tactile processing."'
    },
    {
      id: 'q35',
      passageId: 'passage-3',
      type: 'short-answer',
      questionNumber: 35,
      instruction: 'Answer the questions below using NO MORE THAN THREE WORDS.',
      question: 'What type of therapy forces stroke patients to use affected limbs?',
      correctAnswer: 'Constraint-induced movement therapy',
      points: 1,
      explanation: 'The passage specifically names this therapy for stroke rehabilitation.'
    },
    {
      id: 'q36',
      passageId: 'passage-3',
      type: 'short-answer',
      questionNumber: 36,
      instruction: 'Answer the questions below using NO MORE THAN TWO WORDS.',
      question: 'What do the abbreviations LTP and LTD stand for in the context of neural processes?',
      correctAnswer: ['Long-term potentiation', 'Long-term depression'],
      points: 1,
      explanation: 'The passage defines these as "Long-term potentiation (LTP) and long-term depression (LTD)."'
    },
    {
      id: 'q37',
      passageId: 'passage-3',
      type: 'diagram-labeling',
      questionNumber: 37,
      instruction: 'Label the diagram below using words from the passage.',
      question: 'Types of neuroplasticity: 1) _____ (cellular level) 2) _____ (includes neurogenesis)',
      correctAnswer: ['synaptic plasticity', 'structural plasticity'],
      points: 1,
      explanation: 'The passage describes these two main types of neuroplasticity.'
    },
    {
      id: 'q38',
      passageId: 'passage-3',
      type: 'multiple-choice',
      questionNumber: 38,
      instruction: 'Choose TWO letters, A-E.',
      question: 'Which TWO factors are mentioned as enhancing neurogenesis?',
      options: [
        'A. Environmental enrichment',
        'B. Medication',
        'C. Physical exercise',
        'D. Meditation',
        'E. Diet'
      ],
      correctAnswer: ['A', 'C'],
      points: 1,
      explanation: 'The passage specifically mentions "Environmental enrichment, physical exercise, and learning."'
    },
    {
      id: 'q39',
      passageId: 'passage-3',
      type: 'matching-features',
      questionNumber: 39,
      instruction: 'Match each technology with its classification.',
      question: 'TMS (Transcranial Magnetic Stimulation)',
      options: [
        'A. Traditional therapy',
        'B. Non-invasive brain stimulation',
        'C. Surgical intervention',
        'D. Pharmaceutical treatment'
      ],
      correctAnswer: 'B',
      points: 1,
      explanation: 'The passage classifies TMS as a "Non-invasive brain stimulation technique."'
    },
    {
      id: 'q40',
      passageId: 'passage-3',
      type: 'summary-completion',
      questionNumber: 40,
      instruction: 'Complete the summary using words from the passage.',
      question: 'Neuroplasticity research has transformed our understanding of the brain from a _____ organ to a _____, adaptive system. This offers hope for neurological conditions and recognizes the potential for _____ throughout life.',
      correctAnswer: ['static', 'dynamic', 'growth and adaptation'],
      points: 1,
      explanation: 'The conclusion uses these exact terms to describe the paradigm shift in understanding the brain.'
    }
  ] as Question[]
};

// Additional test variations for practice mode
export const practiceTests = {
  easy: {
    passages: [mockTestData.passages[0]],
    questions: mockTestData.questions.filter(q => q.passageId === 'passage-1')
  },
  medium: {
    passages: [mockTestData.passages[1]],
    questions: mockTestData.questions.filter(q => q.passageId === 'passage-2')
  },
  hard: {
    passages: [mockTestData.passages[2]],
    questions: mockTestData.questions.filter(q => q.passageId === 'passage-3')
  },
  full: mockTestData
};
