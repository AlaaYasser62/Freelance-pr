import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const PERKS = [
  'Free forever — no credit card',
  'Unlimited projects & clients',
  'Client portals included',
  'PDF invoice export',
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    register(form);
    navigate('/role-select');
  }

  const field = (key) => ({
    value: form[key],
    onChange: e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })); },
  });

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-radial from-accent-purple/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent-cyan flex items-center justify-center">
              <Zap size={17} className="text-bg-base" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg">FreelanceOS</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-text-secondary text-sm">Start managing your freelance work like a pro</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4 mb-4">
          {[
            { key: 'name', label: 'Full name', icon: User, type: 'text', placeholder: 'Alex Rivera' },
            { key: 'email', label: 'Email address', icon: Mail, type: 'email', placeholder: 'you@example.com' },
          ].map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">{label}</label>
              <div className="relative">
                <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type={type} placeholder={placeholder} {...field(key)} className={`input pl-10 ${errors[key] ? 'border-accent-rose focus:border-accent-rose focus:ring-accent-rose/10' : ''}`} />
              </div>
              {errors[key] && <p className="text-accent-rose text-xs">{errors[key]}</p>}
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-text-secondary text-xs font-medium">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                {...field('password')}
                className={`input pl-10 pr-10 ${errors.password ? 'border-accent-rose' : ''}`}
              />
              <button type="button" onClick={() => setShowPass(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-accent-rose text-xs">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary justify-center py-3 mt-1 shadow-glow-cyan disabled:opacity-60">
            {loading
              ? <div className="w-4 h-4 rounded-full border-2 border-bg-base border-t-transparent animate-spin" />
              : <><span>Create account</span><ArrowRight size={15} /></>}
          </button>
        </form>

        <div className="card p-4 mb-6">
          <div className="grid grid-cols-2 gap-2">
            {PERKS.map(p => (
              <div key={p} className="flex items-center gap-2 text-xs text-text-secondary">
                <CheckCircle size={12} className="text-accent-emerald shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-text-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-cyan hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
