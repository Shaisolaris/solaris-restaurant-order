# Solaris Kitchen — Online Ordering

A complete online ordering flow for an independent restaurant: menu browse with categories, slide-out cart, checkout with delivery/pickup toggle, and order confirmation. Works on mobile and desktop, persists the cart in localStorage so orders survive a refresh.

**Live demo:** https://shaisolaris.github.io/solaris-restaurant-order/

## What it shows

- **20-item menu** across 4 categories (Starters, Mains, Sides, Desserts) with popular and spicy badges
- **Add / remove** with per-item quantity controls, live cart count in the header
- **Slide-out cart drawer** from the right edge
- **Delivery vs pickup** toggle with different ETAs and fees
- **Full address form** with apt/suite, state, ZIP, and delivery instructions
- **Tip selector** (15/18/20/25%)
- **Order total math** — subtotal, delivery fee, 6.25% MA tax, tip, grand total
- **Cart persistence** via localStorage — refresh the page and your cart is still there
- **Dark mode** with localStorage persistence
- **Responsive** mobile-first layout

## Stack

- Next.js 15 (App Router, static export)
- React 19 + TypeScript
- Tailwind CSS 3
- Deployed to GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

## License

MIT.
