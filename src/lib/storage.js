const HISTORY_KEY = 'wsc_prep_master_history';

export function getResultHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResult(result) {
  const history = getResultHistory();
  history.unshift({
    ...result,
    date: new Date().toISOString(),
  });
  // Keep last 50
  const trimmed = history.slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}
