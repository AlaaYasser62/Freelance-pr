import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '../../lib/utils';

// ─── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ status, className = '' }) {
  return (
    <span className={`badge border ${getStatusColor(status)} ${className}`}>
      {getStatusLabel(status)}
    </span>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'bg-accent-cyan/20 text-accent-cyan',
  'bg-accent-purple/20 text-accent-purple',
  'bg-accent-emerald/20 text-accent-emerald',
  'bg-accent-amber/20 text-accent-amber',
  'bg-accent-rose/20 text-accent-rose',
  'bg-accent-blue/20 text-accent-blue',
];

export function Avatar({ name, size = 'md', className = '' }) {
  const initials = name?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
  const colorIdx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const sizeClasses = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base' };
  return (
    <div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center font-display font-bold shrink-0 ${AVATAR_COLORS[colorIdx]} ${className}`}>
      {initials}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, change, changeLabel, color = 'cyan', delay = 0 }) {
  const colors = {
    cyan: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
    purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
    emerald: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    amber: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
  };
  const isPos = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card card-hover"
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
          <Icon size={18} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPos ? 'text-accent-emerald' : 'text-accent-rose'}`}>
          {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <div className="font-display text-2xl font-bold text-text-primary">{value}</div>
        <div className="text-text-muted text-xs mt-0.5">{label}</div>
      </div>
      {changeLabel && <div className="text-text-muted text-xs">{changeLabel}</div>}
    </motion.div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = 'cyan', size = 'md' }) {
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' };
  const colors = {
    cyan: 'bg-accent-cyan', purple: 'bg-accent-purple',
    emerald: 'bg-accent-emerald', amber: 'bg-accent-amber', rose: 'bg-accent-rose',
  };
  return (
    <div className={`w-full bg-surface-overlay rounded-full ${heights[size]}`}>
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`${heights[size]} rounded-full ${colors[color]}`}
      />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`skeleton animate-shimmer ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-border flex items-center justify-center mb-4 text-text-muted">
        <Icon size={24} />
      </div>
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-text-muted text-sm max-w-xs mb-6">{description}</p>
      {action}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full ${width} card border-border-strong shadow-[0_40px_80px_rgba(0,0,0,0.7)] max-h-[90vh] flex flex-col`}
          >
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <h2 className="font-display font-semibold text-lg">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
export function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            active === tab.id
              ? 'bg-surface-raised text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab.icon && <tab.icon size={15} />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
