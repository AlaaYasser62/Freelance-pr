import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ROLES = [
  {
    id: 'freelancer',
    icon: Briefcase,
    title: 'Freelancer',
    subtitle: 'I manage projects & clients',
    color: 'accent-cyan',
    border: 'border-accent-cyan/40 bg-accent-cyan/5',
    perks: ['Full dashboard access', 'Client management', 'Invoice creation', 'Project kanban', 'Time tracking', 'Revenue analytics'],
  },
  {
    id: 'client',
    icon: Building2,
    title: 'Client',
    subtitle: 'I review work & pay invoices',
    color: 'accent-purple',
    border: 'border-accent-purple/40 bg-accent-purple/5',
    perks: ['View assigned projects', 'Track progress live', 'Download invoices', 'PDF exports', 'Read-only portal', 'Shared via secure link'],
  },
];

export default function RoleSelectPage() {
  const { user, setRole } = useAuth();
  const navigate = useNavigate();

  function choose(role) {
    setRole(role);
    navigate(role === 'freelancer' ? '/dashboard' : '/portal/demo-token');
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/4 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-accent-cyan flex items-center justify-center mx-auto mb-5">
            <Zap size={22} className="text-bg-base" fill="currentColor" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">
            {user?.name ? `Welcome, ${user.name.split(' ')[0]}!` : 'Welcome!'}
          </h1>
          <p className="text-text-secondary text-lg">How would you like to use FreelanceOS?</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                onClick={() => choose(r.id)}
                className={`card p-6 text-left group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border ${r.border}`}
              >
                <div className={`inline-flex p-3 rounded-2xl border mb-4 text-${r.color} bg-${r.color}/10 border-${r.color}/20`}>
                  <Icon size={24} />
                </div>
                <h2 className="font-display text-xl font-bold mb-1">{r.title}</h2>
                <p className="text-text-secondary text-sm mb-5">{r.subtitle}</p>
                <ul className="flex flex-col gap-2 mb-6">
                  {r.perks.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle size={13} className={`text-${r.color} shrink-0`} />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className={`flex items-center gap-2 text-sm font-semibold text-${r.color}`}>
                  Enter as {r.title} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
