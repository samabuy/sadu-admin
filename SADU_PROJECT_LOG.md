# SADU Project Log
## سدو — Project Build Summary

**Date:** June 2026  
**Built by:** Claude (Anthropic) + Claude Code  
**Developer:** Saleh  
**Owner:** Friend (SADU brand owner)  
**Domain:** sadu.beauty  

---

## Project Overview

SADU is a luxury UAE perfume retailer selling international brands (Dior, Tom Ford, Xerjoff, Amouage, Creed etc.) with delivery across all 7 UAE Emirates. The project consists of three interconnected systems sharing one Supabase database.

---

## System Architecture

### 1. Mobile App — `/Users/saleh/SADU/sadu314`
- **Framework:** React Native + Expo SDK 51
- **Language:** TypeScript (strict mode)
- **Navigation:** Expo Router v3
- **State:** Zustand + TanStack Query
- **Backend:** Supabase
- **i18n:** i18next (Arabic default, English toggle)
- **Bundle ID:** `com.sadubeauty.app`
- **EAS Project:** `@samabuy/sadu`

### 2. Admin Dashboard + Website — `/Users/saleh/SADU/sadu-admin`
- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Supabase (same project)
- **Deployment:** Netlify
- **GitHub:** `samabuy/sadu-admin`

### 3. Database — Supabase
- **Project:** SADU's Project
- **Region:** West EU (Frankfurt)
- **URL:** `https://bhlgzpeoowwsssvtigcq.supabase.co`
- **Tables:** products, product_notes, orders, order_items, profiles, cart_items, wishlist, reviews, loyalty, delivery_tracking

---

## URLs

| Service | URL |
|---|---|
| Public Website | https://sadu.beauty |
| Admin Dashboard | https://admin.sadu.beauty/admin |
| Netlify (website) | https://sadu-beauty.netlify.app |
| Netlify (admin) | https://sadu-admin-dashboard.netlify.app |
| GitHub | https://github.com/samabuy/sadu-admin |
| Supabase | https://supabase.com (SADU's Project) |

---

## Color System

| Token | Hex | Usage |
|---|---|---|
| bg.primary | #080706 | Main background |
| bg.secondary | #12100E | Card background |
| bg.elevated | #1C1814 | Elevated surfaces |
| gold.primary | #C9A84C | CTA, icons, borders |
| gold.soft | #E7C67A | Hover states |
| gold.dark | #8B6914 | Pressed states |
| text.primary | #F6EFE2 | Ivory — main text |
| text.secondary | #9A8F7A | Muted gray |
| error | #B54747 | Error states |
| success | #3F7D58 | Success states |

---

## Typography

| Font | Usage |
|---|---|
| Cairo-Regular | Arabic body text |
| Cairo-Bold | Arabic headings |
| CormorantGaramond-Medium | English display/hero |
| Inter | English UI |

Font files location: `assets/fonts/`

---

## Mobile App Screens (19 screens)

| Screen | File | Status |
|---|---|---|
| Splash | `app/splash.tsx` | ✅ |
| Onboarding | `app/onboarding.tsx` | ✅ |
| Home | `app/(tabs)/home.tsx` | ✅ |
| Shop | `app/(tabs)/shop.tsx` | ✅ |
| Discover | `app/(tabs)/discover.tsx` | ✅ |
| Wishlist | `app/(tabs)/wishlist.tsx` | ✅ |
| Profile | `app/(tabs)/profile.tsx` | ✅ |
| Product Detail | `app/product/[id].tsx` | ✅ |
| Cart | `app/cart.tsx` | ✅ |
| Checkout | `app/checkout.tsx` | ✅ |
| Order Confirmation | `app/order-confirmation.tsx` | ✅ |
| Order Tracking | `app/tracking/[id].tsx` | ✅ |
| Quiz | `app/quiz.tsx` | ✅ |
| SADU Club | `app/sadu-club.tsx` | ✅ |
| Search | `app/search.tsx` | ✅ |
| Auth | `app/auth.tsx` | ✅ |

---

## Admin Dashboard Pages (10 pages)

| Route | Access |
|---|---|
| /admin | Login (public) |
| /admin/dashboard | Admin + Manager |
| /admin/products | Admin (edit) / Manager (view) |
| /admin/products/new | Admin only |
| /admin/products/[id] | Admin only |
| /admin/orders | Admin + Manager |
| /admin/orders/[id] | Admin (cancel) / Manager (status) |
| /admin/customers | Admin (edit) / Manager (view) |
| /admin/discounts | Admin only |
| /admin/reports | Admin only |

### Role System
- **admin** — full access
- **manager** — view orders, update delivery status
- **customer** — no admin access

### Set admin role SQL:
```sql
INSERT INTO profiles (id, email, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'your@email.com'),
  'your@email.com',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

## Website Pages (14 pages)

| Route | Description |
|---|---|
| / | Home — slider, categories, bestsellers |
| /collections/all | All products with filters |
| /collections/men | Men's fragrances |
| /collections/women | Women's fragrances |
| /collections/unisex | Unisex fragrances |
| /collections/new-arrivals | New arrivals |
| /brands | Brands grid |
| /products/[slug] | Product detail page |
| /cart | Shopping cart |
| /checkout | 3-step checkout |
| /order-confirmation/[orderNumber] | Success page |
| /track-order | Order tracking |
| /account | Login + order history |
| /sadu-club | Loyalty tiers |

---

## Database Schema

### Key Tables

**products**
```sql
id, name_en, name_ar, slug, description_en, description_ar,
scent_story_en, scent_story_ar, base_price, sale_price,
category, scent_family, gender, occasion, strength,
longevity, projection, season, sizes (jsonb), image_url,
gallery_urls, is_best_seller, is_new_arrival, is_limited_edition,
is_active, rating, review_count, created_at
```

**orders**
```sql
id, order_number, user_id, customer_name, phone, email,
address (jsonb), delivery_instructions, payment_method,
payment_status, delivery_status, subtotal, delivery_fee,
discount, total, gift_wrapping, gift_message, promo_code, created_at
```

**loyalty**
```sql
id, user_id, points, tier (nasij/sadu/aqeel), birthday,
referral_code, created_at
```

### Loyalty Tiers
| Tier | Arabic | Points |
|---|---|---|
| nasij | نسيج | 0–1,999 |
| sadu | سدو | 2,000–4,999 |
| aqeel | عقيل | 5,000+ |

---

## Product Catalogue

- **Total products:** 71
- **Status:** All active (`is_active = true`)
- **Prices:** AED 0 — needs manual update
- **Images:** Placeholder — needs upload
- **Gender distribution:** 60 unisex, 5 men, 5 women

### Activate/Deactivate Products
```sql
-- Activate single product
UPDATE products SET is_active = true WHERE slug = 'product-slug';

-- Deactivate single product  
UPDATE products SET is_active = false WHERE slug = 'product-slug';

-- Activate all
UPDATE products SET is_active = true;
```

---

## Logo Assets

All logos: `assets/images/logos/`

| Folder | Usage |
|---|---|
| `app_icons_black_background/` | App Store icon |
| `website_black_background/` | Splash screen, dark backgrounds |
| `transparent_logo/transparent_png/` | In-app UI, headers |
| `website_transparent_png/` | Web use only |
| `source/` | Master files — do not use directly |

### Key Logo Files for App
| Use | Path |
|---|---|
| App Store icon | `app_icons_black_background/SADU314_app_1024x1024.png` |
| Splash background | `website_black_background/SADU314_web_black_2048x2048.png` (if exists) |
| In-app logo | `transparent_logo/transparent_png/SADU314_transparent_256x256.png` |
| Header (32px) | `transparent_logo/transparent_png/SADU314_transparent_32x32.png` |
| SADU Club (96px) | `transparent_logo/transparent_png/SADU314_transparent_96x96.png` |

### SADU Club Tier Backgrounds
Location: `assets/images/club/`
- `tier-bronze.png`
- `tier-silver.png`
- `tier-gold.png`
- `tier-platinum.png`
- `tier-elite.png`

---

## Environment Variables

### Mobile App — `/Users/saleh/SADU/sadu314/.env.local`
```
EXPO_PUBLIC_SUPABASE_URL=https://bhlgzpeoowwsssvtigcq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

### Admin/Website — `/Users/saleh/SADU/sadu-admin/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://bhlgzpeoowwsssvtigcq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_APP_URL=https://admin.sadu.beauty
```

---

## Payment Status

| Method | Status | Notes |
|---|---|---|
| Cash on Delivery | ✅ Working | End to end |
| Card (Tap Payments) | ❌ Placeholder | Needs Tap account |
| Apple Pay | ❌ Placeholder | Needs Tap account |
| Tabby/Tamara BNPL | ❌ Not built | V2 |

### To activate Tap Payments:
1. Sign up at tap.company
2. Get `sk_test_...` and `pk_test_...`
3. Add to `.env.local`
4. Tell Claude Code to wire up `src/lib/payments.ts`

---

## Delivery

| Courier | Status |
|---|---|
| Aramex | Placeholder only |
| Quiqup | Placeholder only |
| Shipa | Placeholder only |

### Order Tracking Stages
1. Order Received
2. Payment Confirmed
3. Preparing Your Perfume
4. Packed
5. Courier Assigned
6. Out for Delivery
7. Delivered
8. Review Requested

---

## Running the Projects

### Mobile App
```bash
cd /Users/saleh/SADU/sadu314
npx expo start          # Development with Metro
npx expo start --ios    # Open iOS simulator
eas build --profile development --platform ios  # Build for device
```

### Admin + Website (local)
```bash
cd /Users/saleh/SADU/sadu-admin
npm run dev             # Opens at http://localhost:3000
```

### Deploy Website + Admin
```bash
cd /Users/saleh/SADU/sadu-admin
git add .
git commit -m "your message"
git push origin main    # Netlify auto-deploys
```

---

## What's Pending Before Launch

### Critical (must fix before launch)
- [ ] Set real prices for all products in admin dashboard
- [ ] Upload product images via admin dashboard
- [ ] Tap Payments integration (card + Apple Pay)
- [ ] WhatsApp number — replace +971554955153 with real number
- [ ] Remove "AED 0" from showing to customers (hide price if 0)

### Important
- [ ] Connect Supabase to mobile app live data (partially done)
- [ ] WhatsApp order confirmations via Wati.io
- [ ] Real courier integration (Aramex API)
- [ ] Push notifications setup

### Nice to have (V2)
- [ ] Reviews system end to end
- [ ] SADU Club points redemption at checkout
- [ ] Gift experience flow
- [ ] Tabby/Tamara BNPL
- [ ] Algolia search
- [ ] Admin web dashboard accessible to friend

---

## Brand Copy

**Arabic tagline:** عطور تعبّر عن الهوية... وتُخلّد الأثر

**Hero headline:**
- Arabic: أرقى العطور العالمية الفاخرة
- English: The World's Finest Luxury Fragrances

**Hero subline:**
- Arabic: أفضل الماركات العالمية في مكان واحد — تُوصَّل إليك
- English: The world's best brands in one place — delivered to you

**WhatsApp:** +971554955153 *(replace before launch)*

---

## Key Decisions Made

1. **SADU sells international brands** — not its own perfumes (Dior, Tom Ford, Xerjoff, Amouage, Creed etc.)
2. **Arabic is the primary language** — English is a toggle option
3. **Dark-first design** — black background, gold accents
4. **Admin dashboard is senior** — all product/order management goes through admin, never direct Supabase
5. **Never hard delete products with orders** — deactivate instead
6. **COD works now** — card/Apple Pay needs Tap Payments account
7. **Bundle ID:** `com.sadubeauty.app` (com.sadu.app was taken)
8. **No "314" in UI** — removed from all visible text, kept in code identifiers only

---

## Notes for Claude Code Sessions

Always start every Claude Code session with:
```
pwd
```
Confirm you are in the correct project folder before making any changes.

- Mobile app: `/Users/saleh/SADU/sadu314`
- Admin + website: `/Users/saleh/SADU/sadu-admin`

Never work on both projects in the same session without confirming the directory.
