# AXIPAYS Technical Assignment

**Live demo:** https://axiflow-payment-gateway.vercel.app/
---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router 7 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Charts | Recharts |
| Animation | Framer Motion |
| Crypto | crypto-js (HMAC-SHA256) |

---

## Assignment coverage

### Section 1 — Payment checkout (`/`)

All required fields with real-time validation:

- Card holder name, email, card number, expiry (month/year), CVV, amount, currency, country, address, phone
- **Luhn algorithm** validation before submit
- **Card number** masked display (first 6 + last 4 on preview)
- **CVV** password/masked input
- Card type detection (Visa, Mastercard, Amex, etc.)

### Section 2 — API integration

**Endpoint:** `POST https://payment-assignment.onrender.com/initiate-payment`

**Headers:**

```
Content-Type: application/json
Hash: <HMAC-SHA256 uppercase hex>
```

**Hash generation (exact assignment spec):**

1. `first6` = first 6 digits of card, `last4` = last 4 digits  
2. `cardKey` = reverse(`first6` + `last4`)  
3. `emailKey` = reverse(email)  
4. `message` = (`emailKey` + `AXIPAYS` + `cardKey`).toUpperCase()  
5. `Hash` = HMAC-SHA256(`message`, secret `AXI2026`) as **uppercase hex**

Implementation: `src/utils/hmac.js` → used in `src/api/paymentService.js`

**Response handling:**

- Parse JSON → read `redirection_url`
- Choose: redirect same window / new tab / **iframe (bonus)**
- Callback route `/payment/callback` shows **Success / Failed / Pending** modal

### Section 3 — Dashboard (`/dashboard`)

**Endpoint:** `GET https://payment-assignment.onrender.com/transactions?page=1&limit=100`

**Summary cards:**

- Total Transactions  
- Total Success Volume (sum of successful amounts)  
- Total Success Count  
- Total Failed Count (**Failed + Pending**)

**Charts:**

- Transaction status breakdown (donut)  
- Volume over time (line)  
- Currency distribution (donut)

**Transaction table columns:**

| Column | Notes |
|--------|--------|
| Order ID | Unique id |
| Card Number | Masked: first 6 + last 4 |
| Email | Cardholder email |
| Expiry | e.g. `08 / 2027` |
| Card CVC | Always `***` |
| Amount | Formatted |
| Currency | USD, EUR, etc. |
| Status | Pending / Success / Failed badges |

Features: search, status filter, sort, pagination, CSV export, skeleton loaders, theme toggle.

---

## Project structure

```
src/
├── api/
│   ├── axiosInstance.js      # Base client
│   ├── paymentService.js     # POST initiate + redirect helpers
│   └── transactionService.js # GET transactions
├── components/
│   ├── dashboard/            # SummaryCards, Charts, Table
│   ├── layout/                 # Header, Footer, Layout
│   ├── payment/                # Form, modals, card preview
│   ├── Button.jsx, Input.jsx, …
├── context/ThemeContext.jsx
├── hooks/useTransactions.js
├── pages/                      # Checkout, Dashboard, Callback, 404
├── schemas/paymentSchema.js    # Zod + Luhn
└── utils/
    ├── hmac.js                 # Assignment hash algorithm
    ├── cardUtils.js            # Luhn, masking
    └── formatters.js
```

---

## Security decisions

- Sensitive fields **never** shown in full on UI (card: first6+last4, CVV: `***`)
- Hash sent in **`Hash` header**, not in JSON body
- HMAC secret from env (`VITE_HMAC_SECRET`), default `AXI2026` for assignment
- Raw card/CVV only sent to API over HTTPS as required by integration (not logged to console)

---

## Getting started

```bash
cd axipays-app
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

### Environment

```env
VITE_API_BASE_URL=https://payment-assignment.onrender.com
VITE_HMAC_SECRET=AXI2026
```

### Build

```bash
npm run build
npm run preview
```

---

## Deployment

### Vercel / Netlify

- Build: `npm run build`  
- Output: `dist`  
- SPA rewrite: all routes → `index.html` (see `vercel.json`)  
- Set env vars in dashboard  

---

## Hash example (manual check)

For email `test@example.com` and card `4242424242424242`:

```
first6+last4 = "4242424242"
reverse(card) = "2424242424"
reverse(email) = "moc.elpmaxe@tset"
message (uppercase) = "MOC.ELPMAXE@TSETAXIPAYS2424242424"
Hash = HMAC-SHA256(message, "AXI2026") → uppercase hex
```

---

## Routes

| Path | Description |
|------|-------------|
| `/` | Checkout |
| `/dashboard` | Analytics + transactions |
| `/payment/callback` | Return URL handler + status modal |

---

## Assumptions

- **POST body uses camelCase** matching `GET /transactions` (`cardHolderName`, `cardCVC`, `cardNumber`, etc.)  
- Transaction list uses `orderId` — normalised in UI  
- Success volume summed in USD display when mixed currencies exist (assignment does not specify FX)  
- `redirection_url` is the primary continuation path after initiate  
