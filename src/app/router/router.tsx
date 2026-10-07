import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/app/layouts/AppShell';
import { TabLayout } from '@/app/layouts/TabLayout';
import { StackLayout } from '@/app/layouts/StackLayout';
import { FlowLayout } from '@/app/layouts/FlowLayout';
import { ROUTES } from '@/shared/constants';
import { Spinner } from '@/shared/ui/Spinner';

// ─── Lazy Page Imports ───────────────────────────────────────────────────────

const HomePage = lazy(() => import('@/features/home/pages/HomePage'));
const NewsPage = lazy(() => import('@/features/home/pages/NewsPage'));

// Placeholder pages — replaced in Phase 2 one by one
const PlaceholderPage = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center h-screen text-text-muted text-sm font-medium">
    {label}
  </div>
);

const CatalogPage = lazy(() => import('@/features/catalog/pages/CatalogPage'));
const ProductDetailPage = lazy(() => import('@/features/catalog/pages/ProductDetailPage'));
const SearchPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage label="Search" /> }));
const SavedBooksPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage label="Saved Books" /> }));
const CartPage = lazy(() => import('@/features/cart/pages/CartPage'));
const CheckoutPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage label="Checkout" /> }));
const OrdersPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage label="Orders" /> }));
const OrderDetailPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage label="Order Detail" /> }));
const WalletPage = lazy(() => import('@/features/wallet/pages/WalletPage'));
const WalletDepositPage = lazy(() => import('@/features/wallet/pages/WalletDepositPage'));
const EqubPage = lazy(() => import('@/features/equb/pages/EqubPage'));
const EqubDetailPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage label="Equb Detail" /> }));
const PaymentPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage label="Payment" /> }));
const SettingsPage = lazy(() => Promise.resolve({ default: () => <PlaceholderPage label="Settings" /> }));

const suspense = (el: React.ReactNode) => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>}>
    {el}
  </Suspense>
);

// ─── Router ──────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Tab-navigated root screens
      {
        element: <TabLayout />,
        children: [
          { index: true, element: suspense(<HomePage />) },
          { path: ROUTES.CATALOG.ROOT, element: suspense(<CatalogPage />) },
          { path: ROUTES.EQUB.ROOT, element: suspense(<EqubPage />) },
          { path: ROUTES.WALLET.ROOT, element: suspense(<WalletPage />) },
          { path: ROUTES.PROFILE.ROOT, element: suspense(<NewsPage />) },
        ],
      },
      // Stack screens (pushed, with back button)
      {
        element: <StackLayout />,
        children: [
          { path: ROUTES.CATALOG.DETAIL(), element: suspense(<ProductDetailPage />) },
          { path: ROUTES.CATALOG.SEARCH, element: suspense(<SearchPage />) },
          { path: ROUTES.CATALOG.SAVED, element: suspense(<SavedBooksPage />) },
          { path: ROUTES.CART.ROOT, element: suspense(<CartPage />) },
          { path: ROUTES.ORDERS.ROOT, element: suspense(<OrdersPage />) },
          { path: ROUTES.ORDERS.DETAIL(), element: suspense(<OrderDetailPage />) },
          { path: ROUTES.WALLET.DEPOSIT, element: suspense(<WalletDepositPage />) },
          { path: ROUTES.EQUB.DETAIL(), element: suspense(<EqubDetailPage />) },
          { path: ROUTES.PROFILE.SETTINGS, element: suspense(<SettingsPage />) },
        ],
      },
      // Flow screens (multi-step, no bottom nav)
      {
        element: <FlowLayout />,
        children: [
          { path: ROUTES.CART.CHECKOUT, element: suspense(<CheckoutPage />) },
          { path: ROUTES.PAYMENT.FLOW, element: suspense(<PaymentPage />) },
        ],
      },
      { path: '*', element: <Navigate to={ROUTES.HOME} replace /> },
    ],
  },
]);
