import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusModal from '../components/payment/StatusModal';
import Button from '../components/Button';
import { normalizeStatus } from '../utils/formatters';

export default function PaymentCallbackPage() {
  const [params] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(true);

  const status =
    params.get('status') ||
    params.get('payment_status') ||
    params.get('result') ||
    'pending';

  const transactionId =
    params.get('transaction_id') ||
    params.get('order_id') ||
    params.get('id');

  useEffect(() => {
    setModalOpen(true);
    sessionStorage.removeItem('axipays_pending_payment');
  }, [status]);

  const details = Object.fromEntries(params.entries());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg py-16 text-center"
    >
      <p className="section-title">Payment result</p>
      <h1 className="page-title mt-2">Callback received</h1>
      <p className="page-subtitle mt-2">
        {transactionId ? `Order: ${transactionId}` : 'Review your payment status below.'}
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/">
          <Button>New payment</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="secondary">View dashboard</Button>
        </Link>
      </div>

      <StatusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        status={normalizeStatus(status)}
        details={details}
      />
    </motion.div>
  );
}
