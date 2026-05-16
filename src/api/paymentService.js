import axiosInstance from './axiosInstance';
import { PAYMENT_ENDPOINT } from '../utils/constants';
import { generatePaymentHash } from '../utils/hmac';
import { stripNonDigits } from '../utils/cardUtils';

/**
 * Payload shape matches GET /transactions response (camelCase).
 * @see https://payment-assignment.onrender.com/transactions
 */
export function buildPaymentPayload(formData) {
  const amount = parseFloat(String(formData.amount).replace(/,/g, ''));

  return {
    cardHolderName: formData.card_holder_name.trim(),
    email: formData.email.trim().toLowerCase(),
    cardNumber: stripNonDigits(formData.card_number),
    expiryMonth: String(formData.expiry_month).padStart(2, '0'),
    expiryYear: String(formData.expiry_year),
    cardCVC: stripNonDigits(formData.cvv),
    amount: Number.isFinite(amount) ? amount : 0,
    currency: formData.currency,
    country: formData.country,
    address: formData.address.trim(),
    phone: stripNonDigits(formData.phone),
  };
}

export async function initiatePayment(formData) {
  const payload = buildPaymentPayload(formData);
  const hash = generatePaymentHash(formData.email, formData.card_number);

  const { data } = await axiosInstance.post(PAYMENT_ENDPOINT, payload, {
    headers: { Hash: hash },
  });

  return data;
}

export function getRedirectionUrl(response) {
  return response?.redirection_url || response?.redirectionUrl || response?.redirect_url || null;
}

export function redirectToPayment(url) {
  window.location.assign(url);
}

export function openPaymentWindow(url) {
  return window.open(url, '_blank', 'noopener,noreferrer,width=480,height=720');
}
