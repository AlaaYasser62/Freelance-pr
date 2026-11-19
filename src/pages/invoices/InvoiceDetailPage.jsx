import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Send, Printer, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/index';
import { invoices } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

const STATUS_ICON = {
  paid: { icon: CheckCircle, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10 border-accent-emerald/20' },
  overdue: { icon: AlertTriangle, color: 'text-accent-rose', bg: 'bg-accent-rose/10 border-accent-rose/20' },
  sent: { icon: Clock, color: 'text-accent-blue', bg: 'bg-accent-blue/10 border-accent-blue/20' },
  draft: { icon: Clock, color: 'text-text-muted', bg: 'bg-surface border-border' },
};

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const invoice = invoices.find(i => i.id === id);

  if (!invoice) return (
    <div className="p-6 text-center">
      <p className="text-text-muted">Invoice not found.</p>
      <Link to="/dashboard/invoices" className="btn-primary mt-4">Back to invoices</Link>
    </div>
  );

  const si = STATUS_ICON[invoice.status] || STATUS_ICON.draft;
  const Icon = si.icon;

  function handleExportPDF() {
    // In a real app: use jsPDF or similar
    alert('PDF export would download the invoice. Integrate jsPDF for production use.');
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link to="/dashboard/invoices" className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors">
          <ArrowLeft size={15} /> Back to invoices
        </Link>
        <div className="flex gap-2">
          {invoice.status === 'draft' && (
            <button className="btn-secondary text-sm py-2"><Send size={14} /> Send invoice</button>
          )}
          <button onClick={handleExportPDF} className="btn-primary text-sm py-2">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        {/* Invoice header */}
        <div className="p-6 sm:p-8 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
                  <span className="text-accent-cyan font-display font-bold text-sm">F</span>
                </div>
                <span className="font-display font-bold text-xl">FreelanceOS</span>
              </div>
              <p className="text-text-muted text-sm">alex@freelanceos.io</p>
              <p className="text-text-muted text-sm">123 Studio Lane, SF, CA 94103</p>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-3xl text-text-primary mb-1">{invoice.id}</div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium ${si.bg} ${si.color}`}>
                <Icon size={14} />
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Bill to / details */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-border">
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Bill To</p>
            <p className="font-semibold">{invoice.client}</p>
            <p className="text-text-secondary text-sm">{invoice.project}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Issue Date</p>
            <p className="font-medium">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Due Date</p>
            <p className={`font-medium ${invoice.status === 'overdue' ? 'text-accent-rose' : ''}`}>
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Line items */}
        <div className="p-6 sm:p-8">
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b border-border">
                {['Description', 'Qty', 'Rate', 'Amount'].map(h => (
                  <th key={h} className={`pb-3 text-text-muted text-xs font-medium uppercase tracking-wider ${h === 'Description' ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3.5 text-sm">{item.description}</td>
                  <td className="py-3.5 text-sm text-right text-text-secondary">{item.qty}</td>
                  <td className="py-3.5 text-sm text-right text-text-secondary">{formatCurrency(item.rate)}</td>
                  <td className="py-3.5 text-sm font-medium text-right">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Tax (10%)</span>
                <span className="font-medium">{formatCurrency(invoice.tax)}</span>
              </div>
              <div className="flex justify-between pt-3 mt-1 border-t border-border">
                <span className="font-display font-bold text-lg">Total</span>
                <span className="font-display font-bold text-2xl text-accent-cyan">{formatCurrency(invoice.total)}</span>
              </div>
              {invoice.status === 'paid' && invoice.paidDate && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-sm mt-2">
                  <CheckCircle size={14} /> Paid on {formatDate(invoice.paidDate)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="p-4 rounded-xl bg-surface-raised border border-border">
              <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Notes</p>
              <p className="text-text-secondary text-sm">{invoice.notes}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action bar */}
      <div className="mt-4 card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-text-muted text-sm">
          {invoice.status === 'paid' ? '✅ Payment received' : invoice.status === 'overdue' ? '⚠️ Payment overdue — follow up with client' : '📧 Invoice ' + invoice.status}
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-ghost text-sm"><Printer size={14} /> Print</button>
          <button onClick={handleExportPDF} className="btn-primary text-sm py-2">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
