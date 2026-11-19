import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function daysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export function getStatusColor(status) {
  const map = {
    'active': 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    'inactive': 'text-text-muted bg-surface border-border',
    'in-progress': 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    'review': 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
    'done': 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    'completed': 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    'paused': 'text-text-muted bg-surface border-border',
    'paid': 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    'sent': 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    'overdue': 'text-accent-rose bg-accent-rose/10 border-accent-rose/20',
    'draft': 'text-text-muted bg-surface border-border',
    'high': 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
    'medium': 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
    'low': 'text-text-secondary bg-surface border-border',
    'critical': 'text-accent-rose bg-accent-rose/10 border-accent-rose/20',
  };
  return map[status] || 'text-text-secondary bg-surface border-border';
}

export function getStatusLabel(status) {
  return status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function generatePortalToken(clientId) {
  return btoa(clientId + ':portal:' + Date.now()).replace(/=/g, '');
}

export function truncate(str, n = 40) {
  return str?.length > n ? str.substring(0, n) + '…' : str;
}
