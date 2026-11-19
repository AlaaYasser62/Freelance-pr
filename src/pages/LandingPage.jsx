import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Kanban, FileText, Clock, Link as LinkIcon,
  ArrowRight, Star, Zap, CheckCircle, ChevronRight, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { features, testimonials } from '../data/mockData';

const ICONS = { LayoutDashboard, Users, Kanban, FileText, Clock, Link: LinkIcon };
const ACCENT = {
  cyan: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
  emerald: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
  amber: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
  blue: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
  rose: 'text-accent-rose bg-accent-rose/10 border-accent-rose/20',
};

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } },
};

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden">
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-cyan flex items-center justify-center">
              <Zap size={16} className="text-bg-base" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">FreelanceOS</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {['Features', 'Testimonials', 'Pricing'].map(label => (
              <a key={label} href={`#${label.toLowerCase()}`} className="btn-ghost text-sm">{label}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Sign in</Link>
            <Link to="/register" className="btn-primary">Get started <ArrowRight size={14} /></Link>
          </div>
          <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden px-4 pb-4 border-t border-border">
            <div className="flex flex-col gap-1 pt-3">
              {['Features', 'Testimonials', 'Pricing'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="btn-ghost justify-start">{l}</a>
              ))}
              <div className="flex gap-2 mt-2">
                <Link to="/login" className="btn-secondary flex-1 justify-center">Sign in</Link>
                <Link to="/register" className="btn-primary flex-1 justify-center">Get started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-accent-purple/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan text-sm font-medium mb-6"
          >
            <Star size={12} fill="currentColor" />
            Trusted by 2,400+ independent contractors
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
          >
            Run your freelance<br />
            <span className="gradient-text">business like a pro.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Projects, clients, invoices, and time tracking — unified in one beautifully designed workspace.
            Stop juggling tools. Start doing great work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <Link to="/register" className="btn-primary text-base px-7 py-3 w-full sm:w-auto justify-center shadow-glow-cyan">
              Start free — no card needed <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-7 py-3 w-full sm:w-auto justify-center">
              Sign in to dashboard
            </Link>
          </motion.div>

          {/* Dashboard preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden border border-border shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
          >
            <div className="bg-surface-raised border-b border-border p-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                {['bg-accent-rose', 'bg-accent-amber', 'bg-accent-emerald'].map((c, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${c} opacity-70`} />
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-bg-muted rounded-lg px-4 py-1 text-text-muted text-xs font-mono">app.freelanceos.io/dashboard</div>
              </div>
            </div>
            <div className="bg-bg-subtle p-6">
              {/* Mini dashboard preview */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Revenue', val: '$127K', color: 'text-accent-cyan' },
                  { label: 'Projects', val: '3 Active', color: 'text-accent-purple' },
                  { label: 'Clients', val: '5 Total', color: 'text-accent-emerald' },
                  { label: 'Hours', val: '284h', color: 'text-accent-amber' },
                ].map(s => (
                  <div key={s.label} className="card p-3 text-center">
                    <div className={`font-display font-bold text-lg ${s.color}`}>{s.val}</div>
                    <div className="text-text-muted text-xs">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 card p-4">
                  <div className="text-text-secondary text-xs mb-3 font-medium">Revenue Overview</div>
                  <div className="flex items-end gap-1 h-20">
                    {[35, 55, 42, 68, 58, 82, 74].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-accent-cyan/20" style={{ height: `${h}%` }}>
                        <div className="w-full rounded-sm bg-accent-cyan" style={{ height: `${i === 5 ? 100 : 60}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card p-4">
                  <div className="text-text-secondary text-xs mb-3 font-medium">Projects</div>
                  {['Design System', 'CMS Platform', 'Brand Refresh'].map((p, i) => (
                    <div key={p} className="flex items-center gap-2 mb-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-accent-cyan' : i === 1 ? 'bg-accent-purple' : 'bg-accent-amber'}`} />
                      <div className="text-xs text-text-secondary truncate">{p}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface text-text-secondary text-sm mb-4">
              <CheckCircle size={12} className="text-accent-emerald" />
              Everything you need
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Built for how you work</h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Every feature designed around the freelancer workflow — from proposal to payment.
            </p>
          </motion.div>

          <motion.div
            variants={stagger.container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map(f => {
              const Icon = ICONS[f.icon] || LayoutDashboard;
              return (
                <motion.div key={f.title} variants={stagger.item}
                  className="card card-hover p-6 group"
                >
                  <div className={`inline-flex p-2.5 rounded-xl border mb-4 ${ACCENT[f.color]}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{f.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-4 bg-bg-subtle">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Loved by freelancers</h2>
            <p className="text-text-secondary text-lg">Join thousands who've leveled up their workflow.</p>
          </motion.div>
          <motion.div
            variants={stagger.container} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {testimonials.map(t => (
              <motion.div key={t.id} variants={stagger.item} className="card p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-accent-amber" fill="currentColor" />)}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <div className="w-9 h-9 rounded-xl bg-surface-raised flex items-center justify-center font-display font-bold text-xs text-accent-cyan">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-text-muted text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="relative rounded-3xl overflow-hidden border border-accent-cyan/20 bg-gradient-to-br from-surface via-surface to-bg-muted p-12">
              <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/5 via-transparent to-transparent" />
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4 relative">
                Ready to take control<br />of your business?
              </h2>
              <p className="text-text-secondary mb-8 text-lg relative">
                Free forever. No credit card. Set up in under 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
                <Link to="/register" className="btn-primary text-base px-8 py-3 shadow-glow-cyan justify-center">
                  Create free account <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn-secondary text-base px-8 py-3 justify-center">
                  Sign in <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-cyan flex items-center justify-center">
              <Zap size={13} className="text-bg-base" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-text-secondary">FreelanceOS</span>
          </div>
          <p className="text-text-muted text-sm">© 2024 FreelanceOS. Built for independent professionals.</p>
          <div className="flex gap-4 text-text-muted text-sm">
            <a href="#" className="hover:text-text-secondary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-secondary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
