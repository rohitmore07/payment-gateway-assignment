import CryptoJS from 'crypto-js';
import { writeFileSync } from 'fs';

function reverseString(value = '') {
  return String(value).split('').reverse().join('');
}

function buildHashMessage(email, cardNumber) {
  const digits = String(cardNumber).replace(/\D/g, '');
  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);
  const cardKey = reverseString(`${first6}${last4}`);
  const emailKey = reverseString(String(email).trim().toLowerCase());
  return `${emailKey}AXIPAYS${cardKey}`.toUpperCase();
}

function generateHash(email, cardNumber) {
  return CryptoJS.HmacSHA256(buildHashMessage(email, cardNumber), 'AXI2026')
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();
}

const payload = {
  cardHolderName: 'John Doe',
  email: 'test@example.com',
  cardNumber: '4242424242424242',
  expiryMonth: '12',
  expiryYear: '2028',
  cardCVC: '123',
  amount: 99.99,
  currency: 'USD',
  country: 'US',
  address: '123 Main St, NYC',
  phone: '5551234567',
};

const hash = generateHash(payload.email, payload.cardNumber);
const lines = [`Hash: ${hash}`, `Message: ${buildHashMessage(payload.email, payload.cardNumber)}`];

const res = await fetch('https://payment-assignment.onrender.com/initiate-payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Hash: hash },
  body: JSON.stringify(payload),
});

lines.push(`Status: ${res.status}`);
lines.push(await res.text());

writeFileSync('scripts/probe-result.txt', lines.join('\n'), 'utf8');
console.log('done');
