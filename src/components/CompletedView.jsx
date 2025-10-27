import { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function CompletedView({ tasks }) {
  const [query, setQuery] = useState('');
  const [assignee, setAssignee] = useState('All');
  const [priority, setPriority] = useState('All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const assignees = useMemo(() => Array.from(new Set(tasks.map((t) => t.assignee))), [tasks]);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (t.status !== 'Done') return false;
      if (query && !(`${t.title} ${t.description}`.toLowerCase().includes(query.toLowerCase()))) return false;
      if (assignee !== 'All' && t.assignee !== assignee) return false;
      if (priority !== 'All' && t.priority !== priority) return false;
      if (from && (!t.dueDate || t.dueDate < from)) return false;
      if (to && (!t.dueDate || t.dueDate > to)) return false;
      return true;
    });
  }, [tasks, query, assignee, priority, from, to]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl p-4 bg-white/60 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Search completed tasks"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
              />
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <Filter className="h-4 w-4" /> Filters
            </div>
          </div>
          <div className="grid grid-cols-2 md:flex items-center gap-2">
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20 text-sm"
            >
              <option>All</option>
              {assignees.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20 text-sm"
            >
              <option>All</option>
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20 text-sm" />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20 text-sm" />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700 dark:text-gray-300">
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Assignee</th>
                <th className="py-2 pr-4">Priority</th>
                <th className="py-2 pr-4">Start</th>
                <th className="py-2 pr-4">Delivery</th>
                <th className="py-2 pr-4">Estimate</th>
                <th className="py-2 pr-4">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-white/20 text-gray-900 dark:text-gray-100">
                  <td className="py-2 pr-4">{t.title}</td>
                  <td className="py-2 pr-4">{t.assignee}</td>
                  <td className="py-2 pr-4">{t.priority}</td>
                  <td className="py-2 pr-4">{t.startDate || '-'}</td>
                  <td className="py-2 pr-4">{t.dueDate || '-'}</td>
                  <td className="py-2 pr-4">{t.estimateHours || 0}h</td>
                  <td className="py-2 pr-4">{t.tags?.join(', ')}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-600 dark:text-gray-300">No completed tasks match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
