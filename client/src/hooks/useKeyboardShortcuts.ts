import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === (event.ctrlKey || event.metaKey);
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === event.shiftKey;
        const altMatch = shortcut.alt === undefined || shortcut.alt === event.altKey;
        const metaMatch = shortcut.meta === undefined || shortcut.meta === event.metaKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && metaMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_CHAT: { key: '/', ctrl: true, description: 'Toggle chat' },
  SAVE_ALL: { key: 's', ctrl: true, description: 'Save all files' },
  COMMAND_PALETTE: { key: 'k', ctrl: true, description: 'Open command palette' },
  RUN_BUILD: { key: 'b', ctrl: true, description: 'Build/Run project' },
  TOGGLE_PREVIEW: { key: 'p', ctrl: true, description: 'Toggle preview panel' },
  NEW_FILE: { key: 'n', ctrl: true, shift: true, description: 'New file' },
  FIND: { key: 'f', ctrl: true, description: 'Find in files' },
  EXPORT: { key: 'e', ctrl: true, shift: true, description: 'Export project' },
} as const;
