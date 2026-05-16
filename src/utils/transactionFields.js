/** Normalise API record (camelCase or snake_case) for UI */
export function getOrderId(t) {
  return t?.orderId || t?.order_id || t?.transaction_id || t?.id || '—';
}

export function getCardNumber(t) {
  return t?.cardNumber || t?.card_number || '';
}

export function getExpiryMonth(t) {
  return t?.expiryMonth || t?.expiry_month || '';
}

export function getExpiryYear(t) {
  return t?.expiryYear || t?.expiry_year || '';
}

export function getCreatedAt(t) {
  return t?.createdAt || t?.created_at || t?.date || t?.timestamp;
}
