import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentSchema } from '../../schemas/paymentSchema';
import { initiatePayment, getRedirectionUrl } from '../../api/paymentService';
import {
  detectCardType,
  formatCardNumber,
  maskCardDisplay,
  stripNonDigits,
  getCvvLength,
} from '../../utils/cardUtils';
import { COUNTRIES, CURRENCIES, MONTHS, YEARS } from '../../utils/constants';
import { normalizeStatus } from '../../utils/formatters';
import Input from '../Input';
import Select from '../Select';
import Button from '../Button';
import CardPreview from './CardPreview';
import StatusModal from './StatusModal';
import PaymentIframeModal from './PaymentIframeModal';
import PaymentRedirectDialog from './PaymentRedirectDialog';

const defaultValues = {
  card_holder_name: '',
  email: '',
  card_number: '',
  expiry_month: '',
  expiry_year: '',
  cvv: '',
  amount: '',
  currency: 'USD',
  country: 'US',
  address: '',
  phone: '',
};

export default function PaymentForm() {
  const [loading, setLoading] = useState(false);
  const [statusModal, setStatusModal] = useState({ open: false, status: '', details: null });
  const [iframeModal, setIframeModal] = useState({ open: false, url: '' });
  const [redirectDialog, setRedirectDialog] = useState({ open: false, response: null });
  const [showCvv, setShowCvv] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues,
    mode: 'onChange',
  });

  const watched = watch();
  const cardType = detectCardType(watched.card_number);
  const cvvMax = getCvvLength(cardType);

  const onCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value, cardType);
    setValue('card_number', formatted, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await initiatePayment(data);
      const status = normalizeStatus(response?.status);
      const redirectUrl = getRedirectionUrl(response);

      if (redirectUrl) {
        sessionStorage.setItem('axipays_last_payment', JSON.stringify(response));
        setRedirectDialog({ open: true, response });
        toast.success('Payment initiated — choose how to continue');
        return;
      }

      setStatusModal({ open: true, status, details: response });
      toast.success(`Payment ${status}`);
    } catch (err) {
      const msg = err.friendlyMessage || 'Payment initiation failed';
      toast.error(msg);
      setStatusModal({
        open: true,
        status: 'failed',
        details: err.response?.data || { message: msg },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-10 text-center lg:hidden">
        <p className="section-title">Checkout</p>
        <h1 className="page-title mt-2">Pay with confidence</h1>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
        <div className="flex justify-center lg:sticky lg:top-28 max-lg:order-first">
          <CardPreview
            cardHolder={watched.card_holder_name}
            cardNumber={
              watched.card_number
                ? maskCardDisplay(watched.card_number)
                : '•••• •••• •••• ••••'
            }
            expiryMonth={watched.expiry_month}
            expiryYear={watched.expiry_year}
            cardType={cardType}
          />
        </div>

        <motion.form
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="panel-glow space-y-8"
          noValidate
        >
          <div className="hidden lg:block">
            <p className="section-title">Section 1 & 2</p>
            <h1 className="page-title mt-2">Payment checkout</h1>
            <p className="page-subtitle mt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                <Lock className="h-3.5 w-3.5" />
                Luhn validated • Hash header • Masked card data
              </span>
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Card Holder Name"
              icon={User}
              placeholder="John Doe"
              error={errors.card_holder_name?.message}
              {...register('card_holder_name')}
            />
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <Input
            label="Card Number"
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            autoComplete="cc-number"
            error={errors.card_number?.message}
            hint={cardType !== 'unknown' ? `Detected: ${cardType}` : undefined}
            {...register('card_number', { onChange: onCardNumberChange })}
          />

          <div className="grid gap-4 grid-cols-3">
            <Select
              label="Expiry Month"
              placeholder="MM"
              options={MONTHS}
              error={errors.expiry_month?.message}
              {...register('expiry_month')}
            />
            <Select
              label="Expiry Year"
              placeholder="YYYY"
              options={YEARS}
              error={errors.expiry_year?.message}
              {...register('expiry_year')}
            />
            <div>
              <label className="label-base">CVV</label>
              <input
                type={showCvv ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={cvvMax}
                placeholder={'•'.repeat(cvvMax)}
                className={`input-base font-mono ${errors.cvv ? 'border-red-500' : ''}`}
                autoComplete="cc-csc"
                onFocus={() => setShowCvv(true)}
                onBlur={() => setShowCvv(false)}
                {...register('cvv', {
                  onChange: (e) => {
                    const v = stripNonDigits(e.target.value).slice(0, cvvMax);
                    setValue('cvv', v, { shouldValidate: true });
                  },
                })}
              />
              {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="99.99"
              error={errors.amount?.message}
              {...register('amount')}
            />
            <Select
              label="Currency"
              options={CURRENCIES}
              error={errors.currency?.message}
              {...register('currency')}
            />
          </div>

          <Select
            label="Country"
            options={COUNTRIES}
            error={errors.country?.message}
            {...register('country')}
          />

          <Input
            label="Billing Address"
            icon={MapPin}
            placeholder="123 Main St, City"
            error={errors.address?.message}
            {...register('address')}
          />

          <Input
            label="Phone"
            icon={Phone}
            type="tel"
            placeholder="+1 555 000 0000"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Button type="submit" size="lg" loading={loading} className="w-full">
            Pay Securely
          </Button>
        </motion.form>
      </div>

      <StatusModal
        open={statusModal.open}
        onClose={() => setStatusModal((s) => ({ ...s, open: false }))}
        status={statusModal.status}
        details={statusModal.details}
      />

      <PaymentRedirectDialog
        open={redirectDialog.open}
        onClose={() => setRedirectDialog({ open: false, response: null })}
        response={redirectDialog.response}
        onIframe={(url) => setIframeModal({ open: true, url })}
      />

      <PaymentIframeModal
        open={iframeModal.open}
        onClose={() => setIframeModal({ open: false, url: '' })}
        url={iframeModal.url}
        onStatusSelect={(status) => {
          setIframeModal({ open: false, url: '' });
          setStatusModal({ open: true, status, details: { status } });
        }}
      />
    </>
  );
}
