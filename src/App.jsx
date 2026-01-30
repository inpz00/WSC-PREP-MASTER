import { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import QuizScreen from './components/QuizScreen';
import ReviewScreen from './components/ReviewScreen';
import { fetchQuestions, filterQuestions, getQuizSet, getQuizSetBalancedByDifficulty } from './data/questions';

const MODES = [
  { id: 'A', label: 'Mode A', questions: 40, minutes: 20 },
  { id: 'B', label: 'Mode B', questions: 20, minutes: 10 },
];

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [config, setConfig] = useState(null);
  const [quizState, setQuizState] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    fetchQuestions()
      .then((q) => {
        if (!cancelled) setAllQuestions(q);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Failed to load questions');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleStart = (setup) => {
    const { divisionId, modeId, focusType, subject, difficulty } = setup;
    const mode = MODES.find((m) => m.id === modeId);
    const questionCount = mode.questions;
    const timeLimitMinutes = mode.minutes;

    let filtered = filterQuestions(allQuestions, { byDivision: divisionId });
    if (filtered.length === 0) filtered = allQuestions;

    if (focusType === 'bySubject') {
      filtered = filterQuestions(filtered, { bySubject: subject, byDifficulty: difficulty });
    } else if (focusType === 'byDifficulty') {
      filtered = filterQuestions(filtered, { byDifficulty: difficulty });
    } else {
      filtered = filterQuestions(filtered, { fullMock: true });
    }
    if (filtered.length === 0) filtered = filterQuestions(allQuestions, { byDivision: divisionId });

    const questions =
      focusType === 'bySubject' && difficulty === 'all'
        ? getQuizSetBalancedByDifficulty(filtered, questionCount)
        : getQuizSet(filtered, questionCount);

    setConfig({
      timeLimitMinutes,
      questionCount: questions.length,
      divisionId,
    });
    setQuizState({
      questions,
      answers: {},
      startTime: Date.now(),
    });
    setScreen('quiz');
  };

  const handleQuizFinish = (answers, endTime) => {
    setQuizState((prev) => ({
      ...prev,
      answers,
      endTime,
    }));
    setScreen('review');
  };

  const handleBackToSetup = () => {
    setScreen('setup');
    setConfig(null);
    setQuizState(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <div className="animate-pulse text-violet-700 font-display font-semibold">Loading questions…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4">
        <p className="text-red-700 font-medium">Error: {loadError}</p>
        <p className="text-slate-600 text-sm mt-2">Make sure questions.json is available and try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-violet-700 text-white py-4 px-6 shadow-lg border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/alpaca.svg" alt="WSC Alpaca" className="h-10 w-10 flex-shrink-0" />
            <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight text-white">
              WSC Prep Master: Challenge
            </h1>
          </div>
          <span className="text-amber-300 text-sm font-medium whitespace-nowrap">Are We There Yet? (2026)</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        {screen === 'setup' && (
          <SetupScreen onStart={handleStart} modes={MODES} questionCount={allQuestions.length} />
        )}
        {screen === 'quiz' && (
          <QuizScreen
            questions={quizState.questions}
            initialAnswers={quizState.answers}
            timeLimitMinutes={config.timeLimitMinutes}
            divisionId={config.divisionId}
            onFinish={handleQuizFinish}
            onExit={handleBackToSetup}
          />
        )}
        {screen === 'review' && (
          <ReviewScreen
            questions={quizState.questions}
            answers={quizState.answers}
            startTime={quizState.startTime}
            endTime={quizState.endTime}
            onRestart={handleBackToSetup}
          />
        )}
      </main>

      <footer className="py-3 text-center text-sm text-slate-600">
        Scholar's Challenge practice — WSC theme 2026
      </footer>
    </div>
  );
}
