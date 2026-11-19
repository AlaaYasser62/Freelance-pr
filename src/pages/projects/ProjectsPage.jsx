import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Grid3X3, List, Calendar, DollarSign, Users, ArrowRight, FolderKanban } from 'lucide-react';
import { Badge, ProgressBar, EmptyState, PageHeader, Avatar } from '../../components/ui/index';
import { projects } from '../../data/mockData';
import { formatCurrency, formatDate, daysUntil, getStatusColor } from '../../lib/utils';

const STATUS_FILTERS = ['all', 'in-progress', 'review', 'paused', 'completed'];

const PROGRESS_COLOR = p => p >= 80 ? 'emerald' : p >= 50 ? 'cyan' : p >= 25 ? 'amber' : 'rose';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [view, setView] = useState('grid');

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || p.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} total projects`}
        action={<button className="btn-primary"><Plus size={15} /> New project</button>}
      />

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects…" className="input pl-9" />
        </div>
        <div className="flex flex-wrap gap-1 p-1 bg-surface rounded-xl border border-border self-start">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize whitespace-nowrap ${status === s ? 'bg-surface-raised text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border self-start ml-auto">
          <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-surface-raised text-text-primary' : 'text-text-muted hover:text-text-primary'}`}><Grid3X3 size={15} /></button>
          <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-surface-raised text-text-primary' : 'text-text-muted hover:text-text-primary'}`}><List size={15} /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects found" description="Try adjusting your search or create a new project." />
      ) : view === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id}
              layout
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/dashboard/projects/${p.id}`}
                className="card card-hover p-5 flex flex-col gap-4 block h-full"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-base mb-1 truncate hover:text-accent-cyan transition-colors">{p.name}</h3>
                    <p className="text-text-muted text-xs">{p.client}</p>
                  </div>
                  <Badge status={p.status} />
                </div>

                <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">{p.description}</p>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-text-muted text-xs">Progress</span>
                    <span className="text-text-secondary text-xs font-medium">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} color={PROGRESS_COLOR(p.progress)} />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-lg bg-surface-overlay text-text-muted text-xs border border-border">{tag}</span>
                  ))}
                </div>

                <div className="pt-3 border-t border-border grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-text-muted text-xs mb-0.5 flex items-center gap-1"><DollarSign size={10} />Budget</div>
                    <div className="text-sm font-medium">{formatCurrency(p.budget)}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs mb-0.5 flex items-center gap-1"><Calendar size={10} />Due</div>
                    <div className="text-sm font-medium">{formatDate(p.dueDate)}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs mb-0.5 flex items-center gap-1"><Users size={10} />Tasks</div>
                    <div className="text-sm font-medium">{p.tasks.done}/{p.tasks.total}</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div layout className="card overflow-hidden">
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] px-5 py-3 border-b border-border text-text-muted text-xs font-medium uppercase tracking-wider gap-4">
            {['Project', 'Status', 'Progress', 'Budget', 'Due date', ''].map(h => <span key={h}>{h}</span>)}
          </div>
          {filtered.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
            >
              <Link to={`/dashboard/projects/${p.id}`}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_40px] px-5 py-4 gap-3 sm:gap-4 border-b border-border last:border-0 hover:bg-surface-raised/50 transition-colors items-center group"
              >
                <div>
                  <div className="font-medium text-sm group-hover:text-accent-cyan transition-colors">{p.name}</div>
                  <div className="text-text-muted text-xs">{p.client}</div>
                </div>
                <div><Badge status={p.status} /></div>
                <div className="flex items-center gap-2">
                  <ProgressBar value={p.progress} size="sm" color={PROGRESS_COLOR(p.progress)} />
                  <span className="text-xs text-text-muted shrink-0">{p.progress}%</span>
                </div>
                <div className="text-sm font-medium">{formatCurrency(p.budget)}</div>
                <div className="text-sm text-text-secondary">{formatDate(p.dueDate)}</div>
                <div className="hidden sm:flex justify-end">
                  <ArrowRight size={14} className="text-text-muted group-hover:text-accent-cyan transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
