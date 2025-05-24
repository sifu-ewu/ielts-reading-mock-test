import { BAND_SCORE_MAPPING } from '../types/ielts.ts';

export function calculateBandScore(correctAnswers: number, testType: 'academic' | 'general'): number {
  const mapping = BAND_SCORE_MAPPING[testType];
  
  // Find the closest score in the mapping
  let bandScore = 0;
  for (const [scoreStr, band] of Object.entries(mapping)) {
    const score = parseInt(scoreStr);
    if (correctAnswers >= score) {
      bandScore = band;
      break;
    }
  }
  
  // If score is higher than maximum, return 9.0
  if (correctAnswers >= 39 && testType === 'academic') return 9.0;
  if (correctAnswers >= 40 && testType === 'general') return 9.0;
  
  // If score is lower than minimum, calculate proportionally
  if (bandScore === 0) {
    const scores = Object.keys(mapping).map(Number);
    const minScore = Math.min(...scores);
    const minBand = mapping[minScore as keyof typeof mapping];
    return Math.max(1.0, (correctAnswers / minScore) * minBand);
  }
  
  return bandScore;
}

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
  return Math.round((correctAnswers / totalQuestions) * 100);
}

export function getBandDescription(bandScore: number): string {
  if (bandScore >= 9.0) return "Expert User";
  if (bandScore >= 8.5) return "Very Good User";
  if (bandScore >= 8.0) return "Very Good User";
  if (bandScore >= 7.5) return "Good User";
  if (bandScore >= 7.0) return "Good User";
  if (bandScore >= 6.5) return "Competent User";
  if (bandScore >= 6.0) return "Competent User";
  if (bandScore >= 5.5) return "Modest User";
  if (bandScore >= 5.0) return "Modest User";
  if (bandScore >= 4.5) return "Limited User";
  if (bandScore >= 4.0) return "Limited User";
  if (bandScore >= 3.5) return "Extremely Limited User";
  if (bandScore >= 3.0) return "Extremely Limited User";
  return "Intermittent User";
}

export function getDetailedBandDescription(bandScore: number): string {
  if (bandScore >= 9.0) {
    return "Has fully operational command of the language: appropriate, accurate and fluent with complete understanding.";
  }
  if (bandScore >= 8.0) {
    return "Has fully operational command of the language with only occasional unsystematic inaccuracies and inappropriacies. Misunderstandings may occur in unfamiliar situations.";
  }
  if (bandScore >= 7.0) {
    return "Has operational command of the language, though with occasional inaccuracies, inappropriacies and misunderstandings in some situations. Generally handles complex language well and understands detailed reasoning.";
  }
  if (bandScore >= 6.0) {
    return "Has generally effective command of the language despite some inaccuracies, inappropriacies and misunderstandings. Can use and understand fairly complex language, particularly in familiar situations.";
  }
  if (bandScore >= 5.0) {
    return "Has partial command of the language, coping with overall meaning in most situations, though is likely to make many mistakes. Should be able to handle basic communication in own field.";
  }
  if (bandScore >= 4.0) {
    return "Basic competence is limited to familiar situations. Has frequent problems in understanding and expression. Is not able to use complex language.";
  }
  return "Conveys and understands only general meaning in very familiar situations. Frequent breakdowns in communication occur.";
}
