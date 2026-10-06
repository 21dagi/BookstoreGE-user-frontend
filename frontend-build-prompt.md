# Code Editor Prompt — Senior-Level React + Vite Frontend Architecture
## Customer Telegram Mini App: Ethiopian Orthodox Bookstore & መጽሐፍ እቁብ

> **Paste this entire prompt into your code editor's AI agent.**
> It works in **two phases**. In **Phase 1** you build only the project foundation. In **Phase 2** I will give you the Stitch designs **one page at a time**, and you will build each into the existing architecture.
>
> **Do NOT build any pages in Phase 1.** Build the environment, structure, shared layer, and tooling, then stop and report.

---

## 0. Your Role

Act as a **senior frontend architect and staff-level React engineer**. Your work will be judged on **architecture, maintainability, reuse, and cleanliness**, not on how fast pages appear.

The product is the **customer** Telegram Mini App of an Ethiopian Orthodox Tewahedo Church bookstore. It sells books (in-person pickup only), has a wallet, and runs rotating contribution groups called **መጽሐፍ እቁብ**. The backend does not exist yet. The admin app is a separate project and **is not part of this repository**.

Reference documents, if provided alongside this prompt: `business-logic.md` (business rules) and `frontend-design.md` (design brief). Treat business rules as authoritative.

---

## 1. Non-Negotiable Engineering Rules

These apply to **every file you write, in both phases.**

### 1.1 No "all-in-one" code

- **One component per file.** One hook per file. One responsibility per module.
- **Soft limit: ~120 lines per component file. Hard limit: 200 lines.** If a file approaches the limit, split it into sub-components, hooks, or helpers. Do not exceed limits "just this once."
- **Pages are thin.** A page file composes feature components and calls hooks. It contains no heavy logic, no large JSX trees, no inline data, and no styling decisions beyond layout composition.
- **No business logic in JSX.** Logic lives in hooks, utilities, or services. Components render.
- **No inline mock data, magic strings, magic numbers, or hardcoded UI text** anywhere in components.
- **No duplicated UI.** If the same visual pattern appears twice, extract it to a shared component immediately.

### 1.2 Reuse-first architecture

Anything used by more than one page (navigation, headers, layout shell, buttons, inputs, cards, chips, sheets, dialogs, skeletons, empty/error states, status indicators, price display, book cover, step indicator, etc.) must live in the **shared layer** and be imported from there. Pages and features **never** reimplement these.

Before creating any component in Phase 2, **search the shared layer first** and reuse or extend what exists. Extending an existing shared component (via props/variants) is preferred over creating a near-duplicate.

### 1.3 Separation of concerns

| Concern | Lives in | Rule |
|---|---|---|
| Rendering | Components | Pure, props in, JSX out |
| State and logic | Hooks | Custom hooks, named `useXxx`, one per file |
| Server data | Query hooks over a service layer | Components never call `fetch` directly |
| Data access | Services / repositories | Only layer that knows about HTTP or mocks |
| Domain types | `types` per feature + shared | Strong typing, no `any` |
| Formatting | `shared/lib` utilities | Money, dates, numbers, text |
| Text | i18n resource files | No hardcoded user-facing strings |
| Styling | Design tokens + utility classes | No hardcoded colors, spacing, or font values in components |

### 1.4 Code quality

- **TypeScript in strict mode.** No `any`. No unchecked non-null assertions (`!`) without justification.
- **ESLint + Prettier + EditorConfig** enforced. Fail the build on lint errors.
- **Consistent naming:** `PascalCase` components, `camelCase` functions/hooks, `kebab-case` folders only where noted below, `SCREAMING_SNAKE_CASE` constants, enums or union types for statuses.
- **Barrel exports (`index.ts`)** for each shared and feature module; avoid deep imports across feature boundaries.
- **Path aliases** (`@/app`, `@/shared`, `@/features`, `@/mocks`, etc.). No `../../../` chains.
- **Comments only where intent is non-obvious.** Prefer self-explanatory names. No commented-out code.
- **Small, composable, pure functions.** Add unit tests for utilities and hooks with logic.

---

## 2. Technology Stack (Phase 1 Decisions)

Use the current stable versions and justify any deviation in your Phase 1 report.

| Area | Choice | Why |
|---|---|---|
| Framework | **React** (current stable) + **Vite** | Required |
| Language | **TypeScript (strict)** | Safety and maintainability |
| Routing | **React Router** (data-router API) with **lazy-loaded routes** | Code splitting, nested layouts |
| Server state | **TanStack Query** | Caching, loading/error states, retries, easy mock-to-real swap |
| Client/UI state | **Zustand** (small stores) | Cart, UI preferences; avoid prop drilling |
| Forms | **React Hook Form + Zod** | Typed validation, schema-driven |
| Styling | **Tailwind CSS** with **design tokens as CSS variables** | Light/dark theming, consistency |
| Component variants | **class-variance-authority + clsx + tailwind-merge** | Clean, typed variants |
| Icons | One consistent icon library (e.g., Lucide) behind a shared `Icon` wrapper | Swappable, consistent |
| i18n | **i18next + react-i18next**, languages **am** and **en** | Required; namespace per feature |
| Telegram | Official Telegram Web App SDK behind a **single adapter module** | Isolate platform code |
| Dates | A date library behind a **date utility module**, with **Gregorian and Ethiopian calendar** display support | Customers may prefer Ethiopian dates |
| Animation | CSS transitions first; a light motion library only if needed | Keep it fast; honor reduced-motion |
| Testing | **Vitest + React Testing Library**; **MSW** optional for API-level mocks | Fast, standard |
| Quality | ESLint, Prettier, Husky + lint-staged, Commitlint (conventional commits) | Professional workflow |
| Package manager | pnpm (or npm if I say otherwise) | Speed and strictness |

Do not add libraries that aren't justified. Do not add a UI kit that fights the Stitch design; build the component library from the design tokens.

---

## 3. Folder Architecture

Use a **feature-based architecture with a strong shared layer**. Create this structure in Phase 1 (with placeholder `index.ts` files and short README notes where helpful):

```
├── public/
│   └── locales/                      # (optional) static assets
├── src/
│   ├── app/                          # App-level wiring only
│   │   ├── providers/                # QueryProvider, I18nProvider, ThemeProvider, TelegramProvider, ToastProvider
│   │   ├── router/                   # Route definitions, route guards, lazy imports, route constants
│   │   ├── layouts/                  # AppShell, TabLayout, StackLayout, FlowLayout (stepper flows)
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── shared/                       # Everything reusable across features
│   │   ├── ui/                       # Design-system primitives (no business knowledge)
│   │   │   ├── Button/ Input/ Textarea/ Select/ Checkbox/ Switch/
│   │   │   ├── Chip/ Badge/ StatusChip/ Avatar/ Divider/
│   │   │   ├── Card/ ListItem/ Skeleton/ Spinner/ ProgressBar/ Stepper/
│   │   │   ├── BottomSheet/ Dialog/ Toast/ Tabs/ SegmentedControl/
│   │   │   ├── EmptyState/ ErrorState/ OfflineBanner/
│   │   │   └── Icon/
│   │   ├── components/               # Reusable composite components with light domain awareness
│   │   │   ├── navigation/           # BottomNav, HeaderBar, BackButton, SearchEntry, CartButton, NotificationBell
│   │   │   ├── layout/               # PageContainer, Section, StickyActionBar, SafeAreaView
│   │   │   ├── display/              # MoneyText, DateText, PriceTag, DiscountBadge, BookCover, StatusTimeline, CopyField
│   │   │   └── feedback/             # ConfirmSheet, SuccessState, LoadingScreen
│   │   ├── hooks/                    # useDebounce, useCopyToClipboard, useDisclosure, useOnlineStatus, useReducedMotion ...
│   │   ├── lib/                      # Pure utilities
│   │   │   ├── format/               # money, number, date (Gregorian/Ethiopian), plural
│   │   │   ├── validation/           # shared Zod schemas (phone, amount, reference)
│   │   │   ├── cn.ts                 # class merging
│   │   │   └── storage.ts            # safe storage wrapper
│   │   ├── api/                      # HTTP client, interceptors, error normalization, API result types
│   │   ├── telegram/                 # Telegram adapter: init data, theme sync, BackButton, MainButton, haptics, safe areas, links
│   │   ├── i18n/                     # i18n setup, language detection, shared namespaces
│   │   ├── theme/                    # tokens (CSS variables), light/dark definitions, theme controller
│   │   ├── constants/                # routes, query keys, enums, limits, config
│   │   └── types/                    # Shared domain & utility types
│   │
│   ├── features/                     # One folder per business capability
│   │   ├── auth/                     # Telegram identity, session bootstrap, profile fetch
│   │   ├── home/
│   │   ├── catalog/                  # books, categories, search, filters, product detail, saved books
│   │   ├── cart/                     # cart store, cart UI, checkout
│   │   ├── orders/                   # order list/detail, status timeline, pickup info
│   │   ├── wallet/                   # balances, transactions, receipts
│   │   ├── payments/                 # method select, amount, instructions, proof upload, status (reused by wallet, orders, equb)
│   │   ├── equb/                     # groups, enrollment, schedule, contributions, catch-up, credit received
│   │   ├── notifications/
│   │   └── profile/                  # profile, settings, help, policies
│   │       └── (each feature has the same internal layout below)
│   │
│   ├── pages/                        # Thin route-level screens that compose features (optional if routes live in features)
│   ├── mocks/                        # ALL mock data and mock service implementations. Deletable.
│   └── styles/                       # global.css, tailwind layers, font-face
├── tests/                            # Test setup, test utilities
├── .env.example  .env.development
├── eslint / prettier / tsconfig / vite / tailwind configs
└── README.md  ARCHITECTURE.md  CONTRIBUTING.md
```

### 3.1 Standard internal layout of every feature

```
features/<feature>/
├── api/            # Service functions (calls the shared API client) + query/mutation hooks
├── components/     # Feature-specific components (small, composed)
├── hooks/          # Feature logic hooks
├── pages/          # Route screens (thin) — or `screens/`
├── schemas/        # Zod schemas for forms and API validation
├── types/          # Feature types and enums
├── constants/      # Feature constants (query keys, limits)
├── utils/          # Feature-specific pure helpers
├── store/          # Zustand store, only if the feature needs client state
└── index.ts        # Public API of the feature
```

**Boundary rule:** Features may import from `shared`. Features **must not import from each other's internals**. Cross-feature needs go through a feature's public `index.ts` or are lifted into `shared`. The `payments` feature is deliberately independent so wallet deposits, direct order payments, and contribution payments **all reuse the same payment flow**.

---

## 4. Shared Layer Requirements

### 4.1 Shell, navigation, and layouts (build in Phase 1)

These are used on nearly every screen and must be built once, properly:

| Piece | Responsibility |
|---|---|
| **AppShell** | Root layout: safe areas, Telegram viewport handling, theme application, toast host, offline banner, error boundary. |
| **TabLayout** | Layout with persistent **BottomNav** (Home, Books, እቁብ, Wallet, Profile) and optional header. |
| **StackLayout** | Layout for pushed screens (product detail, order detail, group detail) with back handling. |
| **FlowLayout** | Layout for multi-step flows (add money, checkout, join group, catch-up) with a **Stepper**, back behavior, and sticky action bar. |
| **BottomNav** | Config-driven (array of tab definitions), icon + label, active state, badge support, hides appropriately for flows. |
| **HeaderBar** | Title, back button, optional right-side actions (search, cart, notifications). Variants for Home and inner screens. |
| **PageContainer / Section / StickyActionBar / SafeAreaView** | Spacing, scroll behavior, bottom safe-area padding. |

Navigation items, routes, and tab config come from **constants**, not hardcoded in components.

### 4.2 Design system primitives (build in Phase 1, styled from tokens)

Build the primitives listed in the folder tree with: variants, sizes, disabled/loading states, accessible roles/labels, focus states, and Storybook-style usage notes in comments or a short doc. Every interactive element ≥ 44 px touch target. Provide `StatusChip` with **icon + text** (never color-only) supporting the status vocabularies used by payments, orders, and contributions.

### 4.3 Theming

- Implement **light and dark themes via CSS variable tokens** (`--color-*`, `--space-*`, `--radius-*`, `--font-*`, `--shadow-*`).
- **Phase 1:** create sensible placeholder tokens (burgundy brand, white/ivory neutrals, brass accent, semantic status colors) in one file. **Phase 2:** when I provide Stitch designs, **extract and replace tokens from the designs** (colors, fonts, radii, spacing, shadows) so the codebase mirrors the design system exactly. **Components must reference tokens only.**
- Theme options: Light / Dark / Follow Telegram, persisted.
- Verify contrast for text, buttons, and status chips in both themes.

### 4.4 Internationalization

- Languages: **Amharic (am)** and **English (en)**. Default from Telegram language, user-changeable, persisted.
- **No hardcoded UI strings.** Use translation keys, namespaced per feature, with typed keys if possible.
- Fonts with full **Ethiopic script** support; generous line-height for Amharic; layouts must tolerate text-length differences.
- Utilities for currency (ETB), numbers, dates (**Gregorian + Ethiopian calendar** display), and pluralization.

### 4.5 Telegram adapter

All Telegram-specific code lives in `shared/telegram`. Components never touch `window.Telegram` directly. Provide:

- Init data access and validation hand-off (the client forwards init data to the backend; it never trusts itself for identity).
- Theme parameter sync and viewport/safe-area values.
- Back button, main button, haptic feedback, open-link, close, and expand helpers as hooks (`useTelegramBackButton`, `useTelegramMainButton`, `useHaptics`, etc.).
- Graceful behavior when opened outside Telegram (dev mode fallback and a clear "open in Telegram" state).

### 4.6 API client and error model

- A single configured client in `shared/api` with base URL from env, request/response interceptors, auth header injection (from the session), timeout, retry rules, and **normalized errors** (network, validation, auth, not-found, conflict, server).
- Idempotency support for financial mutations (an idempotency key option on payment, order, and contribution submissions) so double taps cannot duplicate charges.
- Typed result helpers. No raw `fetch` in features.

### 4.7 Global resilience

- **Error boundaries** (app-level and route-level) with recovery UI.
- **Loading skeleton**, **empty**, **error with retry**, **offline** states provided as shared components and used by every data screen.
- **Lazy routes** with suspense fallbacks; image lazy-loading and aspect-ratio-safe placeholders for covers.
- Respect `prefers-reduced-motion`.

---

## 5. Mocks Architecture (Critical)

Mocks must be **completely isolated and trivially removable** when the real backend arrives.

### 5.1 Rules

- **All mock data and mock logic lives only in `src/mocks/`.** No mock data inside components, hooks, features, or shared code.
- Features depend on **service interfaces**, not on mocks. Each feature's `api/` declares the service contract (typed functions). A **service factory** chooses the implementation:
  - Real implementation → uses `shared/api` client.
  - Mock implementation → lives in `src/mocks/<feature>/`.
- Switching is controlled by **one environment flag**: `VITE_USE_MOCKS=true|false`.
- Deleting `src/mocks/` and removing the single mock-registration import in the app bootstrap must leave the app compiling and running against the real API with **no other edits**. Design the code so this is true, and **verify it** at the end of Phase 1 by describing (or testing) the removal path.

### 5.2 Mock design

```
src/mocks/
├── index.ts                  # Registers mock service implementations when VITE_USE_MOCKS is true
├── data/                     # Typed fixtures per domain (books, categories, orders, wallet, groups...)
├── services/                 # Mock implementations of each feature's service contract
├── handlers/                 # (Optional) MSW handlers
├── factories/                # Helpers to generate realistic variations
└── utils/                    # Simulated latency, simulated failures, pagination helpers
```

- Mock services return the **same typed shapes** the real API will, including loading delays, pagination, and **failure scenarios** (network error, rejected payment, out-of-stock conflict) so every UI state can be exercised.
- Fixtures must be **realistic and bilingual** (Amharic and English), clearly marked as sample data, with a mix of states: discounted vs. regular books, low/out-of-stock, orders in every status, deposits in every verification status, contributions Upcoming/Overdue/Confirmed/Prepaid, groups in every status, credit issued.
- Mock services keep **in-memory state** so flows feel real within a session (adding to cart, submitting a deposit, joining a group), without persisting beyond the session unless useful.

---

## 6. Domain Types and Business Rules the Code Must Respect

Define shared enums/union types (and keep them in one place per domain) matching the business document. At minimum:

| Domain | Values |
|---|---|
| Payment methods | `telebirr`, `cbe`, `boa` |
| Payment verification status | `started`, `submitted`, `awaiting_verification`, `further_review`, `confirmed`, `rejected`, `expired`, `cancelled` |
| Order status | `pending_payment`, `awaiting_verification`, `confirmed`, `preparing`, `ready_for_pickup`, `collected`, `cancelled`, `refunded` |
| Contribution status | `upcoming`, `due`, `submitted`, `confirmed`, `overdue`, `prepaid`, `covered_by_plan`, `adjusted` |
| Group status | `enrollment_open`, `enrollment_closed`, `active`, `paused`, `completed`, `discontinued`, `cancelled` |
| Round status | `upcoming`, `recipient_pending`, `credit_issued`, `completed` |
| Wallet buckets | `general`, `equb_credit` |
| Availability | `in_stock`, `few_left`, `out_of_stock`, `unavailable` |

**Rules that must be reflected in the UI code:**

1. **There is no wallet withdrawal feature.** Never create a withdraw action, route, or type.
2. **The customer cannot mark an order collected.** No such action or mutation exists in the customer app; only the status is displayed.
3. **Pending deposits are never added to spendable balance** in any calculation or display. Spendable logic lives in one tested utility.
4. **Pickup is in person only.** No delivery or shipping concepts in types, routes, or UI.
5. **እቁብ credit is not cash.** It is a separate bucket and is never labeled with cash wording.
6. **Financial mutations are idempotent and guarded against double submission** (disabled while pending, idempotency key, optimistic UI avoided for money).
7. **Never display an unpaid contribution as paid.** `submitted` is shown as awaiting verification.
8. **Money handling:** store amounts in a safe integer or decimal-safe representation; format only at the edge via the shared money formatter.

---

## 7. State, Data, and Performance Guidelines

- **Server state in TanStack Query**, with centralized **query key factories** per feature, sensible stale times, and invalidation after mutations (e.g., a confirmed deposit refreshes wallet queries).
- **Client state** only for what is genuinely client-side (cart, theme, language, UI flags). Persist cart safely.
- **Forms**: schema-first (Zod), typed, accessible error messages, disabled submit while pending, keyboard types appropriate (numeric for amounts).
- **File upload** (payment screenshot): a reusable `ImagePicker` with preview, size/type validation, and compression before upload.
- **Lists**: pagination or infinite scroll with skeletons; virtualize only if needed.
- **Memoization** only where measured or obviously beneficial; avoid premature optimization but avoid obvious re-render traps (stable props, selectors for Zustand).
- **Bundle hygiene:** route-level code splitting, no unnecessary heavy dependencies, analyze bundle.

---

## 8. Phase 1 — Deliverables (Do This Now)

Build the foundation and **stop**. Do not build page screens.

### 8.1 Tasks

1. **Scaffold** the Vite + React + TypeScript project with the stack in Section 2.
2. Configure **TypeScript strict**, **path aliases**, **ESLint, Prettier, EditorConfig, Husky, lint-staged, Commitlint**.
3. Configure **Tailwind** with token-based theme; implement **light/dark** token files and the theme controller.
4. Create the **complete folder structure** from Section 3, with `index.ts` barrels and brief README notes in key folders.
5. Implement **providers**: Query, i18n, Theme, Telegram, Toast, error boundary.
6. Implement **router** with lazy-loaded route placeholders for every planned screen (a simple placeholder component is acceptable) and route constants. Include guards (e.g., session-ready gate).
7. Implement **layouts**: AppShell, TabLayout, StackLayout, FlowLayout.
8. Implement **navigation components**: BottomNav (config-driven), HeaderBar, BackButton, and header action buttons.
9. Implement the **design-system primitives** listed in 4.2 (reasonable first versions, token-driven, accessible).
10. Implement **shared display components**: MoneyText, DateText, PriceTag, DiscountBadge, BookCover, StatusTimeline, CopyField, StatusChip.
11. Implement **Telegram adapter** hooks with a dev-mode fallback.
12. Implement **i18n** setup with `am` and `en` resources, one or two sample keys per namespace, language switching, and Ethiopic font handling.
13. Implement the **API client**, normalized error model, and idempotency helper.
14. Implement **formatting utilities** (money, dates in both calendars, numbers) with unit tests.
15. Implement the **mocks scaffold**: service factory pattern, `VITE_USE_MOCKS`, `src/mocks/` structure, and one fully worked example (e.g., catalog books service with realistic fixtures) so I can see the pattern. Keep it small.
16. Write **`ARCHITECTURE.md`** (structure, boundaries, data flow, how mocks work and how to remove them, how to add a page/feature) and **`CONTRIBUTING.md`** (rules from Section 1, naming, commit style, PR checklist).
17. Add **scripts**: dev, build, preview, lint, format, typecheck, test.
18. Ensure `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test` all pass.

### 8.2 If the Stitch export is available at this stage

You may **read it only to extract design tokens** (colors, typography, radii, spacing, shadows) and update the token files. **Do not build any page from it yet.**

### 8.3 Phase 1 report (required)

When finished, reply with:

1. The final folder tree (trimmed to key folders).
2. The libraries chosen and any deviations with reasons.
3. A list of the shared components and layouts created.
4. How to remove the mocks (exact steps) and confirmation that it works.
5. Any assumptions or questions before Phase 2.
6. **Then stop and wait for my first page.**

---

## 9. Phase 2 — The Page-by-Page Protocol

After Phase 1, I will give you **one Stitch design (screen or flow) at a time**. For each, follow this exact routine:

### 9.1 Before coding — plan briefly

1. Identify the **layout** it uses (Tab/Stack/Flow).
2. List **existing shared components** you will reuse.
3. List **new components** needed and decide for each: **shared** (if it will plausibly be reused) or **feature-specific**. If a new component is generic, put it in `shared`.
4. List the **hooks, services, schemas, types, mock data, and i18n keys** to add.
5. Note any **token additions** from the design (do not hardcode values).
6. Flag any design element that **conflicts with a business rule** (e.g., delivery, withdrawal, customer-side collection) and ask me before implementing it.

Keep this plan short. Then build.

### 9.2 Build rules for each page

- Follow **all rules in Section 1**. No file above the size limits. No inline mocks, strings, or magic values.
- Build the **page as a thin composition**; put UI in feature components, logic in hooks, data access in services.
- **Pixel-faithful to the Stitch design**: spacing, typography, color, radii, states. Use tokens; if a needed token is missing, add it to the theme, not to the component.
- Implement **all states**: loading skeleton, empty, error with retry, offline, success, disabled, validation errors.
- Implement **Amharic and English** with translation keys; verify long Amharic strings do not break layout.
- Verify **light and dark** themes.
- Add **mock data and mock service methods** only inside `src/mocks/`, including failure scenarios relevant to the page.
- Add **accessibility**: labels, roles, focus order, ≥44 px targets, non-color status cues.
- Wire **Telegram behaviors** where relevant (back button, main button, haptics) through the adapter.
- Add **tests** for non-trivial hooks, utilities, and key component behavior.
- Run lint, typecheck, and tests before reporting.

### 9.3 After each page — report

Reply with a concise summary:

1. Files created/changed (grouped by layer).
2. Components **reused** vs. **newly created** (and whether shared or feature-level).
3. Mock additions.
4. i18n keys added.
5. Token additions.
6. Anything deviating from the design or business rules, and why.
7. Any refactoring you did to keep things DRY.

Then **wait for the next page.** If a later page reveals that an earlier component should be generalized, **refactor it into shared** and update earlier usages, reporting the change.

### 9.4 Recommended page order (I may change it)

1. Home → 2. Books (explore, search, filter) → 3. Product detail → 4. Cart → 5. Checkout → 6. Orders → 7. Wallet → 8. Payment flow (reused everywhere) → 9. እቁብ screens → 10. Profile/settings/notifications/help.

Build the **payment flow once** and reuse it for wallet deposits, direct order payment, and contribution payment.

---

## 10. Definition of Done (Every Page and Phase)

- [ ] Follows the folder architecture and boundaries.
- [ ] No file exceeds the size limits; no all-in-one components.
- [ ] Reuses shared components; no duplicated UI.
- [ ] No inline mock data, hardcoded strings, colors, or magic values.
- [ ] Mocks isolated in `src/mocks/` and removable with no other edits.
- [ ] Typed end-to-end (strict TypeScript, no `any`).
- [ ] Loading, empty, error, offline, success, and disabled states handled.
- [ ] Amharic and English verified; light and dark verified.
- [ ] Accessibility checks done.
- [ ] Business rules in Section 6 respected.
- [ ] Lint, typecheck, tests, and build pass.
- [ ] Report delivered.

---

## 11. Things You Must Not Do

- Do not build pages in Phase 1.
- Do not put multiple unrelated components in one file.
- Do not call APIs or mocks directly from components.
- Do not hardcode colors, text, or spacing in components.
- Do not use `localStorage` directly in components (use the storage wrapper).
- Do not trust client-side data for identity or money decisions.
- Do not add delivery, withdrawal, or customer-side "mark collected" functionality.
- Do not add admin features or screens to this repository.
- Do not add unnecessary dependencies or over-engineer beyond what the design and business rules require.
- Do not proceed to the next page without reporting on the current one.

---

**Begin Phase 1 now. When complete, deliver the Phase 1 report and wait for my first Stitch page.**
