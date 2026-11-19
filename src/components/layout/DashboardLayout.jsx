import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FolderKanban, FileText, Settings,
  Bell, Search, Menu, X, LogOut, ChevronRight, Zap, Moon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/clients', icon: Users, label: 'Clients' },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 flex items-center gap-2.5 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-accent-cyan flex items-center justify-center shrink-0">
          <Zap size={15} className="text-bg-base" fill="currentColor" />
        </div>
        <span className="font-display font-bold text-base">FreelanceOS</span>
        <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden p-1 text-text-muted hover:text-text-primary">
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-text-muted text-xs font-medium px-3 pb-2 pt-1 uppercase tracking-wider">Workspace</p>
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
        <div className="mt-4">
          <p className="text-text-muted text-xs font-medium px-3 pb-2 uppercase tracking-wider">Account</p>
          <button className="nav-item w-full">
            <Settings size={17} />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-raised transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-xl bg-surface-overlay flex items-center justify-center font-display font-bold text-xs text-accent-cyan shrink-0">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{user?.name}</div>
            <div className="text-text-muted text-xs truncate">{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-text-muted hover:text-accent-rose">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border bg-bg-subtle flex-col">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-bg-base/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-56 bg-bg-subtle border-r border-border flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="h-14 shrink-0 border-b border-border bg-bg-subtle/80 backdrop-blur-sm flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-raised">
            <Menu size={18} />
          </button>

          {/* Breadcrumb on desktop */}
          <div className="hidden md:flex items-center gap-1.5 text-text-muted text-sm">
            <span>FreelanceOS</span>
            <ChevronRight size={13} />
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="input text-xs py-2 pl-8 pr-3 bg-surface"
                placeholder="Search projects, clients…"
                onFocus={() => setSearchOpen(true)} onBlur={() => setSearchOpen(false)}
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <button className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-rose rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-surface-overlay ml-1 flex items-center justify-center font-display font-bold text-xs text-accent-cyan cursor-pointer hover:bg-surface-raised transition-colors">
              {user?.avatar}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
