import type { ReadingPassage, Question } from '../types/ielts';

// ---------------------------------------------------------------------------
// Shared group instructions / content (kept DRY; rendered above each question
// belonging to the group, because the UI shows one question at a time).
// ---------------------------------------------------------------------------

const P1_HEADINGS_INSTR =
  'Questions 1–5: The passage has six paragraphs, A–F. Choose the correct heading for paragraphs A–E from the list of headings below. Write the correct number, i–viii.';
const P1_HEADINGS_BANK =
  'List of Headings\n' +
  'i    How light is produced chemically\n' +
  'ii   Light as a defence\n' +
  'iii  A definition and where it occurs\n' +
  'iv   Using light to find a mate\n' +
  'v    Practical uses for scientists\n' +
  'vi   The high cost of glowing\n' +
  'vii  Attracting a meal\n' +
  'viii Light and human emotion';
const P1_TFNG_INSTR =
  'Questions 6–9: Do the following statements agree with the information given in the passage? Write TRUE if the statement agrees, FALSE if it contradicts, or NOT GIVEN if there is no information.';
const P1_SUMMARY_INSTR =
  'Questions 10–13: Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.';
const P1_SUMMARY_TEXT =
  'How living things make light\n\n' +
  'Many marine organisms create light when a molecule called (10) ________ reacts with oxygen. ' +
  'This reaction is controlled by an enzyme known as (11) ________. Scientists call the glow ' +
  '"cold light" because very little energy is lost as (12) ________. In the sea, the light produced ' +
  'is usually (13) ________ in colour, as this travels furthest through water.';

const P2_MC_INSTR = 'Questions 14–18: Choose the correct letter, A, B, C or D.';
const P2_INFO_INSTR =
  'Questions 19–22: The passage has six paragraphs, A–F. Which paragraph contains the following information? Write the correct letter, A–F.';
const P2_SHORT_INSTR =
  'Questions 23–26: Answer the questions below using NO MORE THAN THREE WORDS from the passage for each answer.';

const P3_YNNG_INSTR =
  'Questions 27–31: Do the following statements agree with the views of the writer? Write YES if the statement agrees with the views of the writer, NO if it contradicts them, or NOT GIVEN if it is impossible to say what the writer thinks.';
const P3_FEATURES_INSTR =
  'Questions 32–35: Match each statement with the correct researcher, A, B or C. You may use any letter more than once.';
const P3_FEATURES_BANK =
  'List of Researchers\nA  B. F. Skinner\nB  Noam Chomsky\nC  Michael Tomasello';
const P3_NOTES_INSTR =
  'Questions 36–40: Complete the notes below. Choose ONE WORD ONLY from the passage for each answer.';
const P3_NOTES_TEXT =
  'Theories of language learning\n\n' +
  'Skinner: language is learned through imitation and (36) ________; the newborn mind is like a ' +
  'blank (37) ________.\n' +
  'Chomsky: the brain has an innate template he called Universal (38) ________.\n' +
  'Tomasello: what matters most is social (39) ________ between infants and adults.\n' +
  'Modern view: children are born with general learning abilities that interact with a rich social ' +
  '(40) ________.';

// ---------------------------------------------------------------------------
// Passages
// ---------------------------------------------------------------------------

const passages: ReadingPassage[] = [
  {
    id: 'passage-1',
    title: 'Bioluminescence: Living Light',
    content: `A

Bioluminescence is the production and emission of light by a living organism. It occurs widely across the natural world, from glowing fungi on a forest floor to the flashing lanterns of fireflies, yet it is in the ocean that the phenomenon is most common. Scientists estimate that the majority of animals living in the open sea below a few hundred metres are capable of producing their own light. On land the ability is comparatively rare, but in the deep ocean, where sunlight never reaches, glowing bodies are the rule rather than the exception. Most of this ocean light is blue, the colour that travels furthest through seawater.

B

The light is the result of a chemical reaction. In most species it involves a light-emitting molecule called luciferin and an enzyme called luciferase. When luciferin reacts with oxygen, in a process controlled by luciferase, energy is released in the form of light. Crucially, almost none of this energy escapes as heat, which is why biologists describe the glow as "cold light". An ordinary light bulb, by contrast, wastes most of its energy warming the air around it.

C

For many creatures, light is a language. Fireflies are the most familiar example: males and females flash to one another in patterns that are unique to their species, allowing them to find a suitable mate in the dark. Each species has its own rhythm of flashes, and a female will respond only to the correct sequence. In this way light functions much as birdsong does, advertising an individual's identity and availability to potential partners.

D

Other animals use light to hunt. The deep-sea anglerfish carries a glowing lure on a stalk above its mouth; smaller fish, drawn towards the light in the darkness, swim straight into its jaws. The cookie-cutter shark is thought to glow in a way that disguises its outline while leaving a small dark patch resembling a tiny fish, tempting larger predators close enough to bite. For these hunters, light is simply bait.

E

Light can also save a life. When attacked, some squid eject a cloud of glowing material instead of dark ink, confusing a predator while the squid escapes into the gloom. Many small sea creatures use a trick called counter-illumination: they glow faintly on their undersides so that, seen from below, their silhouettes disappear against the dim light filtering down from the surface. Still others light up suddenly to startle an attacker, or to summon an even larger predator that will threaten the animal attacking them.

F

Bioluminescence has proved valuable to people as well. The genes responsible for light production have been transferred into other organisms so that researchers can watch processes that would otherwise be invisible. By attaching a luminescent tag to a virus or a cancer cell, scientists can follow its movement through a living body. Such techniques have become a standard tool in medical and biological laboratories around the world.`,
    type: 'academic',
    difficulty: 'medium',
    wordCount: 470,
    topic: 'Marine Biology',
    source: 'Academic Reading Practice',
  },
  {
    id: 'passage-2',
    title: 'The Hidden Life of Urban Trees',
    content: `A

Walk down almost any city street and you will pass them without a second glance: the trees planted along pavements, in squares and in parks. For most of the twentieth century, urban trees were treated as decoration, chosen for their appearance and little else. Today, however, researchers and city planners increasingly regard them as essential infrastructure — as important to a healthy city as its roads, pipes and power lines.

B

One of the most valuable services trees provide is cooling. On a hot day, the air beneath a mature tree can be several degrees cooler than the air above nearby concrete. Trees achieve this in two ways: their canopies cast shade, and they release water vapour through their leaves in a process called transpiration, which lowers the surrounding temperature much as sweating cools the human body. In dense neighbourhoods with few trees, summer temperatures can climb to dangerous levels, a problem known as the urban heat island effect.

C

Trees also clean the air. Their leaves trap microscopic particles of pollution from vehicle exhausts, and they absorb some harmful gases. The benefits are not only physical. Studies have repeatedly found that people who live on streets lined with trees report better mental health, and patients with a view of greenery from a hospital window tend to recover more quickly than those who look out onto a bare wall.

D

Less obviously, trees help to manage water. When rain falls on a city, it runs off hard surfaces and can overwhelm drains, causing floods. A tree intercepts rain on its leaves and branches, and its roots help water soak into the soil instead of rushing away. Some cities have calculated that their trees save millions in flood-control costs each year, and that houses on tree-lined streets sell for noticeably higher prices.

E

Yet life in a city is hard for a tree. Its roots are often squeezed into a small pit beneath the pavement, starved of water and air. Salt used to melt winter ice damages the soil, and passing vehicles pollute the air and physically wound trunks. As a result, a street tree in a busy centre may live only a fraction of the lifespan it would reach in a forest. Planting a tree is therefore only the beginning; keeping it alive demands continuing care.

F

Recognising all this, a growing number of cities have set ambitious targets to expand their tree cover. The most successful schemes share a common feature: they treat trees as long-term assets to be maintained and measured, not as ornaments to be planted and forgotten. Some now give each tree a digital record, tracking its size, health and the value of the services it provides, so that the urban forest can be managed as carefully as any other public asset.`,
    type: 'academic',
    difficulty: 'medium',
    wordCount: 460,
    topic: 'Urban Environment',
    source: 'Academic Reading Practice',
  },
  {
    id: 'passage-3',
    title: 'How Children Learn Language',
    content: `A

Every normally developing child learns to speak, and does so with remarkable speed. By the age of five, and without any formal teaching, most children command thousands of words and an intricate system of grammar. How they achieve this so quickly, from the limited and often messy speech they hear around them, is one of the great puzzles of human development, and it has divided scholars for decades.

B

One early and influential answer came from the behaviourist B. F. Skinner. He argued that children learn language in the same way they learn any other behaviour: through imitation and reinforcement. A child who copies a word correctly is rewarded with attention or with the object it names, and so repeats the behaviour. On this view, the mind of a newborn is essentially a blank slate, and language is built up gradually from experience.

C

This explanation was challenged in the late 1950s by the linguist Noam Chomsky. He pointed out that children constantly produce sentences they have never heard before, and that they make systematic errors — such as saying "goed" instead of "went" — which they could not have copied from adults. Chomsky concluded that the human brain must come equipped with an innate capacity for language, a kind of built-in template that he called Universal Grammar. For Chomsky, children do not so much learn grammar as grow it, guided by a programme present from birth.

D

Several observations are often cited in support of an inborn ability. Children pass through the same broad stages in the same order, whatever language they are learning. They acquire complex rules effortlessly, at an age when they still struggle with far simpler tasks. And there appears to be a critical period: children who are not exposed to any language in their first years find it extremely difficult, perhaps impossible, to achieve full fluency later.

E

More recently, the psychologist Michael Tomasello has offered a different emphasis. He does not deny that humans are specially prepared for language, but he argues that the key lies in social interaction rather than in a grammar template. From their first months, infants share attention with adults — following another person's gaze, or pointing at objects together — and it is through these shared social moments, Tomasello claims, that meaning is first established. Language, on this account, grows out of the human drive to cooperate and communicate.

F

Most researchers today reject the stark choice between "nature" and "nurture". The modern consensus is that children are born with powerful learning abilities that are not necessarily specific to language, and that these interact with a rich social environment. Few scientists now defend Skinner's claim that imitation alone is enough, but few accept every detail of Chomsky's template either. The debate has shifted from whether biology matters to exactly how biology and experience work together.

G

This research is not merely academic. It shapes how we treat children who are slow to talk, how second languages are taught, and how much we worry about the speech that surrounds infants. If shared attention matters as much as Tomasello suggests, then talking and reading to very young children, and responding warmly to their attempts to communicate, may be among the most useful things a caregiver can do.`,
    type: 'academic',
    difficulty: 'medium',
    wordCount: 540,
    topic: 'Language Development',
    source: 'Academic Reading Practice',
  },
];

// ---------------------------------------------------------------------------
// Questions (1–40)
// ---------------------------------------------------------------------------

const HEADING_OPTIONS = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'];
const TFNG_OPTIONS = ['TRUE', 'FALSE', 'NOT GIVEN'];
const YNNG_OPTIONS = ['YES', 'NO', 'NOT GIVEN'];
const PARA_AF = ['A', 'B', 'C', 'D', 'E', 'F'];

const questions: Question[] = [
  // ---- Passage 1, Q1–5: Matching Headings -------------------------------
  {
    id: 'q1', passageId: 'passage-1', type: 'matching-headings', questionNumber: 1,
    groupId: 'p1-headings', groupInstruction: P1_HEADINGS_INSTR, groupContent: P1_HEADINGS_BANK,
    instruction: 'Choose the correct heading for Paragraph A.', question: 'Paragraph A',
    options: HEADING_OPTIONS, correctAnswer: 'iii', points: 1,
    explanation: 'Paragraph A defines bioluminescence and describes where it occurs (land vs. ocean).',
  },
  {
    id: 'q2', passageId: 'passage-1', type: 'matching-headings', questionNumber: 2,
    groupId: 'p1-headings', groupInstruction: P1_HEADINGS_INSTR, groupContent: P1_HEADINGS_BANK,
    instruction: 'Choose the correct heading for Paragraph B.', question: 'Paragraph B',
    options: HEADING_OPTIONS, correctAnswer: 'i', points: 1,
    explanation: 'Paragraph B explains the chemical reaction (luciferin + luciferase) that produces light.',
  },
  {
    id: 'q3', passageId: 'passage-1', type: 'matching-headings', questionNumber: 3,
    groupId: 'p1-headings', groupInstruction: P1_HEADINGS_INSTR, groupContent: P1_HEADINGS_BANK,
    instruction: 'Choose the correct heading for Paragraph C.', question: 'Paragraph C',
    options: HEADING_OPTIONS, correctAnswer: 'iv', points: 1,
    explanation: 'Paragraph C describes fireflies using flashes to find a mate.',
  },
  {
    id: 'q4', passageId: 'passage-1', type: 'matching-headings', questionNumber: 4,
    groupId: 'p1-headings', groupInstruction: P1_HEADINGS_INSTR, groupContent: P1_HEADINGS_BANK,
    instruction: 'Choose the correct heading for Paragraph D.', question: 'Paragraph D',
    options: HEADING_OPTIONS, correctAnswer: 'vii', points: 1,
    explanation: 'Paragraph D describes predators such as the anglerfish using light as bait to attract prey.',
  },
  {
    id: 'q5', passageId: 'passage-1', type: 'matching-headings', questionNumber: 5,
    groupId: 'p1-headings', groupInstruction: P1_HEADINGS_INSTR, groupContent: P1_HEADINGS_BANK,
    instruction: 'Choose the correct heading for Paragraph E.', question: 'Paragraph E',
    options: HEADING_OPTIONS, correctAnswer: 'ii', points: 1,
    explanation: 'Paragraph E describes squid and counter-illumination — using light for defence.',
  },

  // ---- Passage 1, Q6–9: True / False / Not Given ------------------------
  {
    id: 'q6', passageId: 'passage-1', type: 'true-false-not-given', questionNumber: 6,
    groupId: 'p1-tfng', groupInstruction: P1_TFNG_INSTR,
    instruction: 'Write TRUE, FALSE or NOT GIVEN.',
    question: 'Bioluminescence is more common in land animals than in sea animals.',
    options: TFNG_OPTIONS, correctAnswer: 'FALSE', points: 1,
    explanation: 'Paragraph A states the ability is "comparatively rare" on land but the rule in the deep ocean — the opposite of the statement.',
  },
  {
    id: 'q7', passageId: 'passage-1', type: 'true-false-not-given', questionNumber: 7,
    groupId: 'p1-tfng', groupInstruction: P1_TFNG_INSTR,
    instruction: 'Write TRUE, FALSE or NOT GIVEN.',
    question: 'A female firefly will respond to the flashing pattern of any firefly species.',
    options: TFNG_OPTIONS, correctAnswer: 'FALSE', points: 1,
    explanation: 'Paragraph C says a female responds "only to the correct sequence" of her own species.',
  },
  {
    id: 'q8', passageId: 'passage-1', type: 'true-false-not-given', questionNumber: 8,
    groupId: 'p1-tfng', groupInstruction: P1_TFNG_INSTR,
    instruction: 'Write TRUE, FALSE or NOT GIVEN.',
    question: "The anglerfish's lure is brighter than that of any other deep-sea fish.",
    options: TFNG_OPTIONS, correctAnswer: 'NOT GIVEN', points: 1,
    explanation: 'The passage describes the anglerfish lure but never compares its brightness with other fish.',
  },
  {
    id: 'q9', passageId: 'passage-1', type: 'true-false-not-given', questionNumber: 9,
    groupId: 'p1-tfng', groupInstruction: P1_TFNG_INSTR,
    instruction: 'Write TRUE, FALSE or NOT GIVEN.',
    question: 'Light-producing genes have been put into other organisms for research purposes.',
    options: TFNG_OPTIONS, correctAnswer: 'TRUE', points: 1,
    explanation: 'Paragraph F states the genes "have been transferred into other organisms so that researchers can watch processes".',
  },

  // ---- Passage 1, Q10–13: Summary Completion ----------------------------
  {
    id: 'q10', passageId: 'passage-1', type: 'summary-completion', questionNumber: 10,
    groupId: 'p1-summary', groupInstruction: P1_SUMMARY_INSTR, groupContent: P1_SUMMARY_TEXT,
    instruction: 'Write your answer for gap 10 (NO MORE THAN TWO WORDS).', question: 'Gap 10',
    correctAnswer: 'luciferin', wordLimit: 2, points: 1,
    explanation: 'Paragraph B: light involves "a light-emitting molecule called luciferin".',
  },
  {
    id: 'q11', passageId: 'passage-1', type: 'summary-completion', questionNumber: 11,
    groupId: 'p1-summary', groupInstruction: P1_SUMMARY_INSTR, groupContent: P1_SUMMARY_TEXT,
    instruction: 'Write your answer for gap 11 (NO MORE THAN TWO WORDS).', question: 'Gap 11',
    correctAnswer: 'luciferase', wordLimit: 2, points: 1,
    explanation: 'Paragraph B: the reaction is "controlled by luciferase".',
  },
  {
    id: 'q12', passageId: 'passage-1', type: 'summary-completion', questionNumber: 12,
    groupId: 'p1-summary', groupInstruction: P1_SUMMARY_INSTR, groupContent: P1_SUMMARY_TEXT,
    instruction: 'Write your answer for gap 12 (NO MORE THAN TWO WORDS).', question: 'Gap 12',
    correctAnswer: 'heat', wordLimit: 2, points: 1,
    explanation: 'Paragraph B: "almost none of this energy escapes as heat", hence "cold light".',
  },
  {
    id: 'q13', passageId: 'passage-1', type: 'summary-completion', questionNumber: 13,
    groupId: 'p1-summary', groupInstruction: P1_SUMMARY_INSTR, groupContent: P1_SUMMARY_TEXT,
    instruction: 'Write your answer for gap 13 (NO MORE THAN TWO WORDS).', question: 'Gap 13',
    correctAnswer: 'blue', wordLimit: 2, points: 1,
    explanation: 'Paragraph A: "Most of this ocean light is blue, the colour that travels furthest through seawater."',
  },

  // ---- Passage 2, Q14–18: Multiple Choice -------------------------------
  {
    id: 'q14', passageId: 'passage-2', type: 'multiple-choice', questionNumber: 14,
    groupId: 'p2-mc', groupInstruction: P2_MC_INSTR,
    instruction: 'Choose the correct letter, A, B, C or D.',
    question: 'For most of the twentieth century, urban trees were valued mainly for their',
    options: ['ability to cool streets', 'appearance', 'economic value', 'effect on public health'],
    correctAnswer: 'appearance', points: 1,
    explanation: 'Paragraph A: trees "were treated as decoration, chosen for their appearance and little else".',
  },
  {
    id: 'q15', passageId: 'passage-2', type: 'multiple-choice', questionNumber: 15,
    groupId: 'p2-mc', groupInstruction: P2_MC_INSTR,
    instruction: 'Choose the correct letter, A, B, C or D.',
    question: 'According to the passage, transpiration cools the air by',
    options: ['providing shade', 'trapping particles of pollution', 'releasing water vapour from leaves', 'absorbing harmful gases'],
    correctAnswer: 'releasing water vapour from leaves', points: 1,
    explanation: 'Paragraph B: trees "release water vapour through their leaves in a process called transpiration, which lowers the surrounding temperature".',
  },
  {
    id: 'q16', passageId: 'passage-2', type: 'multiple-choice', questionNumber: 16,
    groupId: 'p2-mc', groupInstruction: P2_MC_INSTR,
    instruction: 'Choose the correct letter, A, B, C or D.',
    question: 'What does the passage say about hospital patients?',
    options: [
      'They prefer rooms with large windows.',
      'They recover faster with a view of greenery.',
      'They report better mental health than other people.',
      'They are less affected by air pollution.',
    ],
    correctAnswer: 'They recover faster with a view of greenery.', points: 1,
    explanation: 'Paragraph C: patients "with a view of greenery from a hospital window tend to recover more quickly".',
  },
  {
    id: 'q17', passageId: 'passage-2', type: 'multiple-choice', questionNumber: 17,
    groupId: 'p2-mc', groupInstruction: P2_MC_INSTR,
    instruction: 'Choose the correct letter, A, B, C or D.',
    question: 'How do trees help to reduce flooding?',
    options: [
      'by storing large amounts of water in their trunks',
      'by intercepting rain and helping water soak into the soil',
      'by lowering the temperature of the rain',
      'by directing water into the city drains',
    ],
    correctAnswer: 'by intercepting rain and helping water soak into the soil', points: 1,
    explanation: 'Paragraph D: "A tree intercepts rain on its leaves and branches, and its roots help water soak into the soil".',
  },
  {
    id: 'q18', passageId: 'passage-2', type: 'multiple-choice', questionNumber: 18,
    groupId: 'p2-mc', groupInstruction: P2_MC_INSTR,
    instruction: 'Choose the correct letter, A, B, C or D.',
    question: 'Why do street trees in busy centres often have short lives?',
    options: [
      'They are usually the wrong species for cities.',
      'They are planted too close together.',
      'Their roots lack water and air, and they are damaged by salt and traffic.',
      'They are not given a digital record.',
    ],
    correctAnswer: 'Their roots lack water and air, and they are damaged by salt and traffic.', points: 1,
    explanation: 'Paragraph E describes cramped roots starved of water and air, plus damage from road salt and vehicles.',
  },

  // ---- Passage 2, Q19–22: Matching Information --------------------------
  {
    id: 'q19', passageId: 'passage-2', type: 'matching-information', questionNumber: 19,
    groupId: 'p2-info', groupInstruction: P2_INFO_INSTR,
    instruction: 'Write the correct letter, A–F.',
    question: 'a comparison between a tree and a function of the human body',
    options: PARA_AF, correctAnswer: 'B', points: 1,
    explanation: 'Paragraph B compares transpiration to "sweating" cooling the human body.',
  },
  {
    id: 'q20', passageId: 'passage-2', type: 'matching-information', questionNumber: 20,
    groupId: 'p2-info', groupInstruction: P2_INFO_INSTR,
    instruction: 'Write the correct letter, A–F.',
    question: 'a claim that greenery can speed up recovery from illness',
    options: PARA_AF, correctAnswer: 'C', points: 1,
    explanation: 'Paragraph C reports patients with a view of greenery recover more quickly.',
  },
  {
    id: 'q21', passageId: 'passage-2', type: 'matching-information', questionNumber: 21,
    groupId: 'p2-info', groupInstruction: P2_INFO_INSTR,
    instruction: 'Write the correct letter, A–F.',
    question: 'the effect of trees on the price of houses',
    options: PARA_AF, correctAnswer: 'D', points: 1,
    explanation: 'Paragraph D: houses on tree-lined streets "sell for noticeably higher prices".',
  },
  {
    id: 'q22', passageId: 'passage-2', type: 'matching-information', questionNumber: 22,
    groupId: 'p2-info', groupInstruction: P2_INFO_INSTR,
    instruction: 'Write the correct letter, A–F.',
    question: 'examples of the ways in which a city damages its trees',
    options: PARA_AF, correctAnswer: 'E', points: 1,
    explanation: 'Paragraph E lists cramped roots, road salt and damage from vehicles.',
  },

  // ---- Passage 2, Q23–26: Short Answer ----------------------------------
  {
    id: 'q23', passageId: 'passage-2', type: 'short-answer', questionNumber: 23,
    groupId: 'p2-short', groupInstruction: P2_SHORT_INSTR,
    instruction: 'Answer using NO MORE THAN THREE WORDS.',
    question: 'What do trees release through their leaves to help cool the air?',
    correctAnswer: 'water vapour', acceptableAnswers: ['water vapor'], wordLimit: 3, points: 1,
    explanation: 'Paragraph B: trees "release water vapour through their leaves".',
  },
  {
    id: 'q24', passageId: 'passage-2', type: 'short-answer', questionNumber: 24,
    groupId: 'p2-short', groupInstruction: P2_SHORT_INSTR,
    instruction: 'Answer using NO MORE THAN THREE WORDS.',
    question: 'What do the leaves of trees trap to help clean the air?',
    correctAnswer: 'particles of pollution', acceptableAnswers: ['pollution particles', 'microscopic particles'], wordLimit: 3, points: 1,
    explanation: 'Paragraph C: leaves "trap microscopic particles of pollution from vehicle exhausts".',
  },
  {
    id: 'q25', passageId: 'passage-2', type: 'short-answer', questionNumber: 25,
    groupId: 'p2-short', groupInstruction: P2_SHORT_INSTR,
    instruction: 'Answer using NO MORE THAN THREE WORDS.',
    question: 'What is spread to melt winter ice but then harms the soil?',
    correctAnswer: 'salt', wordLimit: 3, points: 1,
    explanation: 'Paragraph E: "Salt used to melt winter ice damages the soil".',
  },
  {
    id: 'q26', passageId: 'passage-2', type: 'short-answer', questionNumber: 26,
    groupId: 'p2-short', groupInstruction: P2_SHORT_INSTR,
    instruction: 'Answer using NO MORE THAN THREE WORDS.',
    question: 'What is given to each tree so that its size and health can be tracked?',
    correctAnswer: 'a digital record', acceptableAnswers: ['digital record'], wordLimit: 3, points: 1,
    explanation: 'Paragraph F: cities "give each tree a digital record, tracking its size, health".',
  },

  // ---- Passage 3, Q27–31: Yes / No / Not Given --------------------------
  {
    id: 'q27', passageId: 'passage-3', type: 'yes-no-not-given', questionNumber: 27,
    groupId: 'p3-ynng', groupInstruction: P3_YNNG_INSTR,
    instruction: 'Write YES, NO or NOT GIVEN.',
    question: 'Children learn to speak without being formally taught.',
    options: YNNG_OPTIONS, correctAnswer: 'YES', points: 1,
    explanation: 'Paragraph A: children learn to speak "without any formal teaching".',
  },
  {
    id: 'q28', passageId: 'passage-3', type: 'yes-no-not-given', questionNumber: 28,
    groupId: 'p3-ynng', groupInstruction: P3_YNNG_INSTR,
    instruction: 'Write YES, NO or NOT GIVEN.',
    question: "Skinner's explanation is accepted by most researchers today.",
    options: YNNG_OPTIONS, correctAnswer: 'NO', points: 1,
    explanation: 'Paragraph F: "Few scientists now defend Skinner\'s claim that imitation alone is enough."',
  },
  {
    id: 'q29', passageId: 'passage-3', type: 'yes-no-not-given', questionNumber: 29,
    groupId: 'p3-ynng', groupInstruction: P3_YNNG_INSTR,
    instruction: 'Write YES, NO or NOT GIVEN.',
    question: "Chomsky's theory is more convincing than Tomasello's.",
    options: YNNG_OPTIONS, correctAnswer: 'NOT GIVEN', points: 1,
    explanation: 'The writer presents both views but never ranks one as more convincing than the other.',
  },
  {
    id: 'q30', passageId: 'passage-3', type: 'yes-no-not-given', questionNumber: 30,
    groupId: 'p3-ynng', groupInstruction: P3_YNNG_INSTR,
    instruction: 'Write YES, NO or NOT GIVEN.',
    question: 'The order of language stages changes depending on the language being learned.',
    options: YNNG_OPTIONS, correctAnswer: 'NO', points: 1,
    explanation: 'Paragraph D: children pass through the same stages "in the same order, whatever language they are learning".',
  },
  {
    id: 'q31', passageId: 'passage-3', type: 'yes-no-not-given', questionNumber: 31,
    groupId: 'p3-ynng', groupInstruction: P3_YNNG_INSTR,
    instruction: 'Write YES, NO or NOT GIVEN.',
    question: 'Research into language learning has useful practical applications.',
    options: YNNG_OPTIONS, correctAnswer: 'YES', points: 1,
    explanation: 'Paragraph G: "This research is not merely academic," and shapes how children are treated and languages taught.',
  },

  // ---- Passage 3, Q32–35: Matching Features -----------------------------
  {
    id: 'q32', passageId: 'passage-3', type: 'matching-features', questionNumber: 32,
    groupId: 'p3-features', groupInstruction: P3_FEATURES_INSTR, groupContent: P3_FEATURES_BANK,
    instruction: 'Write the correct letter, A, B or C.',
    question: 'The brain contains a built-in template specifically for grammar.',
    options: ['A', 'B', 'C'], correctAnswer: 'B', points: 1,
    explanation: 'Paragraph C: Chomsky proposed an innate "Universal Grammar" template.',
  },
  {
    id: 'q33', passageId: 'passage-3', type: 'matching-features', questionNumber: 33,
    groupId: 'p3-features', groupInstruction: P3_FEATURES_INSTR, groupContent: P3_FEATURES_BANK,
    instruction: 'Write the correct letter, A, B or C.',
    question: 'Language develops out of shared attention between infants and adults.',
    options: ['A', 'B', 'C'], correctAnswer: 'C', points: 1,
    explanation: 'Paragraph E: Tomasello emphasises social interaction and shared attention.',
  },
  {
    id: 'q34', passageId: 'passage-3', type: 'matching-features', questionNumber: 34,
    groupId: 'p3-features', groupInstruction: P3_FEATURES_INSTR, groupContent: P3_FEATURES_BANK,
    instruction: 'Write the correct letter, A, B or C.',
    question: 'Children learn language through imitation and reward.',
    options: ['A', 'B', 'C'], correctAnswer: 'A', points: 1,
    explanation: 'Paragraph B: Skinner argued language is learned "through imitation and reinforcement".',
  },
  {
    id: 'q35', passageId: 'passage-3', type: 'matching-features', questionNumber: 35,
    groupId: 'p3-features', groupInstruction: P3_FEATURES_INSTR, groupContent: P3_FEATURES_BANK,
    instruction: 'Write the correct letter, A, B or C.',
    question: "Errors such as 'goed' show that children are not simply copying adults.",
    options: ['A', 'B', 'C'], correctAnswer: 'B', points: 1,
    explanation: 'Paragraph C: Chomsky cited systematic errors like "goed" that could not be copied from adults.',
  },

  // ---- Passage 3, Q36–40: Note Completion -------------------------------
  {
    id: 'q36', passageId: 'passage-3', type: 'table-completion', questionNumber: 36,
    groupId: 'p3-notes', groupInstruction: P3_NOTES_INSTR, groupContent: P3_NOTES_TEXT,
    instruction: 'Write your answer for gap 36 (ONE WORD ONLY).', question: 'Gap 36',
    correctAnswer: 'reinforcement', wordLimit: 1, points: 1,
    explanation: 'Paragraph B: Skinner — "through imitation and reinforcement".',
  },
  {
    id: 'q37', passageId: 'passage-3', type: 'table-completion', questionNumber: 37,
    groupId: 'p3-notes', groupInstruction: P3_NOTES_INSTR, groupContent: P3_NOTES_TEXT,
    instruction: 'Write your answer for gap 37 (ONE WORD ONLY).', question: 'Gap 37',
    correctAnswer: 'slate', wordLimit: 1, points: 1,
    explanation: 'Paragraph B: the newborn mind is "a blank slate".',
  },
  {
    id: 'q38', passageId: 'passage-3', type: 'table-completion', questionNumber: 38,
    groupId: 'p3-notes', groupInstruction: P3_NOTES_INSTR, groupContent: P3_NOTES_TEXT,
    instruction: 'Write your answer for gap 38 (ONE WORD ONLY).', question: 'Gap 38',
    correctAnswer: 'Grammar', acceptableAnswers: ['grammar'], wordLimit: 1, points: 1,
    explanation: 'Paragraph C: Chomsky called the template "Universal Grammar".',
  },
  {
    id: 'q39', passageId: 'passage-3', type: 'table-completion', questionNumber: 39,
    groupId: 'p3-notes', groupInstruction: P3_NOTES_INSTR, groupContent: P3_NOTES_TEXT,
    instruction: 'Write your answer for gap 39 (ONE WORD ONLY).', question: 'Gap 39',
    correctAnswer: 'interaction', wordLimit: 1, points: 1,
    explanation: 'Paragraph E: Tomasello stresses "social interaction".',
  },
  {
    id: 'q40', passageId: 'passage-3', type: 'table-completion', questionNumber: 40,
    groupId: 'p3-notes', groupInstruction: P3_NOTES_INSTR, groupContent: P3_NOTES_TEXT,
    instruction: 'Write your answer for gap 40 (ONE WORD ONLY).', question: 'Gap 40',
    correctAnswer: 'environment', wordLimit: 1, points: 1,
    explanation: 'Paragraph F: learning abilities "interact with a rich social environment".',
  },
];

export const mockTestData = { passages, questions };
