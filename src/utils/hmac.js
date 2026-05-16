import CryptoJS from 'crypto-js';
import { HMAC_SECRET } from './constants';
import { stripNonDigits } from './cardUtils';

/**
 * AXIPAYS assignment — Hash header (HMAC-SHA256, uppercase hex):
 * 1. first6 + last4 from card number (10-digit string)
 * 2. Reverse that 10-digit string
 * 3. Reverse the email string
 * 4. message = reverse(email) + "AXIPAYS" + reverse(first6+last4)
 * 5. Uppercase the message
 * 6. HMAC-SHA256(uppercaseMessage, secret AXI2026) → uppercase hex
 */
export function reverseString(value = '') {
  return String(value).split('').reverse().join('');
}

export function buildHashMessage(email, cardNumber) {
  const digits = stripNonDigits(cardNumber);
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);
  const cardKey = reverseString(`${first6}${last4}`);
  const emailKey = reverseString(String(email).trim().toLowerCase());

  return `${emailKey}AXIPAYS${cardKey}`.toUpperCase();
}

export function generatePaymentHash(email, cardNumber, secret = HMAC_SECRET) {
  const message = buildHashMessage(email, cardNumber);
  return CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex).toUpperCase();
}
