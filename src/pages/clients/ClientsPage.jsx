import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MoreHorizontal, Mail, Phone, Pencil, Trash2, ExternalLink, Users } from 'lucide-react';
import { Badge, Modal, EmptyState, PageHeader, Avatar } from '../../components/ui/index';
import { clients as initialClients } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';

const EMPTY_FORM = { name: '', contact: '', email: '', phone: '', country: '', industry: '', notes: '', status: 'active' };

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [menuOpen, setMenuOpen] = useState(null);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() { setEditingClient(null); setForm(EMPTY_FORM); setModalOpen(true); }
  function openEdit(c) { setEditingClient(c); setForm({ ...c }); setModalOpen(true); }

  function handleSave() {
    if (!form.name || !form.email) return;
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...form } : c));
    } else {
      setClients(prev => [...prev, { ...form, id: `c${Date.now()}`, avatar: form.name.substring(0, 2).toUpperCase(), totalProjects: 0, totalRevenue: 0, joinedAt: new Date().toISOString().split('T')[0] }]);
    }
    setModalOpen(false);
  }

  function handleDelete(id) {
    setClients(prev => prev.filter(c => c.id !== id));
    setMenuOpen(null);
  }

  const field = key => ({ value: form[key] || '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} total clients`}
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus size={15} /> Add client
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…" className="input pl-9" />
        </div>
        <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border self-start">
          {['all', 'active', 'inactive'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? 'bg-surface-raised text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No clients found" description="Try adjusting your search or add a new client." action={<button onClick={openAdd} className="btn-primary"><Plus size={15} /> Add client</button>} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Client', 'Contact', 'Projects', 'Revenue', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-text-muted text-xs font-medium uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr key={c.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="border-b border-border last:border-0 hover:bg-surface-raised/50 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} />
                        <div>
                          <div className="font-medium text-sm">{c.name}</div>
                          <div className="text-text-muted text-xs">{c.industry}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm">{c.contact}</div>
                      <div className="text-text-muted text-xs flex items-center gap-1"><Mail size={10} />{c.email}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium">{c.totalProjects}</td>
                    <td className="px-5 py-4 text-sm font-medium text-accent-emerald">{formatCurrency(c.totalRevenue)}</td>
                    <td className="px-5 py-4"><Badge status={c.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-surface-overlay text-text-muted hover:text-text-primary transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-accent-rose/10 text-text-muted hover:text-accent-rose transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-border">
            {filtered.map(c => (
              <div key={c.id} className="p-4 flex items-start gap-3">
                <Avatar name={c.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">{c.name}</span>
                    <Badge status={c.status} />
                  </div>
                  <div className="text-text-muted text-xs mt-0.5">{c.email}</div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
                    <span>{c.totalProjects} projects</span>
                    <span className="text-accent-emerald">{formatCurrency(c.totalRevenue)}</span>
                  </div>
                </div>
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary"><Pencil size={14} /></button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingClient ? 'Edit Client' : 'Add Client'}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Company name *</label>
              <input {...field('name')} className="input" placeholder="Acme Corp" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Contact name</label>
              <input {...field('contact')} className="input" placeholder="Jane Smith" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Email *</label>
              <input {...field('email')} type="email" className="input" placeholder="jane@acme.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Phone</label>
              <input {...field('phone')} className="input" placeholder="+1 555 000 0000" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Country</label>
              <input {...field('country')} className="input" placeholder="United States" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Industry</label>
              <input {...field('industry')} className="input" placeholder="Technology" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Status</label>
              <select {...field('status')} className="input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Notes</label>
              <textarea {...field('notes')} rows={3} className="input resize-none" placeholder="Any notes about this client…" />
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-border">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleSave} className="btn-primary flex-1 justify-center">{editingClient ? 'Save changes' : 'Add client'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
