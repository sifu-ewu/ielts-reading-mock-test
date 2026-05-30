import type {
  Question,
  TestSession,
  TestResult,
  UserAnswer,
  TestFeedback,
} from '../types/ielts';

// --- Answer checking -------------------------------------------------------

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function checkAnswer(
  question: Question,
  userAnswer: string | string[] | undefined,
): boolean {
  if (userAnswer === undefined) return false;
  const correct = question.correctAnswer;

  if (Array.isArray(correct)) {
    if (!Array.isArray(userAnswer)) return false;
    if (correct.length !== userAnswer.length) return false;
    const a = correct.map(normalizeAnswer).sort();
    const b = userAnswer.map(normalizeAnswer).sort();
    return a.every((v, i) => v === b[i]);
  }

  if (Array.isArray(userAnswer)) return false;
  if (userAnswer.trim() === '') return false;
  const accepted = [correct, ...(question.acceptableAnswers ?? [])].map(normalizeAnswer);
  return accepted.includes(normalizeAnswer(userAnswer));
}

// --- Band score ------------------------------------------------------------

// Descending [rawScore threshold, band]. The first threshold a score meets wins.
const ACADEMIC_BANDS: [number, number][] = [
  [39, 9.0], [37, 8.5], [35, 8.0], [33, 7.5], [30, 7.0], [27, 6.5],
  [23, 6.0], [19, 5.5], [15, 5.0], [13, 4.5], [10, 4.0], [8, 3.5],
  [6, 3.0], [4, 2.5], [3, 2.0], [1, 1.0], [0, 0.0],
];

const GENERAL_BANDS: [number, number][] = [
  [40, 9.0], [39, 8.5], [38, 8.0], [36, 7.5], [34, 7.0], [32, 6.5],
  [30, 6.0], [27, 5.5], [23, 5.0], [19, 4.5], [15, 4.0], [12, 3.5],
  [9, 3.0], [6, 2.5], [4, 2.0], [1, 1.0], [0, 0.0],
];

export function calculateBandScore(
  correctAnswers: number,
  testType: 'academic' | 'general' = 'academic',
): number {
  const c = Math.max(0, Math.min(40, Math.round(correctAnswers)));
  const table = testType === 'general' ? GENERAL_BANDS : ACADEMIC_BANDS;
  for (const [threshold, band] of table) {
    if (c >= threshold) return band;
  }
  return 0;
}

// --- Result assembly -------------------------------------------------------

export function buildTestResult(session: TestSession): TestResult {
  const userAnswers: UserAnswer[] = session.questions.map((question) => ({
    questionId: question.id,
    answer: session.answers[question.id] ?? '',
    timeSpent: 0,
    isCorrect: checkAnswer(question, session.answers[question.id]),
  }));

  const correctAnswers = userAnswers.filter((a) => a.isCorrect).length;
  const testType = session.passages[0]?.type ?? 'academic';
  const bandScore = calculateBandScore(correctAnswers, testType);
  const completedAt = session.endTime ?? new Date();
  const timeSpent = Math.max(
    0,
    Math.round((completedAt.getTime() - session.startTime.getTime()) / 60000),
  );

  return {
    sessionId: session.id,
    totalQuestions: session.questions.length,
    correctAnswers,
    score: correctAnswers,
    bandScore,
    timeSpent,
    answers: userAnswers,
    completedAt,
    feedback: buildFeedback(userAnswers, session.questions, bandScore),
  };
}

export function buildFeedback(
  answers: UserAnswer[],
  questions: Question[],
  bandScore: number,
): TestFeedback {
  const total = answers.length || 1;
  const correct = answers.filter((a) => a.isCorrect).length;
  const accuracy = correct / total;

  const strengths: string[] = [];
  if (accuracy >= 0.8) strengths.push('Excellent overall comprehension');
  if (accuracy >= 0.7) strengths.push('Strong reading skills');
  if (accuracy >= 0.6) strengths.push('Good understanding of main ideas');

  const weaknesses: string[] = [];
  if (accuracy < 0.7) weaknesses.push('Could benefit from more vocabulary practice');
  if (accuracy < 0.6) weaknesses.push('Work on identifying specific detail');
  if (accuracy < 0.5) weaknesses.push('Difficulty with overall comprehension');

  const recommendations: string[] = [];
  if (bandScore < 6.0) {
    recommendations.push('Focus on building vocabulary');
    recommendations.push('Practice skimming and scanning techniques');
  } else if (bandScore < 7.0) {
    recommendations.push("Work on identifying the writer's opinion and attitude");
    recommendations.push('Practice inference questions');
  } else {
    recommendations.push('Focus on the hardest question types');
    recommendations.push('Practice under strict time pressure');
  }

  const detailedResults: TestFeedback['detailedResults'] = {};
  for (const question of questions) {
    const a = answers.find((x) => x.questionId === question.id);
    const answered =
      !!a && a.answer !== '' && !(Array.isArray(a.answer) && a.answer.length === 0);
    const bucket = (detailedResults[question.type] ??= {
      attempted: 0,
      correct: 0,
      accuracy: 0,
    });
    if (answered) bucket.attempted += 1;
    if (a?.isCorrect) bucket.correct += 1;
  }
  for (const key of Object.keys(detailedResults)) {
    const b = detailedResults[key];
    b.accuracy = b.attempted > 0 ? b.correct / b.attempted : 0;
  }

  return {
    overallPerformance: getBandDescription(bandScore),
    strengths,
    weaknesses,
    recommendations,
    detailedResults,
  };
}

// --- Display helpers (unchanged behaviour) ---------------------------------

export function getScoreRequirements(testType: 'academic' | 'general') {
  return {
    band9: testType === 'academic' ? 39 : 40,
    band8: testType === 'academic' ? 36 : 38,
    band7: testType === 'academic' ? 32 : 34,
    band6: testType === 'academic' ? 28 : 30,
    band5: testType === 'academic' ? 24 : 25,
  };
}

export function calculatePercentage(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

export function getBandDescription(bandScore: number): string {
  if (bandScore >= 9.0) return 'Expert User';
  if (bandScore >= 8.0) return 'Very Good User';
  if (bandScore >= 7.0) return 'Good User';
  if (bandScore >= 6.0) return 'Competent User';
  if (bandScore >= 5.0) return 'Modest User';
  if (bandScore >= 4.0) return 'Limited User';
  if (bandScore >= 3.0) return 'Extremely Limited User';
  return 'Intermittent User';
}

export function getDetailedBandDescription(bandScore: number): string {
  if (bandScore >= 9.0) {
    return 'Has fully operational command of the language: appropriate, accurate and fluent with complete understanding.';
  }
  if (bandScore >= 8.0) {
    return 'Has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriacies. Misunderstandings may occur in unfamiliar situations.';
  }
  if (bandScore >= 7.0) {
    return 'Has operational command of the language, though with occasional inaccuracies, inappropriacies and misunderstandings in some situations. Generally handles complex language well and understands detailed reasoning.';
  }
  if (bandScore >= 6.0) {
    return 'Has generally effective command of the language despite some inaccuracies, inappropriacies and misunderstandings. Can use and understand fairly complex language, particularly in familiar situations.';
  }
  if (bandScore >= 5.0) {
    return 'Has partial command of the language, coping with overall meaning in most situations, though is likely to make many mistakes. Should be able to handle basic communication in own field.';
  }
  if (bandScore >= 4.0) {
    return 'Basic competence is limited to familiar situations. Has frequent problems in understanding and expression. Is not able to use complex language.';
  }
  return 'Conveys and understands only general meaning in very familiar situations. Frequent breakdowns in communication occur.';
}
