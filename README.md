# An Roastery — Specialty Coffee Storefront, POS, Barista KDS & Floor Operations Suite

Frontend application for **An Roastery**, pairing an editorial specialty coffee storefront with a high-velocity **Hospitality POS, Kitchen Display System (KDS), Spatial Floor Studio, and Cashier Drawer Reconciliation Suite**.

> **Companion Backend Repository**: [`CoffeeShopSolution`](https://github.com/hoang-IT-eng/CoffeeShopSolution) (ASP.NET Core 8, EF Core SQL Server, SignalR `KitchenHub`, ASP.NET Identity RBAC).

---

## Highlights & Capabilities

### 1. Operational Shell & Bilingual Workspace (`EN` / `VI`)
- **Grouped Operational Zones**:
  - **Floor & Rush**: Shift Pulse (`/dashboard`), POS Counter (`/orders/new`), Barista KDS (`/orders`), Floor Map (`/tables`).
  - **Catalog & Stock**: Menu & BOM Recipes (`/menu`), Roastery Inventory (`/inventory`).
  - **Back Office**: Cash Shift (`/shift`), Payments Desk (`/payments`), Analytics Reports (`/reports`), Customers & Loyalty (`/customers`), Staff & Roles (`/users`).
- **Live Active Shift Indicator**: Real-time top-bar drawer status pill showing open shift balance or drawer-closed alert.
- **Quick Command Palette (`/`)**: Keyboard-driven jump across routes, live floor tables, active bar tickets, and menu items.
- **100% Complete EN / VI Switching**: Instant bilingual toggle (`i18n.jsx` + `opsI18n.js`) translating UI chrome, menu catalog, floor zones, modifiers, and receipts with zero untranslated strings.

### 2. Flagship Hospitality POS, KDS & Floor Modules
- **Executive Shift & Rush Dashboard (`/dashboard`)**: 5 Cafe Pulse KPIs (*Net Sales Today*, *Active Floor Tickets*, *Avg Ticket Prep Time*, *Table Occupancy*, *Current Drawer Cash*), interactive **Hourly Rush Revenue & Ticket SVG Chart**, **Top Pour-Over & Espresso Bar Performers**, **Live Kitchen Queue Snapshot**, and **Low-Bean / Milk Par-Level Alerts**.
- **Spatial Floor Plan & Table Occupancy Studio (`/tables`)**: 4 cafe zones (*Espresso Bar Counter*, *Main Courtyard*, *Roastery Window*, *Quiet Mezzanine*) with top-down SVG table geometry (bar stools, 2-top, 4-top, 6-seat communal), 4 live occupancy states, seated timers, and 1-click slide-over inspector to **Open New Order**, **Settle Tab**, **Merge Tables**, or **Clear & Bus**.
- **Touch / Keyboard POS Order Builder (`/orders/new`)**: Category tabs, `F2` instant search, drink dial-in modifiers (*Roast Origin*, *Oat/Whole Milk*, *Sweetness/Ice*, *Pour-Over/Extraction Method*), CRM loyalty member lookup with tier privilege discounts, and 1-tap fire to bar.
- **Barista KDS Kanban & Orders Ledger (`/orders`)**: Toggle between **Orders Ledger View** and 4-column **Live KDS Kanban** (*Queued → Pulling Shot / Steaming → Ready at Pass → Served*) with live elapsed SLA timers (turning warm amber at `05:00` and kiln red at `10:00`) and 1-tap bump controls.
- **Cashier Shift & Blind Drawer Reconciliation (`/shift`)**: Opening float count, **Paid-In / Paid-Out** petty cash events (ice deliveries, milk runs), live Expected Cash vs Card/VietQR breakdown, **End-of-Shift Blind Count Variance Calculator**, and Shift Audit History Log.
- **Analytics & 80mm Thermal Receipt (`/reports`, `/receipts/:id`)**: Peak-Hour Daypart Heatmap, Category Margin & Waste Breakdown, UTF-8 CSV Export, and an authentic **80mm Roastery Thermal Receipt** with inline SVG QR code and `@media print` stylesheet.

### 3. Editorial Public Storefront
- Scrollytelling origin-to-cup experience (`/`), 15-SKU packaged coffee & gear shop (`/products`), Coffee Culture & SCA brewing guides (`/coffee-culture`), B2B wholesale equipment & beans (`/business-solutions`), Sustainability micro-lots (`/sustainability`), and Roastery Journal (`/journal`).

---

## Design System

| Token Role | Hex | Usage |
| :--- | :--- | :--- |
| **Deep Espresso** | `#2b1d14` | Operational sidebar, primary roast actions, dark editorial headers |
| **Warm Parchment** | `#f5ecdf` | Workspace canvas, tactile warm card surfaces |
| **Roasted Caramel** | `#b5835a` | Active navigation accents, rush chart curves, primary POS actions |
| **Forest Matcha** | `#2e5a44` | Available tables, ready-at-pass states, balanced drawer variance |
| **Kiln Terracotta** | `#b84a39` | Overdue `>10m` KDS tickets, par-level shortages, drawer shortages |

- **Typography**: `Cormorant Garamond` (editorial display), `Be Vietnam Pro` (humanist UI sans with full Vietnamese diacritics), and `JetBrains Mono` (`tabular-nums` for prices, KDS timers, drawer variance, and 80mm thermal receipts).
- **Iconography**: 100% bespoke inline SVG icon set (`src/components/OpsIcons.jsx`).

---

## Getting Started

### Prerequisites
- **Node.js 20+** and **npm**

### Installation & Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

- **Zero-Backend Interactive Mode (Default when `VITE_API_URL` is unset)**: Automatically runs against the stateful in-browser `src/mockApi.js` engine supporting full login, POS order creation, KDS stage bumps, floor table merges, cash shift reconciliation, and analytics.
- **Connected ASP.NET Core 8 Mode**: Start [`CoffeeShopSolution`](https://github.com/hoang-IT-eng/CoffeeShopSolution) on `http://localhost:5160` and set `VITE_API_URL=http://localhost:5160` (or rely on Vite's `/api` proxy).

### Demo Staff Accounts (`/login`)

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `newadmin@coffee.com` | `NewAdmin@123` | Full POS, KDS, Floor, Catalog/BOM, Inventory, Shift, Analytics, Staff |
| **Cashier** | `cashier@coffee.com` | `Cashier@123` | Shift Pulse, POS, KDS, Floor, Cash Shift, Payments, CRM Loyalty |
| **Waiter / Barista** | `waiter@coffee.com` | `Waiter@123` | Shift Pulse, POS, KDS, Floor, Payments |

---

## Testing & Production Build

```bash
# Run Vitest + React Testing Library integration suite
npm test

# Build production static bundle into dist/
npm run build
```

Continuous Integration runs automatically on every push and pull request to `main` via [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (`npm ci` → `npm test` → `npm run build`).
