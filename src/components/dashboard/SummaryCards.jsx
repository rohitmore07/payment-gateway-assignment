import { Activity, CheckCircle2, DollarSign, XCircle } from 'lucide-react';
import { CardSkeleton } from '../Skeleton';
import { formatCurrency } from '../../utils/formatters';

const cards = [
  {
    key: 'totalTransactions',
    label: 'Total Transactions',
    icon: Activity,
    accent: 'from-brand-500 to-cyan-400',
    format: (v) => v,
  },
  {
    key: 'successVolume',
    label: 'Total Success Volume',
    icon: DollarSign,
    accent: 'from-emerald-500 to-teal-400',
    format: (v) => formatCurrency(v, 'USD'),
  },
  {
    key: 'successCount',
    label: 'Total Success Count',
    icon: CheckCircle2,
    accent: 'from-indigo-500 to-violet-400',
    format: (v) => v,
  },
  {
    key: 'failedCount',
    label: 'Total Failed Count',
    subtitle: 'Failed + Pending',
    icon: XCircle,
    accent: 'from-red-500 to-rose-400',
    format: (v) => v,
  },
];

export default function SummaryCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, subtitle, icon: Icon, accent, format }) => (
        <div key={key} className="stat-card group">
          <div className={`mb-4 h-1 w-12 rounded-full bg-gradient-to-r ${accent}`} />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
              {subtitle && (
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {subtitle}
                </p>
              )}
              <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {format(stats[key] ?? 0)}
              </p>
            </div>
            <div
              className={`shrink-0 rounded-xl bg-gradient-to-br ${accent} p-2.5 text-white shadow-lg`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
