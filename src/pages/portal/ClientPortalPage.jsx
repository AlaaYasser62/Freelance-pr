import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap, FolderKanban, FileText, Download, Eye,
  CheckCircle, Clock, AlertCircle, ExternalLink, LogOut
} from 'lucide-react';
import { Badge, ProgressBar, Avatar } from '../../components/ui/index';
import { clients, projects, invoices } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

// For demo, show client c1's data
const PORTAL_CLIENT = clients[0];
const CLIENT_PROJECTS = projects.filter(p => p.clientId === PORTAL_CLIENT.id);
const CLIENT_INVOICES = invoices.filter(i => i.clientId === PORTAL_CLIENT.id);

export default function ClientPortalPage() {
  const [tab, setTab] = useState('projects');

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="border-b border-border glass-strong sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-cyan flex items-center justify-center">
              <Zap size={15} className="text-bg-base" fill="currentColor" />
            </div>
            <span className="font-display font-bold">FreelanceOS</span>
            <span className="hidden sm:inline text-text-muted text-sm">/ Client Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Avatar name={PORTAL_CLIENT.contact} size="sm" />
              <div>
                <div className="font-medium text-xs">{PORTAL_CLIENT.contact}</div>
                <div className="text-text-muted text-xs">{PORTAL_CLIENT.name}</div>
              </div>
            </div>
            <Link to="/" className="btn-ghost text-sm py-1.5 text-text-muted"><LogOut size={14} /></Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
            <span className="text-accent-emerald text-xs font-medium">Portal active</span>
          </div>
          <h1 className="font-display text-3xl font-bold">
            Welcome back, {PORTAL_CLIENT.contact.split(' ')[0]}
          </h1>
          <p className="text-text-secondary mt-1">Here's an overview of your active projects and invoices.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Active projects', val: CLIENT_PROJECTS.filter(p => p.status === 'in-progress').length, icon: FolderKanban, color: 'text-accent-cyan' },
            { label: 'Open invoices', val: CLIENT_INVOICES.filter(i => i.status === 'sent').length, icon: FileText, color: 'text-accent-amber' },
            { label: 'Total spent', val: formatCurrency(CLIENT_INVOICES.filter(i => i.status === 'paid').reduce((a, i) => a + i.total, 0)), icon: CheckCircle, color: 'text-accent-emerald' },
          ].map(s => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-4">
              <div className={`flex items-center gap-2 mb-2 ${s.color}`}>
                <s.icon size={15} />
                <span className="text-xs text-text-muted">{s.label}</span>
              </div>
              <div className={`font-display font-bold text-2xl ${s.color}`}>{s.val}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border mb-6 self-start w-fit">
          {[{ id: 'projects', label: 'Projects', icon: FolderKanban }, { id: 'invoices', label: 'Invoices', icon: FileText }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-surface-raised text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {tab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            {CLIENT_PROJECTS.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="card p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-display font-semibold text-lg">{p.name}</h3>
                    <p className="text-text-secondary text-sm mt-0.5">{p.description}</p>
                  </div>
                  <Badge status={p.status} />
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-muted text-xs">Completion</span>
                    <span className="text-text-secondary text-sm font-medium">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} size="md" color={p.progress >= 70 ? 'emerald' : 'cyan'} />
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border text-sm">
                  <div>
                    <div className="text-text-muted text-xs mb-0.5">Tasks done</div>
                    <div className="font-medium">{p.tasks.done}/{p.tasks.total}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs mb-0.5">Due date</div>
                    <div className="font-medium">{formatDate(p.dueDate)}</div>
                  </div>
                  <div>
                    <div className="text-text-muted text-xs mb-0.5">Budget</div>
                    <div className="font-medium">{formatCurrency(p.budget)}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-lg bg-surface-overlay text-text-muted text-xs border border-border">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Invoices Tab */}
        {tab === 'invoices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
            {CLIENT_INVOICES.map((inv, i) => {
              const isPaid = inv.status === 'paid';
              const isOverdue = inv.status === 'overdue';
              return (
                <motion.div key={inv.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="card p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-xl border ${isPaid ? 'border-accent-emerald/20 bg-accent-emerald/10 text-accent-emerald' : isOverdue ? 'border-accent-rose/20 bg-accent-rose/10 text-accent-rose' : 'border-accent-blue/20 bg-accent-blue/10 text-accent-blue'}`}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-sm font-medium text-accent-cyan">{inv.id}</span>
                          <Badge status={inv.status} />
                        </div>
                        <div className="text-text-secondary text-sm">{inv.project}</div>
                        <div className="text-text-muted text-xs">Issued {formatDate(inv.issueDate)} · Due {formatDate(inv.dueDate)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-display font-bold text-2xl">{formatCurrency(inv.total)}</div>
                        {isPaid && <div className="text-accent-emerald text-xs">Paid {formatDate(inv.paidDate)}</div>}
                        {isOverdue && <div className="text-accent-rose text-xs">Payment overdue</div>}
                      </div>
                      <button
                        onClick={() => alert('PDF download — integrate jsPDF for production')}
                        className="btn-secondary py-2 text-sm flex items-center gap-2 shrink-0"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <p className="text-center text-text-muted text-xs mt-12">
          This portal is read-only. For questions, contact your freelancer directly.
        </p>
      </div>
    </div>
  );
}
