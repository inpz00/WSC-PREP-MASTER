import { useState } from 'react';
import { SUBJECTS, DIFFICULTIES, DIVISIONS } from '../data/questions';

const AVAILABLE_DIVISION_ID = 'Skittles'; // 당분간 스키틀만 선택 가능

export default function SetupScreen({ onStart, modes, questionCount }) {
  const [divisionId, setDivisionId] = useState(AVAILABLE_DIVISION_ID);
  const [modeId, setModeId] = useState('B');
  const [focusType, setFocusType] = useState('fullMock'); // bySubject | byDifficulty | fullMock
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [difficulty, setDifficulty] = useState(3);
  const [preparingMessage, setPreparingMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const difficultyValue =
      focusType === 'bySubject'
        ? difficulty
        : focusType === 'byDifficulty'
          ? (typeof difficulty === 'number' ? difficulty : 3)
          : undefined;
    onStart({
      divisionId,
      modeId,
      focusType,
      subject: focusType === 'bySubject' ? subject : undefined,
      difficulty: difficultyValue,
    });
  };

  return (
    <div className="max-w-xl mx-auto text-slate-800">
      <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">
        Scholar's Challenge — Setup
      </h2>
      <p className="text-slate-600 mb-6">
        Choose your division first, then time/volume and focus. You can select multiple answers per question; partial credit applies.
      </p>
      {questionCount != null && questionCount > 0 && (
        <p className="text-sm text-amber-700 mb-4 font-medium">— {questionCount} questions loaded</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Division — 당분간 스키틀만 선택 가능, Junior/Senior 클릭 시 준비 중 문구 */}
        <section className="bg-violet-700 text-white rounded-xl shadow-lg p-6 border-2 border-amber-400">
          <h3 className="font-display font-semibold text-lg mb-1 flex items-center gap-2">
            <span className="text-amber-300">Division</span>
          </h3>
          <p className="text-slate-100 text-sm mb-4">
            Questions and vocabulary are tailored to your division.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {DIVISIONS.map((d) => {
              const isAvailable = d.id === AVAILABLE_DIVISION_ID;
              if (isAvailable) {
                return (
                  <label
                    key={d.id}
                    className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition ${
                      divisionId === d.id
                        ? 'border-amber-400 bg-amber-400/20 text-white'
                        : 'border-white/50 hover:border-amber-300 hover:bg-white/10 text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="division"
                      value={d.id}
                      checked={divisionId === d.id}
                      onChange={() => { setDivisionId(d.id); setPreparingMessage(null); }}
                      className="sr-only"
                    />
                    <span className="font-semibold text-white">{d.label}</span>
                    <span className="text-sm text-slate-100 mt-0.5">{d.ages}</span>
                    <span className="text-xs text-slate-200 mt-1">{d.description}</span>
                  </label>
                );
              }
              return (
                <div
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setPreparingMessage('Junior / Senior divisions are currently preparing. Please select Skittles for now.')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPreparingMessage('Junior / Senior divisions are currently preparing. Please select Skittles for now.'); } }}
                  className="flex flex-col p-4 rounded-lg border-2 border-white/30 bg-white/5 cursor-not-allowed opacity-75 transition select-none"
                >
                  <span className="font-semibold text-white/80">{d.label}</span>
                  <span className="text-sm text-slate-200/80 mt-0.5">{d.ages}</span>
                  <span className="text-xs text-slate-300/80 mt-1">{d.description}</span>
                  <span className="text-xs text-amber-200/90 mt-2 italic">(Preparing)</span>
                </div>
              );
            })}
          </div>
          {preparingMessage && (
            <p className="mt-4 p-3 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-100 text-sm font-medium" role="alert">
              {preparingMessage}
            </p>
          )}
        </section>

        {/* Selection 1: Time / Volume */}
        <section className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-slate-800">
          <h3 className="font-display font-semibold text-lg text-slate-800 mb-3">
            1. Time / Volume
          </h3>
          <div className="flex gap-4">
            {modes.map((m) => (
              <label
                key={m.id}
                className={`flex-1 flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                  modeId === m.id
                    ? 'border-violet-600 bg-violet-50 text-slate-800'
                    : 'border-slate-300 hover:border-violet-400 text-slate-800'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value={m.id}
                  checked={modeId === m.id}
                  onChange={() => setModeId(m.id)}
                  className="sr-only"
                />
                <span className="font-semibold text-slate-800">{m.label}</span>
                <span className="text-sm text-slate-600 mt-1">
                  {m.questions} Q / {m.minutes} min
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Selection 2: Focus */}
        <section className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-slate-800">
          <h3 className="font-display font-semibold text-lg text-slate-800 mb-3">
            2. Focus
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer text-slate-800">
              <input
                type="radio"
                name="focus"
                value="bySubject"
                checked={focusType === 'bySubject'}
                onChange={() => setFocusType('bySubject')}
                className="w-4 h-4 text-violet-600"
              />
              <span className="font-medium text-slate-800">By Subject</span>
              <span className="text-sm text-slate-600">— 1 subject + difficulty (or All)</span>
            </label>
            {focusType === 'bySubject' && (
              <div className="ml-7 flex flex-wrap gap-3">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white text-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={difficulty === 'all' ? 'all' : difficulty}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDifficulty(v === 'all' ? 'all' : Number(v));
                  }}
                  className="rounded-lg border border-slate-300 bg-white text-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                >
                  <option value="all">All (mixed levels)</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>Difficulty {d}</option>
                  ))}
                </select>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer text-slate-800">
              <input
                type="radio"
                name="focus"
                value="byDifficulty"
                checked={focusType === 'byDifficulty'}
                onChange={() => setFocusType('byDifficulty')}
                className="w-4 h-4 text-violet-600"
              />
              <span className="font-medium text-slate-800">By Difficulty</span>
              <span className="text-sm text-slate-600">— 1 level, all subjects</span>
            </label>
            {focusType === 'byDifficulty' && (
              <div className="ml-7">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="rounded-lg border border-slate-300 bg-white text-slate-800 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>Level {d}</option>
                  ))}
                </select>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer text-slate-800">
              <input
                type="radio"
                name="focus"
                value="fullMock"
                checked={focusType === 'fullMock'}
                onChange={() => setFocusType('fullMock')}
                className="w-4 h-4 text-violet-600"
              />
              <span className="font-medium text-slate-800">Full Mock Exam</span>
              <span className="text-sm text-slate-600">— All subjects & levels</span>
            </label>
          </div>
        </section>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg border border-amber-400 transition"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
}
