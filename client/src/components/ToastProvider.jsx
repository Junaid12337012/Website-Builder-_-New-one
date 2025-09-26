import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({ addToast: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  // Map toast keys to IDs for de-duplication
  const keyMap = React.useRef(new Map());
  const timers = React.useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
    // Clean any timer and key mapping for this id
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    // Remove key that maps to this id
    for (const [k, v] of keyMap.current.entries()) {
      if (v === id) keyMap.current.delete(k);
    }
  }, []);

  const addToast = useCallback(({ title, description, type = 'info', duration = 3000, key }) => {
    // If key provided and existing, update existing toast content and reset timer
    if (key && keyMap.current.has(key)) {
      const existingId = keyMap.current.get(key);
      setToasts((ts) => ts.map((t) => (t.id === existingId ? { ...t, title, description, type } : t)));
      // reset timer
      const prevTimer = timers.current.get(existingId);
      if (prevTimer) clearTimeout(prevTimer);
      if (duration) {
        const timer = setTimeout(() => removeToast(existingId), duration);
        timers.current.set(existingId, timer);
      }
      return existingId;
    }

    const id = Math.random().toString(36).slice(2);
    setToasts((ts) => [...ts, { id, title, description, type }]);
    if (key) keyMap.current.set(key, id);
    if (duration) {
      const timer = setTimeout(() => removeToast(id), duration);
      timers.current.set(id, timer);
    }
    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="fixed z-[1000] top-4 right-4 space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-sm rounded-lg border px-4 py-3 shadow-lg transition-all bg-gray-800 border-gray-700 text-white`}
          >
            <div className="flex items-start">
              <div className={`mt-1 mr-3 h-2 w-2 rounded-full ${
                t.type === 'success' ? 'bg-green-400' : t.type === 'error' ? 'bg-red-400' : t.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
              }`} />
              <div className="flex-1">
                {t.title && <div className="text-sm font-semibold">{t.title}</div>}
                {t.description && <div className="text-sm text-gray-300 mt-0.5">{t.description}</div>}
              </div>
              <button onClick={() => removeToast(t.id)} className="ml-3 text-gray-400 hover:text-gray-200">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
