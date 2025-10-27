import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import HeroSpline from './components/HeroSpline';
import Board from './components/Board';
import CompletedView from './components/CompletedView';

const STORAGE_KEY = 'dg_tasks_v1';

export default function App() {
  const [view, setView] = useState('board');
  const [theme, setTheme] = useState(() => localStorage.getItem('dg_theme') || 'dark');
  const [tasks, setTasks] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // Seed with an example board
    return [
      {
        id: crypto.randomUUID(),
        title: 'Setup project foundation',
        description: 'Initialize repo, CI, and shared UI kit. Align linting & formatting.',
        assignee: 'Aarav',
        priority: 'High',
        status: 'In Progress',
        startDate: new Date().toISOString().slice(0,10),
        dueDate: '',
        estimateHours: 8,
        tags: ['infra', 'ui'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Auth flow',
        description: 'Design login states and role-based access for managers.',
        assignee: 'Diya',
        priority: 'Critical',
        status: 'Review',
        startDate: new Date().toISOString().slice(0,10),
        dueDate: '',
        estimateHours: 12,
        tags: ['backend', 'security'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'Stakeholder dashboard',
        description: 'KPIs and delivery insights for Deepika Groups leadership.',
        assignee: 'Meera',
        priority: 'Medium',
        status: 'Backlog',
        startDate: '',
        dueDate: '',
        estimateHours: 16,
        tags: ['dashboard'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'API contracts',
        description: 'Document endpoints for task lifecycle and analytics.',
        assignee: 'Kabir',
        priority: 'Low',
        status: 'Done',
        startDate: '',
        dueDate: new Date().toISOString().slice(0,10),
        estimateHours: 6,
        tags: ['docs'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const metrics = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'Done').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const review = tasks.filter((t) => t.status === 'Review').length;
    return { total, done, inProgress, review };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white dark:from-neutral-950 dark:to-black">
      <Header view={view} setView={setView} theme={theme} setTheme={setTheme} />
      <HeroSpline />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Total" value={metrics.total} color="from-cyan-500 to-fuchsia-500" />
          <MetricCard label="In Progress" value={metrics.inProgress} color="from-amber-500 to-rose-500" />
          <MetricCard label="Review" value={metrics.review} color="from-sky-500 to-indigo-500" />
          <MetricCard label="Done" value={metrics.done} color="from-emerald-500 to-teal-500" />
        </div>
      </section>

      {view === 'board' ? (
        <Board tasks={tasks} setTasks={setTasks} />
      ) : (
        <CompletedView tasks={tasks} />
      )}

      <footer className="mt-10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-6 bg-white/60 dark:bg-white/5 border border-white/30 dark:border-white/10 text-center backdrop-blur">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Built for Deepika Groups • Local-first, responsive, and neon-themed. Drag tasks across columns and filter completed work.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className="rounded-2xl p-4 border border-white/30 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur shadow-sm">
      <p className="text-xs text-gray-700 dark:text-gray-300">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]`}
      >
        {value}
      </p>
    </div>
  );
}
