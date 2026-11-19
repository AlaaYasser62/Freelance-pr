import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const DEMO = [
    {
      label: "Freelancer Demo",
      email: "alex@freelance.dev",
      role: "freelancer",
    },
    { label: "Client Demo", email: "sarah@aetherlabs.io", role: "client" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(form.email, form.password, "freelancer");
    navigate("/role-select");
  }

  function demoLogin(demo) {
    setLoading(true);
    setTimeout(() => {
      login(demo.email, "demo", demo.role);
      navigate(
        demo.role === "freelancer" ? "/role-select" : "/portal/demo-token",
      );
    }, 600);
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-gradient-radial from-accent-cyan/5 via-transparent to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent-cyan flex items-center justify-center">
              <Zap size={17} className="text-bg-base" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg">FreelanceOS</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-text-secondary text-sm">
            Sign in to your workspace
          </p>
        </div>

        {/* Demo Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {DEMO.map((d) => (
            <button
              key={d.role}
              onClick={() => demoLogin(d)}
              className="btn-secondary text-xs py-2 justify-center font-semibold"
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-text-muted text-xs">or sign in with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-accent-rose text-sm">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-text-secondary text-xs font-medium">
              Email address
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="input pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-text-secondary text-xs font-medium">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-accent-cyan text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                className="input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
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
                <span>Sign in</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-accent-cyan hover:underline font-medium"
          >
            Create one free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
