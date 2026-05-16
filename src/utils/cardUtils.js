export const CARD_PATTERNS = {
  visa: /^4/,
  mastercard: /^(5[1-5]|2[2-7])/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/,
  diners: /^3(?:0[0-5]|[68])/,
  jcb: /^(?:2131|1800|35)/,
};

export const CARD_ICONS = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  discover: 'Discover',
  diners: 'Diners',
  jcb: 'JCB',
  unknown: 'Card',
};

export function stripNonDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

export function luhnCheck(cardNumber) {
  const digits = stripNonDigits(cardNumber);
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = parseInt(digits[i], 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function detectCardType(cardNumber) {
  const digits = stripNonDigits(cardNumber);
  if (!digits) return 'unknown';

  for (const [type, pattern] of Object.entries(CARD_PATTERNS)) {
    if (pattern.test(digits)) return type;
  }
  return 'unknown';
}

export function getCvvLength(cardType) {
  return cardType === 'amex' ? 4 : 3;
}

export function formatCardNumber(value, cardType) {
  const digits = stripNonDigits(value);
  const maxLen = cardType === 'amex' ? 15 : 16;
  const trimmed = digits.slice(0, maxLen);

  if (cardType === 'amex') {
    return trimmed.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    );
  }

  return trimmed.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/** Assignment: masked display — first 6 + last 4 only */
export function maskCardFirst6Last4(cardNumber) {
  const digits = stripNonDigits(cardNumber);
  if (digits.length < 10) {
    return digits.replace(/\d/g, '•');
  }
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);
  const maskLen = Math.max(0, digits.length - 10);
  const middle = '•'.repeat(maskLen);
  return `${first6}${middle}${last4}`;
}

/** Formatted masked card for UI: 424242 •••••• 4242 */
export function maskCardDisplay(cardNumber) {
  const masked = maskCardFirst6Last4(cardNumber);
  if (masked.length <= 10) return masked;
  const first6 = masked.slice(0, 6);
  const rest = masked.slice(6, -4);
  const last4 = masked.slice(-4);
  return `${first6} ${rest.replace(/•/g, '•')} ${last4}`.replace(/\s+/g, ' ').trim();
}

export function maskCvvDisplay() {
  return '***';
}

export function maskEmail(email) {
  if (!email || !email.includes('@')) return email || '—';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `**@${domain}`;
  return `${user[0]}${'•'.repeat(Math.min(user.length - 2, 4))}${user[user.length - 1]}@${domain}`;
}
