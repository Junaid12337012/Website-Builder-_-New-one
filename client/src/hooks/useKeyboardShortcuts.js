import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs/textarea
    if (
      event.target.tagName === 'INPUT' || 
      event.target.tagName === 'TEXTAREA' ||
      event.target.isContentEditable
    ) {
      return;
    }

    const key = event.key.toLowerCase();
    const ctrlKey = event.ctrlKey || event.metaKey; // Support both ctrl and cmd
    const shiftKey = event.shiftKey;
    const altKey = event.altKey;

    const shortcutKey = [
      ctrlKey && 'ctrl',
      shiftKey && 'shift',
      altKey && 'alt',
      key
    ]
      .filter(Boolean)
      .join('+');

    const handler = shortcuts[shortcutKey];
    if (handler) {
      event.preventDefault();
      handler(event);
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
