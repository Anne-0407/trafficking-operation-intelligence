import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
        isDark
          ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/80 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] text-slate-300">Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] text-slate-700">Light</span>
          </>
        )}
      </div>

      <span
        className={`w-2 h-2 rounded-full transition-colors ${
          isDark ? 'bg-sky-400 shadow-glow-accent' : 'bg-amber-500'
        }`}
      />
    </button>
  );
};
