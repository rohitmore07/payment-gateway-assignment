import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchTransactions, normalizeTransactionsResponse } from '../api/transactionService';
import { normalizeStatus, getTransactionDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const PAGE_SIZE = 10;

export function useTransactions() {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTransactions({ page: 1, limit: 100 });
      const { transactions } = normalizeTransactionsResponse(res);
      setRaw(transactions);
    } catch (err) {
      const msg = err.friendlyMessage || 'Failed to load transactions';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = [...raw];

    if (statusFilter !== 'all') {
      list = list.filter((t) => normalizeStatus(t.status) === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        [
          t.id,
          t.orderId,
          t.order_id,
          t.transaction_id,
          t.email,
          t.cardHolderName,
          t.card_holder_name,
          t.currency,
          t.status,
          t.amount,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      const av = a[sortKey] ?? getTransactionDate(a) ?? '';
      const bv = b[sortKey] ?? getTransactionDate(b) ?? '';
      if (sortKey === 'amount') {
        return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
      }
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [raw, search, statusFilter, sortKey, sortDir]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const stats = useMemo(() => {
    const totalTransactions = raw.length;
    let successVolume = 0;
    let successCount = 0;
    let failedCount = 0;

    raw.forEach((t) => {
      const status = normalizeStatus(t.status);
      const amount = Number(t.amount) || 0;

      if (status === 'success') {
        successCount += 1;
        successVolume += amount;
      }
      if (status === 'failed' || status === 'pending') {
        failedCount += 1;
      }
    });

    return { totalTransactions, successVolume, successCount, failedCount };
  }, [raw]);

  const statusChartData = useMemo(() => {
    const counts = { Success: 0, Failed: 0, Pending: 0 };
    raw.forEach((t) => {
      const s = normalizeStatus(t.status);
      if (s === 'success') counts.Success += 1;
      else if (s === 'failed') counts.Failed += 1;
      else counts.Pending += 1;
    });
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [raw]);

  const volumeOverTime = useMemo(() => {
    const map = {};
    raw.forEach((t) => {
      const dateStr = getTransactionDate(t);
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return;
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map[key] = (map[key] || 0) + (Number(t.amount) || 0);
    });
    return Object.entries(map).map(([date, volume]) => ({ date, volume }));
  }, [raw]);

  const currencyChartData = useMemo(() => {
    const map = {};
    raw.forEach((t) => {
      const c = (t.currency || 'USD').toUpperCase();
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [raw]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return {
    transactions: paginated,
    allFiltered: filtered,
    loading,
    error,
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
    stats,
    statusChartData,
    volumeOverTime,
    currencyChartData,
    reload: load,
  };
}
