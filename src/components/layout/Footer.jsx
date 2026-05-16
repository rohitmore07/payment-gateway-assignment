export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/40 py-8 dark:border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} <span className="text-gradient font-bold">AXIPAYS</span>
        </p>
        <p className="mt-1.5 text-xs text-slate-500">
          PCI-inspired security • HMAC-SHA256 • Enterprise-grade checkout
        </p>
      </div>
    </footer>
  );
}
