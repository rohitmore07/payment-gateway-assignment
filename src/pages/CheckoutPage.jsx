import { motion } from 'framer-motion';
import PaymentForm from '../components/payment/PaymentForm';

export default function CheckoutPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PaymentForm />
    </motion.div>
  );
}
