import { Link, useLocation } from 'react-router-dom';
import { CreditCard, LayoutDashboard, Moon, Shield, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const nav = [
  { to: '/', label: 'Checkout', icon: CreditCard },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Header() {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 glass dark:border-slate-700/40">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-sm font-bold text-white shadow-glow-sm transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              AXI<span className="text-gradient">PAYS</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:block">
              Secure Payments
            </span>
          </div>
        </Link>

        <nav className="flex items-center rounded-2xl border border-slate-200/80 bg-white/50 p-1 dark:border-slate-700/60 dark:bg-slate-900/50">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? 'nav-link-active' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-slate-800"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200/80 bg-white/60 p-2.5 text-slate-600 shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
