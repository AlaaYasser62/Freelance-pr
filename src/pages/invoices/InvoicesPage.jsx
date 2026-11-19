import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, ArrowRight, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge, EmptyState, PageHeader } from '../../components/ui/index';
import { invoices } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

const STATUS_FILTERS = ['all', 'draft', 'sent', 'paid', 'overdue'];

const STAT_DEFS = [
  { label: 'Total invoiced', key: 'total', filter: null, icon: DollarSign, color: 'text-accent-cyan' },
  { label: 'Paid', key: 'paid', filter: 'paid', icon: CheckCircle, color: 'text-accent-emerald' },
  { label: 'Pending', key: 'sent', filter: 'sent', icon: Clock, color: 'text-accent-blue' },
  { label: 'Overdue', key: 'overdue', filter: 'overdue', icon: AlertCircle, color: 'text-accent-rose' },
];

export default function InvoicesPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.project.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'all' || inv.status === status;
    return matchSearch && matchStatus;
  });

  const totals = {
    total: invoices.reduce((a, i) => a + i.total, 0),
    paid: invoices.filter(i => i.status === 'paid').reduce((a, i) => a + i.total, 0),
    sent: invoices.filter(i => i.status === 'sent').reduce((a, i) => a + i.total, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((a, i) => a + i.total, 0),
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Invoices"
        subtitle={`${invoices.length} invoices total`}
        action={<button className="btn-primary"><Plus size={15} /> New invoice</button>}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {STAT_DEFS.map(s => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => setStatus(s.filter || 'all')}
            className={`card p-4 cursor-pointer transition-all hover:border-border-strong ${status === (s.filter || 'all') ? 'border-border-strong bg-surface-raised' : ''}`}
          >
            <div className={`flex items-center gap-2 mb-2 ${s.color}`}>
              <s.icon size={15} />
              <span className="text-xs font-medium">{s.label}</span>
            </div>
            <div className={`font-display font-bold text-xl ${s.color}`}>{formatCurrency(totals[s.key])}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices…" className="input pl-9" />
        </div>
        <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border self-start">
          {STATUS_FILTERS.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${status === s ? 'bg-surface-raised text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No invoices found" description="Create your first invoice to get paid." />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
          {/* Desktop */}
          <div className="hidden sm:grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_1fr_40px] px-5 py-3 border-b border-border text-text-muted text-xs font-medium uppercase tracking-wider gap-4">
            {['Invoice', 'Project', 'Client', 'Amount', 'Due', 'Status', ''].map(h => <span key={h}>{h}</span>)}
          </div>
          <div>
            {filtered.map((inv, i) => (
              <motion.div key={inv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                <Link
                  to={`/dashboard/invoices/${inv.id}`}
                  className="hidden sm:grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_1fr_40px] px-5 py-4 gap-4 border-b border-border last:border-0 hover:bg-surface-raised/50 transition-colors items-center group"
                >
                  <span className="font-mono text-sm text-accent-cyan">{inv.id}</span>
                  <span className="text-sm truncate">{inv.project}</span>
                  <span className="text-sm text-text-secondary">{inv.client}</span>
                  <span className="text-sm font-medium">{formatCurrency(inv.total)}</span>
                  <span className={`text-sm ${inv.status === 'overdue' ? 'text-accent-rose' : 'text-text-secondary'}`}>{formatDate(inv.dueDate)}</span>
                  <Badge status={inv.status} />
                  <ArrowRight size={14} className="text-text-muted group-hover:text-accent-cyan transition-colors" />
                </Link>
                {/* Mobile */}
                <Link to={`/dashboard/invoices/${inv.id}`} className="sm:hidden flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-surface-raised/50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-sm text-accent-cyan">{inv.id}</span>
                      <Badge status={inv.status} />
                    </div>
                    <div className="text-sm font-medium">{inv.client}</div>
                    <div className="text-text-muted text-xs">{inv.project}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display font-bold text-base">{formatCurrency(inv.total)}</span>
                      <span className="text-text-muted text-xs">Due {formatDate(inv.dueDate)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
