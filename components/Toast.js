import { useState, useEffect, useCallback } from 'react';

let toastListeners = [];

export function showToast(message, type = 'success') {
  toastListeners.forEach(fn => fn({ message, type, id: Date.now() }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    };
    toastListeners.push(handler);
    return () => { toastListeners = toastListeners.filter(fn => fn !== handler); };
  }, []);

  const colors = {
    success: 'bg-green-600',
    error:   'bg-red-600',
    warning: 'bg-yellow-500',
    info:    'bg-blue-600',
  };

  const icons = {
    success: '✓',
    error:   '✕',
    warning: '⚠',
    info:    'ℹ',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 no-print">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`${colors[t.type] || colors.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[260px] toast-enter`}
        >
          <span className="text-lg font-bold">{icons[t.type]}</span>
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
