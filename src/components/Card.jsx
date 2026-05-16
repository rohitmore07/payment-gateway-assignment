import { motion } from 'framer-motion';

export default function Card({ children, className = '', delay = 0, glow = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${glow ? 'panel-glow' : 'glass'} rounded-2xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
