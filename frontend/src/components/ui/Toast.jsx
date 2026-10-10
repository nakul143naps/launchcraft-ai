import React from 'react';
import { CheckCircle2, Sparkles, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md text-white text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
        <Sparkles className="w-4 h-4" />
      </div>
      <span className="leading-snug">{toast.message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
