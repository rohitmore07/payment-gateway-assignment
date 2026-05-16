export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://payment-assignment.onrender.com';

export const HMAC_SECRET = import.meta.env.VITE_HMAC_SECRET || 'AXI2026';

export const PAYMENT_ENDPOINT = '/initiate-payment';
export const TRANSACTIONS_ENDPOINT = '/transactions';

export const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'AED', label: 'AED - UAE Dirham' },
];

export const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'IN', label: 'India' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
];

export const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const m = String(i + 1).padStart(2, '0');
  return { value: m, label: m };
});

export const YEARS = Array.from({ length: 15 }, (_, i) => {
  const y = String(new Date().getFullYear() + i);
  return { value: y, label: y };
});

export const STATUS_CONFIG = {
  success: { label: 'Success', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
};

export const CHART_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
