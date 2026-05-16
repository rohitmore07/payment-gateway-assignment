import { z } from 'zod';
import { luhnCheck, detectCardType, getCvvLength, stripNonDigits } from '../utils/cardUtils';

const cardRefine = (data, ctx) => {
  const digits = stripNonDigits(data.card_number);
  const cardType = detectCardType(digits);

  if (!luhnCheck(digits)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid card number',
      path: ['card_number'],
    });
  }

  const expectedCvv = getCvvLength(cardType);
  if (stripNonDigits(data.cvv).length !== expectedCvv) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `CVV must be ${expectedCvv} digits`,
      path: ['cvv'],
    });
  }

  const month = parseInt(data.expiry_month, 10);
  const year = parseInt(data.expiry_year, 10);
  const now = new Date();
  const expiry = new Date(year, month, 0);

  if (expiry < new Date(now.getFullYear(), now.getMonth(), 1)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Card has expired',
      path: ['expiry_year'],
    });
  }
};

export const paymentSchema = z
  .object({
    card_holder_name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name is too long')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Invalid characters in name'),
    email: z.string().email('Enter a valid email'),
    card_number: z.string().min(13, 'Enter a valid card number'),
    expiry_month: z.string().min(1, 'Select expiry month'),
    expiry_year: z.string().min(4, 'Select expiry year'),
    cvv: z.string().min(3, 'Enter CVV'),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, 'Amount must be greater than 0'),
    currency: z.string().min(1, 'Select currency'),
    country: z.string().min(1, 'Select country'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    phone: z
      .string()
      .min(8, 'Enter a valid phone number')
      .refine((v) => stripNonDigits(v).length >= 8, 'Phone number is too short'),
  })
  .superRefine(cardRefine);
