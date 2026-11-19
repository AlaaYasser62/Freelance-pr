import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, LayoutGrid, Clock, Info, Plus, Trash2,
  Calendar, DollarSign, CheckSquare, Timer, PlusCircle, GripVertical
} from 'lucide-react';
import { Badge, ProgressBar, TabBar, Avatar } from '../../components/ui/index';
import { projects, team } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

const COLS = [
  { id: 'backlog',     label: 'Backlog',      color: 'text-text-muted',      dot: 'bg-text-muted' },
  { id: 'todo',        label: 'To Do',         color: 'text-accent-blue',     dot: 'bg-accent-blue' },
  { id: 'in-progress', label: 'In Progress',   color: 'text-accent-amber',    dot: 'bg-accent-amber' },
  { id: 'done',        label: 'Done',          color: 'text-accent-emerald',  dot: 'bg-accent-emerald' },
];

const PRIORITY_DOT = {
  critical: 'bg-accent-rose',
  high:     'bg-accent-amber',
  medium:   'bg-accent-blue',
  low:      'bg-text-muted',
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);
  const [tab, setTab]         = useState('overview');
  const [kanban, setKanban]   = useState(project?.kanban || {});
  const [timeLogs, setTimeLogs] = useState(project?.timeLogs || []);
  const [newLog, setNewLog]   = useState({ description: '', hours: '', date: '', billable: true });
  const [dragOver, setDragOver] = useState(null);
  const dragTask = useRef(null);
  const dragFrom = useRef(null);

  if (!project) return (
    <div className="p-6 text-center">
      <p className="text-text-muted mb-4">Project not found.</p>
      <Link to="/dashboard/projects" className="btn-primary inline-flex">Back to projects</Link>
    </div>
  );

  /* ── drag handlers ── */
  function onDragStart(taskId, colId) {
    dragTask.current = taskId;
    dragFrom.current = colId;
  }
  function onDragOver(e, colId) {
    e.preventDefault();
    setDragOver(colId);
  }
  function onDrop(e, toColId) {
    e.preventDefault();
    setDragOver(null);
    const from = dragFrom.current, tid = dragTask.current;
    if (!tid || !from || from === toColId) return;
    const task = kanban[from]?.find(t => t.id === tid);
    if (!task) return;
    setKanban(prev => ({
      ...prev,
      [from]:   prev[from].filter(t => t.id !== tid),
      [toColId]: [...(prev[toColId] || []), task],
    }));
    dragTask.current = null;
    dragFrom.current = null;
  }
  function onDragLeave() { setDragOver(null); }

  /* ── time logs ── */
  function addTimeLog() {
    if (!newLog.description || !newLog.hours || !newLog.date) return;
    setTimeLogs(prev => [...prev, { id: `tl${Date.now()}`, ...newLog, hours: parseFloat(newLog.hours) }]);
    setNewLog({ description: '', hours: '', date: '', billable: true });
  }
  const totalHours    = timeLogs.reduce((a, l) => a + l.hours, 0);
  const billableHours = timeLogs.filter(l => l.billable).reduce((a, l) => a + l.hours, 0);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <Link to="/dashboard/projects" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-5 transition-colors">
        <ArrowLeft size={15} /> Back to projects
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <h1 className="font-display text-2xl font-bold">{project.name}</h1>
            <Badge status={project.status} />
            <Badge status={project.priority} />
          </div>
          <p className="text-text-secondary text-sm">{project.client} · Due {formatDate(project.dueDate)}</p>
        </div>
        <button className="btn-secondary text-sm py-2 self-start"><Plus size={14} /> Add task</button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: DollarSign, label: 'Budget',       val: formatCurrency(project.budget), sub: `${formatCurrency(project.spent)} spent` },
          { icon: CheckSquare, label: 'Tasks',       val: `${project.tasks.done}/${project.tasks.total}`, sub: 'completed' },
          { icon: Timer,       label: 'Hours logged', val: `${totalHours}h`, sub: `${billableHours}h billable` },
          { icon: Calendar,    label: 'Due date',     val: formatDate(project.dueDate), sub: '' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center gap-2 mb-2 text-text-muted">
              <s.icon size={14} /><span className="text-xs">{s.label}</span>
            </div>
            <div className="font-display font-bold text-lg">{s.val}</div>
            {s.sub && <div className="text-text-muted text-xs mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <TabBar
          tabs={[
            { id: 'overview',  label: 'Overview',     icon: Info },
            { id: 'kanban',    label: 'Kanban Board',  icon: LayoutGrid },
            { id: 'timelogs',  label: 'Time Logs',     icon: Clock },
          ]}
          active={tab} onChange={setTab}
        />
      </div>

      {/* ── Overview ─────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-3">Description</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>
            </div>
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-4">Progress</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm">Overall completion</span>
                <span className="font-bold text-accent-cyan">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} size="lg" />
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border text-center">
                {[
                  { label: 'Backlog',     count: kanban.backlog?.length || 0 },
                  { label: 'In Progress', count: kanban['in-progress']?.length || 0 },
                  { label: 'Done',        count: kanban.done?.length || 0 },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-xl">{s.count}</div>
                    <div className="text-text-muted text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-surface-overlay text-text-secondary text-xs border border-border">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-4">Team</h3>
              <div className="flex flex-col gap-3">
                {project.team.map(tid => {
                  const m = team.find(t => t.id === tid);
                  return m ? (
                    <div key={tid} className="flex items-center gap-3">
                      <Avatar name={m.name} />
                      <div>
                        <div className="text-sm font-medium">{m.name}</div>
                        <div className="text-text-muted text-xs">{m.role}</div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-display font-semibold mb-4">Budget</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Total budget', val: formatCurrency(project.budget),               color: '' },
                  { label: 'Spent',        val: formatCurrency(project.spent),                color: 'text-accent-amber' },
                  { label: 'Remaining',    val: formatCurrency(project.budget - project.spent), color: 'text-accent-emerald' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{row.label}</span>
                    <span className={`font-medium ${row.color}`}>{row.val}</span>
                  </div>
                ))}
                <div className="mt-2">
                  <ProgressBar value={(project.spent / project.budget) * 100}
                    color={project.spent / project.budget > 0.8 ? 'rose' : 'amber'} />
                </div>
                <p className="text-text-muted text-xs">{Math.round((project.spent / project.budget) * 100)}% used</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Kanban ───────────────────────────────────────────────────── */}
      {tab === 'kanban' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-text-muted text-xs mb-4 flex items-center gap-1.5">
            <GripVertical size={12} /> Drag cards between columns to update status
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLS.map(col => (
              <div
                key={col.id}
                onDragOver={e => onDragOver(e, col.id)}
                onDrop={e => onDrop(e, col.id)}
                onDragLeave={onDragLeave}
                className={`flex flex-col gap-3 min-h-[200px] p-2 rounded-2xl border-2 transition-all duration-150
                  ${dragOver === col.id ? 'border-accent-cyan/40 bg-accent-cyan/5' : 'border-transparent bg-surface/50'}`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className={`font-display font-semibold text-sm ${col.color}`}>{col.label}</span>
                  </div>
                  <span className="text-text-muted text-xs bg-surface-raised border border-border px-2 py-0.5 rounded-full">
                    {kanban[col.id]?.length || 0}
                  </span>
                </div>

                {/* Cards */}
                {(kanban[col.id] || []).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => onDragStart(task.id, col.id)}
                    className="card p-3 cursor-grab active:cursor-grabbing active:opacity-50 active:scale-95
                               transition-all hover:border-border-strong hover:-translate-y-0.5 select-none"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-sm font-medium leading-snug">{task.title}</span>
                      <div className={`w-2 h-2 rounded-full shrink-0 mt-1 ${PRIORITY_DOT[task.priority] || 'bg-text-muted'}`} />
                    </div>
                    {task.assignee && (() => {
                      const m = team.find(t => t.id === task.assignee);
                      return m ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <Avatar name={m.name} size="sm" />
                          <span className="text-text-muted text-xs">{m.name}</span>
                        </div>
                      ) : null;
                    })()}
                    <div className="mt-2">
                      <Badge status={task.priority} />
                    </div>
                  </div>
                ))}

                {/* Empty drop zone */}
                {(kanban[col.id] || []).length === 0 && (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border rounded-xl text-text-muted text-xs py-6">
                    Drop here
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Time Logs ────────────────────────────────────────────────── */}
      {tab === 'timelogs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total hours',   val: `${totalHours}h`,              color: 'text-accent-cyan' },
              { label: 'Billable',      val: `${billableHours}h`,           color: 'text-accent-emerald' },
              { label: 'Non-billable',  val: `${totalHours - billableHours}h`, color: 'text-text-secondary' },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className={`font-display font-bold text-2xl ${s.color}`}>{s.val}</div>
                <div className="text-text-muted text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Log form */}
          <div className="card p-5">
            <h3 className="font-display font-semibold mb-4">Log Time</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <input value={newLog.description}
                  onChange={e => setNewLog(p => ({ ...p, description: e.target.value }))}
                  placeholder="What did you work on?" className="input" />
              </div>
              <input type="number" value={newLog.hours}
                onChange={e => setNewLog(p => ({ ...p, hours: e.target.value }))}
                placeholder="Hours (e.g. 2.5)" min="0.5" step="0.5" className="input" />
              <input type="date" value={newLog.date}
                onChange={e => setNewLog(p => ({ ...p, date: e.target.value }))}
                className="input" />
            </div>
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" checked={newLog.billable}
                  onChange={e => setNewLog(p => ({ ...p, billable: e.target.checked }))}
                  className="accent-accent-cyan" />
                Billable
              </label>
              <button onClick={addTimeLog} className="btn-primary py-2 text-sm">
                <PlusCircle size={14} /> Log time
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr_40px] px-5 py-3 border-b border-border
                            text-text-muted text-xs font-medium uppercase tracking-wider gap-4">
              {['Description', 'Date', 'Hours', 'Type', ''].map(h => <span key={h}>{h}</span>)}
            </div>
            {timeLogs.length === 0 ? (
              <div className="p-10 text-center text-text-muted text-sm">
                No time logged yet. Start tracking your hours above!
              </div>
            ) : timeLogs.map(log => (
              <div key={log.id}
                className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr_1fr_40px] px-5 py-3.5 gap-4
                           border-b border-border last:border-0 items-center">
                <span className="text-sm">{log.description}</span>
                <span className="text-sm text-text-secondary">{formatDate(log.date)}</span>
                <span className="text-sm font-medium">{log.hours}h</span>
                <span className={`text-xs font-medium ${log.billable ? 'text-accent-emerald' : 'text-text-muted'}`}>
                  {log.billable ? 'Billable' : 'Non-billable'}
                </span>
                <button onClick={() => setTimeLogs(p => p.filter(l => l.id !== log.id))}
                  className="p-1 rounded text-text-muted hover:text-accent-rose transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
