import { useMemo, useState } from 'react';
import { Plus, Clock, User, CalendarDays, Tag, Flag } from 'lucide-react';

const STATUSES = ['Backlog', 'In Progress', 'Review', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const DEVELOPERS = [
  'Aarav',
  'Ishaan',
  'Diya',
  'Meera',
  'Kabir',
];

function TaskCard({ task, onEdit, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group rounded-xl p-4 bg-white/80 dark:bg-white/5 border border-white/30 dark:border-white/10 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing backdrop-blur"
    >
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white pr-2">{task.title}</h4>
        <span
          className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wide border ${
            task.priority === 'Critical'
              ? 'text-red-500 border-red-400/50 bg-red-400/10'
              : task.priority === 'High'
              ? 'text-amber-500 border-amber-400/50 bg-amber-400/10'
              : task.priority === 'Medium'
              ? 'text-cyan-500 border-cyan-400/50 bg-cyan-400/10'
              : 'text-emerald-500 border-emerald-400/50 bg-emerald-400/10'
          }`}
        >
          {task.priority}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300/80 line-clamp-3">{task.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {task.tags?.map((t, idx) => (
          <span
            key={idx}
            className="text-[10px] px-2 py-1 rounded-md bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 text-fuchsia-500 border border-fuchsia-400/30"
          >
            <Tag className="h-3 w-3 inline mr-1" />{t}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300/80">
        <div className="flex items-center gap-1"><User className="h-3 w-3 text-cyan-400" />{task.assignee}</div>
        <div className="flex items-center gap-1 justify-end"><Clock className="h-3 w-3 text-fuchsia-400" />{task.estimateHours || 0}h</div>
        <div className="flex items-center gap-1"><CalendarDays className="h-3 w-3 text-emerald-400" />{task.startDate || '-'}</div>
        <div className="flex items-center gap-1 justify-end"><CalendarDays className="h-3 w-3 text-rose-400" />{task.dueDate || '-'}</div>
      </div>
      <button
        onClick={() => onEdit(task)}
        className="mt-3 w-full text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-white/20 text-cyan-200 hover:from-cyan-500/30 hover:to-fuchsia-500/30 transition"
      >
        Edit
      </button>
    </div>
  );
}

function Column({ title, tasks, onDropCard, onEdit, onDragStart }) {
  return (
    <div
      className="rounded-2xl p-3 bg-white/60 dark:bg-white/5 border border-white/30 dark:border-white/10 min-h-[240px] flex flex-col backdrop-blur"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropCard(e, title)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          {title}
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 dark:bg-white/10 border border-white/20 text-gray-700 dark:text-gray-300">{tasks.length}</span>
        </h3>
      </div>
      <div className="grid gap-3">
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} onEdit={onEdit} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}

export default function Board({ tasks, setTasks }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ assignee: 'All', priority: 'All', search: '' });

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.assignee !== 'All' && t.assignee !== filters.assignee) return false;
      if (filters.priority !== 'All' && t.priority !== filters.priority) return false;
      if (filters.search && !(`${t.title} ${t.description}`.toLowerCase().includes(filters.search.toLowerCase()))) return false;
      return t.status !== 'Done';
    });
  }, [tasks, filters]);

  const grouped = useMemo(() => {
    const g = { Backlog: [], 'In Progress': [], Review: [], Done: [] };
    filtered.forEach((t) => {
      g[t.status]?.push(t);
    });
    return g;
  }, [filtered]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', String(id));
  };

  const handleDropCard = (e, status) => {
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)));
  };

  const startCreate = () => {
    setEditing(null);
    setShowForm(true);
  };
  const startEdit = (task) => {
    setEditing(task);
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.assignee}
            onChange={(e) => setFilters((f) => ({ ...f, assignee: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20 text-sm"
          >
            <option>All</option>
            {DEVELOPERS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20 text-sm"
          >
            <option>All</option>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <input
            placeholder="Search title or description..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            className="px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20 text-sm w-full sm:w-72"
          />
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-sm shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_28px_rgba(217,70,239,0.6)] transition"
        >
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      {/* Columns */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUSES.slice(0, 3).map((s) => (
          <Column
            key={s}
            title={s}
            tasks={grouped[s]}
            onDropCard={handleDropCard}
            onEdit={startEdit}
            onDragStart={handleDragStart}
          />
        ))}
        <Column
          key="Done"
          title="Done"
          tasks={grouped['Done']}
          onDropCard={handleDropCard}
          onEdit={startEdit}
          onDragStart={handleDragStart}
        />
      </div>

      {showForm && (
        <TaskModal
          onClose={() => setShowForm(false)}
          onSave={(payload) => {
            setTasks((prev) => {
              if (payload.id) {
                return prev.map((t) => (t.id === payload.id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t));
              }
              const id = crypto.randomUUID();
              return [
                { ...payload, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                ...prev,
              ];
            });
            setShowForm(false);
          }}
          task={editing}
        />
      )}
    </div>
  );
}

function TaskModal({ onClose, onSave, task }) {
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignee: task?.assignee || DEVELOPERS[0],
    priority: task?.priority || 'Medium',
    status: task?.status || 'Backlog',
    startDate: task?.startDate || '',
    dueDate: task?.dueDate || '',
    estimateHours: task?.estimateHours || 4,
    tags: task?.tags?.join(', ') || '',
  });

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      estimateHours: Number(form.estimateHours) || 0,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (task?.id) payload.id = task.id;
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-zinc-900 border border-white/20 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/20 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Flag className="h-5 w-5 text-fuchsia-400" /> {task ? 'Edit task' : 'Create new task'}
          </h3>
        </div>
        <form onSubmit={submit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Assignee</label>
            <select
              value={form.assignee}
              onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            >
              {DEVELOPERS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            >
              {PRIORITIES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Start date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Delivery date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Estimate (hours)</label>
            <input
              type="number"
              min="0"
              value={form.estimateHours}
              onChange={(e) => setForm({ ...form, estimateHours: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-white/5 border border-white/20"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/20 bg-white/60 dark:bg-white/5 text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-sm shadow-[0_0_20px_rgba(217,70,239,0.5)]">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
