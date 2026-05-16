import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import { normalizeStatus } from '../../utils/formatters';

const STATUS_UI = {
  success: {
    icon: CheckCircle2,
    title: 'Payment Successful',
    message: 'Your payment has been processed successfully.',
    color: 'text-emerald-500',
  },
  failed: {
    icon: XCircle,
    title: 'Payment Failed',
    message: 'We could not process your payment. Please try again.',
    color: 'text-red-500',
  },
  pending: {
    icon: Clock,
    title: 'Payment Pending',
    message: 'Your payment is being processed. You will be notified once complete.',
    color: 'text-amber-500',
  },
};

export default function StatusModal({ open, onClose, status, details }) {
  const key = normalizeStatus(status);
  const ui = STATUS_UI[key] || STATUS_UI.pending;
  const Icon = ui.icon;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center py-2">
        <Icon className={`h-16 w-16 ${ui.color} mb-4`} />
        <h3 className="text-xl font-bold mb-2">{ui.title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{ui.message}</p>
        {details && (
          <pre className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-left text-xs overflow-auto max-h-32 mb-4">
            {JSON.stringify(details, null, 2)}
          </pre>
        )}
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    </Modal>
  );
}
