const KEY = 'ielts-mock:session-v1';

export interface PersistedSession {
  id: string;
  startTime: string; // ISO
  answers: Record<string, string | string[]>;
  flaggedQuestions: number[];
  visitedQuestions: number[];
  currentQuestionIndex: number;
  timeRemaining: number; // seconds
  isCompleted: boolean;
}

export function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedSession;
  } catch {
    return null;
  }
}

export function saveSession(session: PersistedSession): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export function updateSession(partial: Partial<PersistedSession>): void {
  const current = loadSession();
  if (!current) return;
  saveSession({ ...current, ...partial });
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
