import { useCallback, useState } from 'react';

export type NotesViewMode = 'postit' | 'minimal';

const STORAGE_KEY = 'domainlife-notes-view';

function getInitialMode(): NotesViewMode {
  return localStorage.getItem(STORAGE_KEY) === 'minimal' ? 'minimal' : 'postit';
}

export function useNotesViewMode() {
  const [mode, setModeState] = useState<NotesViewMode>(getInitialMode);

  const setMode = useCallback((next: NotesViewMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  }, []);

  return { mode, setMode };
}
