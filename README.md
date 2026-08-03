# Frosted Fork — Small Cakes & Sweet Treats

**Wildwood, FL** · [www.frostedforksweets.com](https://www.frostedforksweets.com)

Handcrafted Cake Bites, Dot Cakes, chocolate-covered treats, custom cakes, and party platters made fresh to order.

---

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Dev server → http://localhost:3001
npm run build        # Production build
npm run start        # Production server → http://localhost:3001
```

## Environment

Copy `.env.local` and fill in your Stripe keys for live payments:

```bash
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_SITE_URL=https://www.frostedforksweets.com
```

**Without Stripe keys**, checkout falls back to Order Request mode — orders are submitted without charging. Perfect for local development.

## Project Structure

```
app/                     # Next.js App Router pages
  page.tsx               # Home
  pick-your-cake/        # Flavor-first picker
  shop/                  # All products
  shop/[slug]/           # Product detail
  collections/[slug]/    # Category pages
  cart/                  # Full cart page
  checkout/              # Stripe checkout
  custom-orders/         # Custom cake & dessert table inquiry
  about/                 # Our Story
  contact/               # Contact + QR code
  faq/                   # FAQ
  build-your-own/        # Sweet Table builder
  api/order/             # Order submission endpoint
components/              # Shared UI components
data/                    # Editable content
  products.ts            # 🍰 Product catalog & prices
  content.ts             # 📝 Verbatim website copy
  site.ts                # 📍 Business info (phone, email, etc.)
lib/                     # Utilities
  cart.ts                # Zustand cart store
  payments.ts            # Stripe integration
  email.ts               # Email stub (wire Resend/SMTP here)
```

## Where to Edit

| What | File |
|---|---|
| Products, descriptions, prices | `data/products.ts` |
| Page copy (About, FAQ, etc.)   | `data/content.ts` |
| Phone, email, Instagram        | `data/site.ts` |
| Stripe keys                    | `.env.local` |
| Brand styling (colors, fonts)  | `app/globals.css` |

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** (utility-first styling)
- **Zustand** (cart state, persisted to localStorage)
- **Stripe** (live card payments)
- **QRCode** (dynamic QR generation)

## Build Status

- ✅ TypeScript — zero type errors
- ✅ `npm run build` — passes clean
- ✅ Dev server — http://localhost:3001
- ✅ All routes render

---

*Frosted Fork — Life is short. Eat dessert first.*
