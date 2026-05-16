export function formatCurrency(amount, currency = 'USD') {
  const num = Number(amount);
  if (Number.isNaN(num)) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
  }
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatExpiry(month, year) {
  if (!month || !year) return '—';
  const mm = String(month).padStart(2, '0');
  const yyyy = String(year).length === 2 ? `20${year}` : String(year);
  return `${mm} / ${yyyy}`;
}

export function normalizeStatus(status) {
  if (!status) return 'pending';
  const s = String(status).toLowerCase();
  if (['success', 'successful', 'completed', 'approved'].includes(s)) return 'success';
  if (['failed', 'failure', 'declined', 'error'].includes(s)) return 'failed';
  return 'pending';
}

export function getTransactionDate(t) {
  return t?.createdAt || t?.created_at || t?.date || t?.timestamp;
}

export function exportToCsv(rows, filename = 'transactions.csv') {
  if (!rows?.length) return;

  const headers = Object.keys(rows[0]);
  const escape = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
