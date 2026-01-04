// Utility to validate padel match scores
export const validatePadelScore = (scores: string[]): boolean => {
  // Placeholder validation: ensure there are up to three sets and each score includes a hyphen
  if (scores.length === 0 || scores.length > 3) return false;
  return scores.every((s) => s.includes('-'));
};