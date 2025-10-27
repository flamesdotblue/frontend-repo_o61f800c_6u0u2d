import { useEffect } from 'react';
import { Sun, Moon, KanbanSquare, CheckCircle2 } from 'lucide-react';

export default function Header({ view, setView, theme, setTheme }) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('dg_theme', theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b border-white/10 dark:border-white/5 bg-white/60 dark:bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-500 via-cyan-400 to-emerald-400 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.6)]" />
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Deepika Groups</h1>
            <p className="text-xs text-gray-600 dark:text-gray-300/80">Neon Task Manager</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setView('board')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition shadow-sm border ${
              view === 'board'
                ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border-cyan-400/40 text-cyan-700 dark:text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                : 'bg-white/60 dark:bg-white/5 border-white/20 text-gray-700 dark:text-gray-300 hover:border-cyan-400/40'
            }`}
          >
            <KanbanSquare className="h-4 w-4" />
            Board
          </button>
          <button
            onClick={() => setView('completed')}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition shadow-sm border ${
              view === 'completed'
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-400/40 text-emerald-700 dark:text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-white/60 dark:bg-white/5 border-white/20 text-gray-700 dark:text-gray-300 hover:border-emerald-400/40'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition bg-white/60 dark:bg-white/5 border border-white/20 text-gray-700 dark:text-gray-300 hover:border-fuchsia-400/40 shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
            ) : (
              <Moon className="h-4 w-4 text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]" />
            )}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
