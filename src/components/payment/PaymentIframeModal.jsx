import Modal from '../Modal';
import Button from '../Button';
import { normalizeStatus } from '../../utils/formatters';

export default function PaymentIframeModal({
  open,
  onClose,
  url,
  title = 'Complete Payment (iframe)',
  onStatusSelect,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="xl">
      {url ? (
        <>
          <iframe
            src={url}
            title="Payment gateway"
            className="h-[65vh] w-full rounded-xl border border-slate-200 dark:border-slate-700"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation"
          />
          <p className="mt-3 text-xs text-slate-500">
            After completing payment on the gateway, confirm your result below.
          </p>
          {onStatusSelect && (
            <div className="mt-4 flex flex-wrap gap-2">
              {['success', 'pending', 'failed'].map((s) => (
                <Button key={s} variant="secondary" size="sm" onClick={() => onStatusSelect(normalizeStatus(s))}>
                  Mark {s}
                </Button>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-500">No payment URL available.</p>
      )}
    </Modal>
  );
}
