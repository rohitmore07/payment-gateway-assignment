import { STATUS_CONFIG } from '../utils/constants';
import { normalizeStatus } from '../utils/formatters';

export default function Badge({ status }) {
  const key = normalizeStatus(status);
  const config = STATUS_CONFIG[key] || STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${config.className}`}
    >
      {config.label}
    </span>
  );
}
