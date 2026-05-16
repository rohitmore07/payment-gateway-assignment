import { motion } from 'framer-motion';
import { Wifi } from 'lucide-react';
import { CARD_ICONS } from '../../utils/cardUtils';

export default function CardPreview({ cardHolder, cardNumber, expiryMonth, expiryYear, cardType }) {
  const displayNumber = cardNumber || '•••• •••• •••• ••••';
  const displayName = cardHolder || 'YOUR NAME';
  const expiry =
    expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear.slice(-2)}` : 'MM/YY';

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -12, scale: 0.96 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="animate-float relative aspect-[1.586] w-full max-w-[420px]"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-30 blur-2xl" aria-hidden />
      <div
        className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-card p-7 text-white shadow-2xl shadow-brand-900/40 ring-1 ring-white/20"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />

        <div className="relative flex items-start justify-between">
          <div className="h-10 w-14 rounded-md bg-gradient-to-br from-amber-200 to-amber-500 shadow-inner" />
          <Wifi className="h-6 w-6 rotate-90 text-white/70" />
        </div>

        <div className="relative">
          <p className="font-mono text-2xl tracking-[0.2em] sm:text-[1.65rem]">{displayNumber}</p>
        </div>

        <div className="relative flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
              Card Holder
            </p>
            <p className="truncate text-sm font-bold uppercase tracking-wide">{displayName}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
              Expires
            </p>
            <p className="font-mono text-sm font-bold">{expiry}</p>
          </div>
          <span className="rounded-lg bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {CARD_ICONS[cardType] || 'Card'}
          </span>
        </div>

        <p className="relative mt-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40">
          AXIPAYS
        </p>
      </div>
    </motion.div>
  );
}
