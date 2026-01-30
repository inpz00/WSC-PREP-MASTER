/**
 * WSC Scholar's Challenge — Theme: "Are We There Yet?" (2026)
 * Loads questions from public/questions.json and provides filtering/scoring.
 */

export const SUBJECTS = [
  'Science & Technology',
  'History',
  'Social Studies',
  'Art & Music',
  'Literature & Media',
  'Special Area',
];

export const DIFFICULTIES = [1, 2, 3, 4, 5];

export const DIVISIONS = [
  { id: 'Skittles', label: 'Skittles', ages: 'Ages 8–11', description: 'Simpler words, direct facts from the curriculum' },
  { id: 'Junior', label: 'Junior', ages: 'Ages 12–14', description: 'Standard difficulty, connections between topics' },
  { id: 'Senior', label: 'Senior', ages: 'Ages 15+', description: 'Advanced vocabulary, philosophical and complex debates' },
];

/** Normalize a question from JSON (snake_case) to app format (camelCase). */
export function normalizeQuestion(raw) {
  return {
    id: raw.id,
    subject: raw.subject,
    division: raw.division,
    difficulty: raw.difficulty,
    question: raw.question,
    options: raw.options || {},
    correctAnswer: raw.correct_answer ?? raw.correctAnswer,
    explanation: raw.explanation,
    studyMoreUrl: raw.resource_link ?? raw.studyMoreUrl,
  };
}

/** Fetch all questions from JSON and normalize. */
export async function fetchQuestions() {
  const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
  // In development, avoid serving cached questions.json so content updates are visible
  const cacheBust = import.meta.env.DEV ? `?t=${Date.now()}` : '';
  const res = await fetch(`${base}/questions.json${cacheBust}`);
  if (!res.ok) throw new Error('Failed to load questions');
  const raw = await res.json();
  return Array.isArray(raw) ? raw.map(normalizeQuestion) : [];
}

/**
 * WSC Multiple Mark rule (strict):
 * - 1 choice (correct): 1.0 pt
 * - 2 choices (inc. correct): 0.5 pt
 * - 3 choices (inc. correct): 0.33 pt
 * - 4 choices (inc. correct): 0.25 pt
 * - Incorrect or not selected: 0 pt
 */
export function scoreAnswer(selectedKeys, correctKey) {
  if (!selectedKeys || selectedKeys.length === 0) return 0;
  const hasCorrect = selectedKeys.includes(correctKey);
  if (!hasCorrect) return 0;
  const n = selectedKeys.length;
  if (n === 1) return 1.0;
  if (n === 2) return 0.5;
  if (n === 3) return Math.round((1 / 3) * 100) / 100; // 0.33
  if (n === 4) return 0.25;
  return 0;
}

/**
 * Filter questions by division, subject, and/or difficulty.
 * byDifficulty 'all' = do not filter by difficulty.
 */
export function filterQuestions(questions, { byDivision, bySubject, byDifficulty, fullMock }) {
  let result = questions;
  if (byDivision !== undefined) {
    result = result.filter((q) => q.division === byDivision);
  }
  if (fullMock) return result;
  if (bySubject !== undefined) {
    result = result.filter((q) => q.subject === bySubject);
  }
  if (byDifficulty !== undefined && byDifficulty !== 'all') {
    result = result.filter((q) => q.difficulty === byDifficulty);
  }
  return result;
}

/** Fisher–Yates shuffle (in place). */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Get a quiz set: random order, no duplicates.
 * If pool has fewer than count questions, returns all of them (no repeating).
 */
export function getQuizSet(questions, count) {
  if (!questions.length) return [];
  const shuffled = shuffleArray(questions);
  const take = Math.min(count, shuffled.length);
  return shuffled.slice(0, take);
}

/**
 * Get a quiz set balanced across difficulties 1–5: takes roughly equal numbers
 * from each level, then shuffles. If a level has fewer than perLevel, fills
 * from the rest. No duplicates.
 */
export function getQuizSetBalancedByDifficulty(questions, count) {
  if (!questions.length) return [];
  const levels = [1, 2, 3, 4, 5];
  const byDiff = {};
  levels.forEach((l) => {
    byDiff[l] = questions.filter((q) => q.difficulty === l);
  });
  const perLevel = Math.ceil(count / 5);
  const selected = [];
  const selectedIds = new Set();
  levels.forEach((l) => {
    const shuffled = shuffleArray(byDiff[l]);
    const take = shuffled.slice(0, perLevel);
    take.forEach((q) => {
      selected.push(q);
      selectedIds.add(q.id);
    });
  });
  let result = shuffleArray(selected);
  if (result.length >= count) return result.slice(0, count);
  const rest = questions.filter((q) => !selectedIds.has(q.id));
  const more = shuffleArray(rest).slice(0, count - result.length);
  return shuffleArray(result.concat(more));
}
