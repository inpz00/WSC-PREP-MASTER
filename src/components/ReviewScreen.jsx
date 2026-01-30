import { useState, useEffect, useMemo } from 'react';
import { scoreAnswer } from '../data/questions';
import { saveResult, getResultHistory } from '../lib/storage';
import ProgressChart from './ProgressChart';

export default function ReviewScreen({
  questions,
  answers,
  startTime,
  endTime,
  onRestart,
}) {
  const [showChart, setShowChart] = useState(false);

  const results = useMemo(() => questions.map((q, i) => {
    const selected = answers[i] ?? [];
    const pts = scoreAnswer(selected, q.correctAnswer);
    return {
      question: q,
      index: i,
      selected,
      points: pts,
      correctKey: q.correctAnswer,
    };
  }), [questions, answers]);

  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const maxPoints = questions.length;
  const pct = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
  const timeSpentSec = Math.round((endTime - startTime) / 1000);

  const breakdownBySubject = useMemo(() => {
    const bySubject = {};
    results.forEach((r) => {
      const s = r.question.subject;
      if (!bySubject[s]) bySubject[s] = { total: 0, points: 0, count: 0 };
      bySubject[s].count += 1;
      bySubject[s].total += 1;
      bySubject[s].points += r.points;
    });
    return Object.entries(bySubject).map(([subject, data]) => ({
      subject,
      ...data,
      pct: data.total > 0 ? Math.round((data.points / data.total) * 100) : 0,
    })).sort((a, b) => a.subject.localeCompare(b.subject));
  }, [results]);

  const breakdownByDivision = useMemo(() => {
    const byDivision = {};
    results.forEach((r) => {
      const d = r.question.division;
      if (!byDivision[d]) byDivision[d] = { total: 0, points: 0, count: 0 };
      byDivision[d].count += 1;
      byDivision[d].total += 1;
      byDivision[d].points += r.points;
    });
    return Object.entries(byDivision).map(([division, data]) => ({
      division,
      ...data,
      pct: data.total > 0 ? Math.round((data.points / data.total) * 100) : 0,
    })).sort((a, b) => a.division.localeCompare(b.division));
  }, [results]);

  useEffect(() => {
    saveResult({
      totalPoints,
      maxPoints,
      pct,
      questionCount: questions.length,
      timeSpentSec,
    });
  }, [totalPoints, maxPoints, pct, questions.length, timeSpentSec]);

  const history = getResultHistory();

  return (
    <div className="space-y-8 text-slate-800">
      {/* Result summary — 흰 카드 + 진한 글씨 */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center">
        <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">
          Quiz Complete
        </h2>
        <p className="text-slate-600 mb-4">
          Time: {Math.floor(timeSpentSec / 60)}m {timeSpentSec % 60}s
        </p>
        <div className="inline-block bg-violet-50 rounded-xl px-8 py-4 border-2 border-amber-400">
          <span className="text-4xl font-display font-bold text-violet-700">
            {totalPoints.toFixed(2)}
          </span>
          <span className="text-xl text-slate-600"> / {maxPoints}</span>
        </div>
        <p className="mt-2 text-lg font-medium text-slate-800">{pct}%</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow border border-amber-400"
          >
            New Quiz
          </button>
          <button
            onClick={() => setShowChart((s) => !s)}
            className="px-6 py-2 border-2 border-violet-600 text-violet-700 hover:bg-violet-50 font-semibold rounded-lg bg-white"
          >
            {showChart ? 'Hide' : 'Show'} Progress
          </button>
        </div>
      </div>

      {/* Performance breakdown */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <h3 className="font-display font-semibold text-lg text-slate-800 p-4 border-b border-slate-200 bg-slate-50">
          Performance Breakdown
        </h3>
        <div className="p-4 md:p-6 space-y-6 text-slate-800">
          <section>
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> By Subject
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-800">
                <thead>
                  <tr className="text-left text-slate-600 border-b border-slate-300">
                    <th className="py-2 pr-4">Subject</th>
                    <th className="py-2 pr-4 text-right">Score</th>
                    <th className="py-2 text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownBySubject.map((row) => (
                    <tr key={row.subject} className="border-b border-slate-200">
                      <td className="py-2 pr-4 font-medium text-slate-800">{row.subject}</td>
                      <td className="py-2 pr-4 text-right text-violet-700">{row.points.toFixed(2)} / {row.total}</td>
                      <td className="py-2 text-right font-medium text-slate-800">{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> By Division
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-800">
                <thead>
                  <tr className="text-left text-slate-600 border-b border-slate-300">
                    <th className="py-2 pr-4">Division</th>
                    <th className="py-2 pr-4 text-right">Score</th>
                    <th className="py-2 text-right">%</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownByDivision.map((row) => (
                    <tr key={row.division} className="border-b border-slate-200">
                      <td className="py-2 pr-4 font-medium text-slate-800">{row.division}</td>
                      <td className="py-2 pr-4 text-right text-violet-700">{row.points.toFixed(2)} / {row.total}</td>
                      <td className="py-2 text-right font-medium text-slate-800">{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {showChart && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
          <h3 className="font-display font-semibold text-lg text-slate-800 mb-4">
            Result History
          </h3>
          <ProgressChart history={history} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <h3 className="font-display font-semibold text-lg text-slate-800 p-4 border-b border-slate-200 bg-slate-50">
          Review — Questions & Answers
        </h3>
        <div className="divide-y divide-slate-200">
          {results.map((r, i) => (
            <div key={i} className="p-4 md:p-6 text-slate-800">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-sm font-medium text-slate-600">Q{i + 1}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-slate-800 border border-amber-300">
                  {r.question.subject} · {r.question.division} · L{r.question.difficulty}
                </span>
              </div>
              <p className="font-medium text-slate-800 mb-3">{r.question.question}</p>
              <p className="text-sm text-slate-600 mb-2">
                <span className="font-medium">Your selection:</span>{' '}
                {r.selected.length ? r.selected.sort().join(', ') : '—'}
              </p>
              <p className="text-sm text-violet-700 mb-2">
                <span className="font-medium">Correct:</span> {r.correctKey}
              </p>
              <p className="text-sm text-slate-700 mb-2">{r.question.explanation}</p>
              {r.question.studyMoreUrl && (
                <a
                  href={r.question.studyMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-violet-600 hover:underline font-medium"
                >
                  Study more →
                </a>
              )}
              <p className="mt-2 text-sm font-medium text-amber-700">
                Points: {r.points.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
