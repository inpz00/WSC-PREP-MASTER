import { useState, useEffect, useCallback, useRef } from 'react';

const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizScreen({
  questions,
  initialAnswers,
  timeLimitMinutes,
  divisionId,
  onFinish,
  onExit,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers || {});
  const answersRef = useRef(answers);
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);

  answersRef.current = answers;

  const question = questions[currentIndex];
  const questionKey = currentIndex; // use index so repeated questions have separate answers

  const toggleChoice = useCallback(
    (key) => {
      setAnswers((prev) => {
        const current = prev[questionKey] || [];
        const next = current.includes(key)
          ? current.filter((c) => c !== key)
          : [...current, key].sort();
        return { ...prev, [questionKey]: next };
      });
    },
    [questionKey]
  );

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onFinish(answers, Date.now());
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // Timer
  useEffect(() => {
    if (isPaused || !question) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          onFinish(answersRef.current, Date.now());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isPaused, question?.id, onFinish]);

  if (!question) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No questions in this set.</p>
        <button
          onClick={onExit}
          className="mt-4 text-violet-600 font-medium hover:underline"
        >
          Back to Setup
        </button>
      </div>
    );
  }

  const selected = answers[questionKey] || [];
  const options = question.options || {};
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const timeStr = `${m}:${s.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {divisionId && (
            <span className="text-xs px-2 py-1 rounded bg-amber-100 text-slate-800 border border-amber-300">
              {divisionId}
            </span>
          )}
          <span className="text-xs px-2 py-1 rounded bg-slate-200 text-slate-800">
            {question.subject} · L{question.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`font-mono font-semibold ${
              timeLeft <= 60 ? 'text-red-600' : 'text-slate-800'
            }`}
          >
            {timeStr}
          </span>
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="text-sm text-violet-600 hover:underline font-medium"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button"
            onClick={onExit}
            className="text-sm text-slate-600 hover:underline"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 md:p-8 text-slate-800">
        <p className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
          {question.question}
        </p>
        <p className="text-sm text-slate-600 mb-4">
          Select one or more answers (partial credit: 1 choice = 1 pt, 2 = 0.5, 3 = 0.33, 4 = 0.25).
        </p>
        <div className="space-y-3">
          {CHOICE_LABELS.filter((k) => options[k]).map((key) => (
            <label
              key={key}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition text-slate-800 ${
                selected.includes(key)
                  ? 'border-violet-600 bg-violet-50'
                  : 'border-slate-300 hover:border-violet-400 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(key)}
                onChange={() => toggleChoice(key)}
                className="mt-1 w-4 h-4 rounded text-violet-600 focus:ring-violet-500"
              />
              <span className="font-medium text-slate-800 mr-2">{key}.</span>
              <span className="text-slate-800">{options[key]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg border border-amber-400"
        >
          {currentIndex < questions.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {questions.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`w-8 h-8 rounded text-sm font-medium ${
              i === currentIndex
                ? 'bg-violet-600 text-white'
                : answers[i]?.length
                ? 'bg-violet-100 text-violet-800 border border-violet-300'
                : 'bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
