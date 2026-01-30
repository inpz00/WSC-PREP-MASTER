export default function ProgressChart({ history }) {
  if (!history?.length) {
    return (
      <p className="text-slate-600 text-sm py-4">No history yet. Complete a quiz to see progress.</p>
    );
  }

  const maxPct = Math.max(...history.map((h) => h.pct), 1);
  const display = history.slice(0, 15);

  return (
    <div className="space-y-2 text-slate-800">
      <div className="flex items-end gap-1 h-24">
        {display.map((entry, i) => (
          <div
            key={i}
            className="flex-1 min-w-[8px] flex flex-col items-center gap-1"
            title={`${entry.pct}% — ${new Date(entry.date).toLocaleString()}`}
          >
            <div
              className="w-full rounded-t bg-violet-600 transition-all border-t-2 border-amber-400"
              style={{
                height: `${(entry.pct / maxPct) * 80}%`,
                minHeight: entry.pct > 0 ? 4 : 0,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>Oldest</span>
        <span>Newest</span>
      </div>
      <ul className="text-sm text-slate-700 mt-2 space-y-1">
        {display.slice(0, 5).map((entry, i) => (
          <li key={i}>
            {entry.pct}% — {entry.questionCount} Q —{' '}
            {new Date(entry.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
