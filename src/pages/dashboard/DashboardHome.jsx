import { motion } from 'framer-motion';
import {
  DollarSign, FolderKanban, Users, Clock,
  ArrowRight, CheckCircle, AlertTriangle, Send, CircleDollarSign, Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { StatCard, Badge, ProgressBar } from '../../components/ui/index';
import { dashStats, revenueData, recentActivity, upcomingDeadlines, projects } from '../../data/mockData';
import { formatCurrency, formatDate, daysUntil, getStatusColor } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';

const ACTIVITY_ICONS = {
  dollar: CircleDollarSign, chart: FolderKanban, user: Users,
  send: Send, check: CheckCircle, clock: Timer,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl border border-border p-3 text-sm">
      <p className="font-medium text-text-primary mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary capitalize">{p.name}:</span>
          <span className="font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function DashboardHome() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { icon: DollarSign, label: 'Total revenue', value: formatCurrency(dashStats.totalRevenue), change: dashStats.revenueGrowth, changeLabel: 'vs last month', color: 'cyan' },
    { icon: FolderKanban, label: 'Active projects', value: dashStats.activeProjects, change: dashStats.projectGrowth, changeLabel: 'new this month', color: 'purple' },
    { icon: Users, label: 'Total clients', value: dashStats.totalClients, change: dashStats.clientGrowth, changeLabel: 'vs last quarter', color: 'emerald' },
    { icon: Clock, label: 'Hours logged', value: `${dashStats.hoursLogged}h`, change: dashStats.hoursGrowth, changeLabel: 'this month', color: 'amber' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold">
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-text-secondary text-sm mt-1">Here's what's happening with your business today.</p>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.05} />)}
      </div>

      {/* ── Alert: Overdue invoices ── */}
      {dashStats.overdueInvoices > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-accent-rose/20 bg-accent-rose/5 text-accent-rose text-sm mb-6"
        >
          <AlertTriangle size={16} className="shrink-0" />
          <span>You have <strong>{formatCurrency(dashStats.overdueInvoices)}</strong> in overdue invoices.</span>
          <Link to="/dashboard/invoices" className="ml-auto text-xs font-medium underline hover:no-underline whitespace-nowrap">
            View invoices
          </Link>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* ── Revenue Chart ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-semibold">Revenue Overview</h2>
              <p className="text-text-muted text-xs mt-0.5">Last 7 months</p>
            </div>
            <div className="flex gap-3 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-cyan inline-block" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-purple inline-block" />Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3D" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#4A5A78', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4A5A78', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#00D4FF" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#00D4FF' }} />
              <Area type="monotone" dataKey="expenses" stroke="#8B5CF6" strokeWidth={2} fill="url(#expGrad)" dot={false} activeDot={{ r: 4, fill: '#8B5CF6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* ── Deadlines ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Upcoming Deadlines</h2>
            <Link to="/dashboard/projects" className="text-text-muted hover:text-accent-cyan text-xs flex items-center gap-1 transition-colors">
              All <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingDeadlines.map(d => {
              const days = daysUntil(d.dueDate);
              const urgent = days <= 7;
              return (
                <div key={d.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-raised border border-border hover:border-border-strong transition-colors">
                  <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${d.priority === 'critical' ? 'bg-accent-rose' : d.priority === 'high' ? 'bg-accent-amber' : 'bg-accent-blue'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{d.task}</div>
                    <div className="text-text-muted text-xs truncate">{d.project}</div>
                  </div>
                  <div className={`text-xs font-mono font-medium shrink-0 ${urgent ? 'text-accent-rose' : 'text-text-muted'}`}>
                    {days <= 0 ? 'Overdue' : `${days}d`}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── Active Projects ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Active Projects</h2>
            <Link to="/dashboard/projects" className="text-text-muted hover:text-accent-cyan text-xs flex items-center gap-1">All <ArrowRight size={11} /></Link>
          </div>
          <div className="flex flex-col gap-3">
            {projects.filter(p => p.status === 'in-progress').slice(0, 3).map(p => (
              <Link key={p.id} to={`/dashboard/projects/${p.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-raised transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm group-hover:text-accent-cyan transition-colors truncate">{p.name}</span>
                    <Badge status={p.priority} />
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={p.progress} size="sm" />
                    <span className="text-text-muted text-xs shrink-0">{p.progress}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium">{formatCurrency(p.budget)}</div>
                  <div className="text-text-muted text-xs">{p.client}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── Recent Activity ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <h2 className="font-display font-semibold mb-4">Recent Activity</h2>
          <div className="flex flex-col gap-4">
            {recentActivity.slice(0, 5).map((a, i) => {
              const Icon = ACTIVITY_ICONS[a.icon] || CheckCircle;
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-overlay flex items-center justify-center shrink-0 text-text-muted">
                    <Icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-secondary leading-snug">{a.text}</p>
                    <p className="text-text-muted text-xs mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
