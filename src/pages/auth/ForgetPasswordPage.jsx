import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); 

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    setSubmitted(true); 
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent-cyan flex items-center justify-center">
              <Zap size={17} className="text-bg-base" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary">FreelanceOS</span>
          </Link>
          
          <h1 className="font-display text-3xl font-bold mb-2">
            {submitted ? 'Check your email' : 'Reset password'}
          </h1>
          <p className="text-text-secondary text-sm px-4">
            {submitted 
              ? `We've sent password reset instructions to ${email}`
              : "Enter your email and we'll send you a link to reset your password"
            }
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-sm">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-medium">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (error) setError(''); 
                  }}
                  className={`input pl-10 ${error ? 'border-accent-rose focus:border-accent-rose focus:ring-accent-rose/10' : ''}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center py-3 mt-1 shadow-glow-cyan disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-bg-base border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Send reset link</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        ) : (

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card p-8 flex flex-col items-center text-center gap-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center text-accent-emerald shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <CheckCircle size={32} />
            </div>
            
            <div>
              <h3 className="font-display font-semibold text-lg mb-1.5">Instructions Sent!</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Please check your inbox. If you don't receive it within a few minutes, check your spam folder.
              </p>
            </div>

            <button 
              onClick={() => setSubmitted(false)}
              className="btn-secondary w-full justify-center text-xs py-2.5 font-semibold"
            >
              Resend email
            </button>
          </motion.div>
        )}
        <p className="text-center text-text-muted text-sm mt-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan hover:underline font-medium transition-colors">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}