import { AppWindow, ExternalLink } from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';
import {
  getRedirectionUrl,
  redirectToPayment,
  openPaymentWindow,
} from '../../api/paymentService';

export default function PaymentRedirectDialog({
  open,
  onClose,
  response,
  onIframe,
}) {
  const url = getRedirectionUrl(response);

  if (!url) return null;

  return (
    <Modal open={open} onClose={onClose} title="Continue to payment" size="md">
      <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
        Your payment session is ready. Choose how you would like to complete checkout at the
        secure gateway.
      </p>
      <div className="flex flex-col gap-3">
        <Button
          className="w-full"
          onClick={() => {
            sessionStorage.setItem('axipays_pending_payment', '1');
            redirectToPayment(url);
          }}
        >
          <ExternalLink className="h-4 w-4" />
          Redirect in this window
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            openPaymentWindow(url);
            onClose();
          }}
        >
          <ExternalLink className="h-4 w-4" />
          Open in new tab
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            onIframe(url);
            onClose();
          }}
        >
          <AppWindow className="h-4 w-4" />
          Pay in iframe (bonus)
        </Button>
      </div>
    </Modal>
  );
}
