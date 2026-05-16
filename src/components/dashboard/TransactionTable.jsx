import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import Badge from '../Badge';
import Button from '../Button';
import { TableSkeleton } from '../Skeleton';
import {
  formatCurrency,
  formatExpiry,
  exportToCsv,
  normalizeStatus,
} from '../../utils/formatters';
import { maskCardDisplay, maskCvvDisplay } from '../../utils/cardUtils';
import {
  getOrderId,
  getCardNumber,
  getExpiryMonth,
  getExpiryYear,
} from '../../utils/transactionFields';

function SortHeader({ label, sortKey, current, dir, onSort }) {
  const active = current === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-left font-semibold hover:text-brand-600 transition-colors"
    >
      {label}
      {active && (dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
    </button>
  );
}

export default function TransactionTable({
  transactions,
  allFiltered,
  loading,
  page,
  setPage,
  totalPages,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortKey,
  sortDir,
  toggleSort,
}) {
  const handleExport = () => {
    const rows = allFiltered.map((t) => ({
      order_id: getOrderId(t),
      card_number: maskCardDisplay(getCardNumber(t)),
      email: t.email,
      expiry: formatExpiry(getExpiryMonth(t), getExpiryYear(t)),
      cvc: maskCvvDisplay(),
      amount: t.amount,
      currency: t.currency,
      status: normalizeStatus(t.status),
    }));
    exportToCsv(rows);
  };

  if (loading) return <TableSkeleton rows={8} />;

  return (
    <div className="panel-glow overflow-hidden !p-0">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search by order ID, email, status..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-base pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'success', 'failed', 'pending'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`chip capitalize ${statusFilter === s ? 'chip-active' : 'chip-inactive'}`}
            >
              {s}
            </button>
          ))}
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-900/50">
              <th className="px-4 py-3 text-left">
                <SortHeader
                  label="Order ID"
                  sortKey="orderId"
                  current={sortKey}
                  dir={sortDir}
                  onSort={toggleSort}
                />
              </th>
              <th className="px-4 py-3 text-left">Card Number</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Expiry</th>
              <th className="px-4 py-3 text-left">Card CVC</th>
              <th className="px-4 py-3 text-left">
                <SortHeader
                  label="Amount"
                  sortKey="amount"
                  current={sortKey}
                  dir={sortDir}
                  onSort={toggleSort}
                />
              </th>
              <th className="px-4 py-3 text-left">Currency</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={getOrderId(t)}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    {getOrderId(t)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tracking-wide">
                    {maskCardDisplay(getCardNumber(t))}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.email || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                    {formatExpiry(getExpiryMonth(t), getExpiryYear(t))}
                  </td>
                  <td className="px-4 py-3 font-mono tracking-widest text-slate-500">
                    {maskCvvDisplay()}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(t.amount, t.currency)}</td>
                  <td className="px-4 py-3 font-medium uppercase">{t.currency || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge status={t.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
        <p className="text-sm text-slate-500">
          Page {page} of {totalPages} · {allFiltered.length} records
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
