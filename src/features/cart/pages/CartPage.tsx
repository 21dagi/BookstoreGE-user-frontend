import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/ui/Icon';
import { useThemeStore } from '@/shared/theme';
import { BackButton } from '@/shared/components/navigation/BackButton';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useWalletBalanceQuery, useDeductWalletBalanceMutation } from '@/features/wallet/api';
import { cn } from '@/shared/lib';
import { toast } from '@/shared/ui/Toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const balanceQuery = useWalletBalanceQuery();
  const deductMutation = useDeductWalletBalanceMutation();

  const [confirmCheckoutOpen, setConfirmCheckoutOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [completedOrderRef, setCompletedOrderRef] = useState('');
  const [completedTotal, setCompletedTotal] = useState(0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const userBalance = balanceQuery.data?.totalBalance ?? 0;
  const isBalanceSufficient = userBalance >= subtotal;

  const t = {
    cartTitle: language === 'am' ? 'የእኔ ጋሪ' : 'My Cart',
    emptyTitle: language === 'am' ? 'ጋሪዎ ባዶ ነው' : 'Your Cart is Empty',
    emptySubtitle: language === 'am'
      ? 'እስካሁን ምንም መጽሐፍ ወይም ንዋይ ወደ ጋሪዎ አልጨመሩም።'
      : 'You have not added any books or sacred items yet.',
    browseBooks: language === 'am' ? 'መደብሩን ይመልከቱ' : 'Explore Store',
    itemsCount: language === 'am' ? `${totalItems} ዕቃዎች` : `${totalItems} items`,
    orderSummary: language === 'am' ? 'የትዕዛዝ ማጠቃለያ' : 'Order Summary',
    subtotal: language === 'am' ? 'ድምር' : 'Subtotal',
    pickupFee: language === 'am' ? 'የመደብር ርክክብ' : 'In-Store Pickup',
    pickupFree: language === 'am' ? 'በነጻ' : 'Free',
    total: language === 'am' ? 'ጠቅላላ ክፍያ' : 'Total Amount',
    walletBalance: language === 'am' ? 'የቦርሳዎ ቀሪ ሒሳብ' : 'Your Wallet Balance',
    currency: language === 'am' ? 'ብር' : 'ETB',
    checkoutButton: language === 'am' ? 'በቦርሳ ቀሪ ሒሳብ ይክፈሉ' : 'Pay with Wallet',
    confirmCheckout: language === 'am' ? 'ክፍያውን ያረጋግጡ' : 'Confirm Payment',
    depositShortcut: language === 'am' ? 'ገንዘብ አስገባ' : 'Deposit Funds',
    insufficientBalance: language === 'am' ? 'ቀሪ ሒሳብዎ በቂ አይደለም' : 'Insufficient balance',
    remainingAfter: language === 'am' ? 'ከክፍያ በኋላ የሚቀር' : 'Balance after payment',
    cancel: language === 'am' ? 'ይቅር' : 'Cancel',
    confirmAndPay: language === 'am' ? 'አረጋግጥና ክፈል' : 'Confirm & Pay',
    successTitle: language === 'am' ? 'ትዕዛዝዎ በተሳካ ሁኔታ ተጠናቋል!' : 'Order Placed Successfully!',
    successSubtitle: language === 'am'
      ? 'ክፍያው ከቦርሳዎ ተቀንሷል። እቃውን በሰንበት ት/ቤቱ መደብር መውሰድ ይችላሉ።'
      : 'Payment was deducted from your wallet. You can pick up your items at the store.',
    backToCatalog: language === 'am' ? 'ወደ መደብር ተመለስ' : 'Back to Store',
    viewWallet: language === 'am' ? 'የቦርሳ ታሪክ እይ' : 'View Wallet',
    removeItemToast: language === 'am' ? 'እቃው ከጋሪ ወጥቷል' : 'Item removed from cart',
  };

  const handleCheckoutConfirm = async () => {
    if (!isBalanceSufficient) {
      toast.error(t.insufficientBalance);
      return;
    }

    const orderRef = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const titleAm = `የመጻሕፍት ግዢ (${totalItems} ዕቃዎች)`;
    const titleEn = `Cart Purchase (${totalItems} items)`;

    try {
      await deductMutation.mutateAsync({
        amount: subtotal,
        tx: {
          titleAm,
          titleEn,
          reference: orderRef,
        },
      });

      setCompletedOrderRef(orderRef);
      setCompletedTotal(subtotal);
      clearCart();
      setConfirmCheckoutOpen(false);
      setSuccessModalOpen(true);
    } catch {
      toast.error(language === 'am' ? 'ክፍያው አልተሳካም፤ እባክዎ እንደገና ይሞክሩ' : 'Payment failed, please try again');
    }
  };

  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary flex flex-col pb-24">

      {/* ── Sticky Top Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-4 py-2.5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <BackButton onBack={() => navigate(-1)} />
            <div className="flex flex-col">
              <span className="text-[16px] font-extrabold text-text-primary leading-tight">
                {t.cartTitle}
              </span>
              <span className="text-[11px] font-semibold text-text-muted">
                {t.itemsCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-9 px-2.5 rounded-full bg-bg-card border border-border-subtle shadow-sm hover:border-brand-500/50 flex items-center gap-1.5 active:scale-95 transition-all text-text-primary"
              aria-label="Switch language"
            >
              <Icon name="Globe" size={15} className="text-brand-500 shrink-0" />
              <span className="text-[11.5px] font-bold tracking-tight">
                {language === 'am' ? 'አማ' : 'EN'}
              </span>
            </button>

            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Icon name="Sun" size={17} className="text-amber-400" />
              ) : (
                <Icon name="Moon" size={17} className="text-brand-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Body ─────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-3 flex flex-col gap-4">

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 gap-3 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-bg-card border border-border-subtle shadow-card flex items-center justify-center text-text-muted mb-2">
              <Icon name="ShoppingBag" size={38} className="opacity-40" />
            </div>
            <h2 className="text-[18px] font-extrabold text-text-primary">
              {t.emptyTitle}
            </h2>
            <p className="text-[12.5px] text-text-muted max-w-xs leading-relaxed">
              {t.emptySubtitle}
            </p>
            <Link
              to={ROUTES.CATALOG.ROOT}
              className="mt-3 px-6 py-2.5 rounded-2xl bg-[#5c0b1c] hover:bg-[#7a2330] text-white text-[13px] font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <Icon name="BookOpen" size={16} />
              <span>{t.browseBooks}</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex flex-col gap-3">
              {items.map(({ book, quantity }) => (
                <article
                  key={book.id}
                  className="bg-bg-card rounded-2xl p-3 border border-border-subtle shadow-card flex gap-3 transition-all hover:border-border-strong"
                >
                  {/* Thumbnail (Clickable to ProductDetailPage) */}
                  <div
                    onClick={() => navigate(ROUTES.CATALOG.DETAIL(book.id))}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-bg-secondary border border-border-subtle shrink-0 cursor-pointer relative"
                  >
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title[language]}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted">
                        <Icon name="Book" size={24} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between gap-1">
                        <h3
                          onClick={() => navigate(ROUTES.CATALOG.DETAIL(book.id))}
                          className="font-bold text-[13.5px] text-text-primary leading-tight line-clamp-2 cursor-pointer hover:text-brand-500 transition-colors"
                        >
                          {book.title[language]}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(book.id);
                            toast.info(t.removeItemToast);
                          }}
                          className="w-7 h-7 rounded-lg bg-bg-secondary hover:bg-rose-50 dark:hover:bg-rose-950/40 text-text-muted hover:text-rose-600 flex items-center justify-center shrink-0 active:scale-90 transition-all"
                          aria-label="Remove item"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>

                      <span className="text-[11px] text-text-muted truncate mt-0.5">
                        {book.author[language]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[14px] font-extrabold text-[#7a2330] dark:text-[#E8886E]">
                        {(book.price * quantity).toLocaleString()} {t.currency}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-bg-secondary px-1.5 py-0.5 rounded-xl border border-border-subtle">
                        <button
                          type="button"
                          onClick={() => updateQuantity(book.id, quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-bg-card flex items-center justify-center text-text-primary active:scale-90 transition-all font-bold text-[13px] shadow-sm"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-[12px] tabular-nums text-text-primary">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(book.id, quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-bg-card flex items-center justify-center text-text-primary active:scale-90 transition-all font-bold text-[13px] shadow-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Order Summary Card */}
            <section className="bg-bg-card rounded-3xl p-4 border border-border-subtle shadow-card flex flex-col gap-3">
              <h2 className="text-[14px] font-bold text-text-primary pb-1 border-b border-border-subtle/50">
                {t.orderSummary}
              </h2>

              <div className="flex flex-col gap-2 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-text-muted">{t.subtotal}</span>
                  <span className="text-text-primary font-bold">
                    {subtotal.toLocaleString()} {t.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t.pickupFee}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {t.pickupFree}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border-subtle/40 text-[14px]">
                  <span className="text-text-primary font-bold">{t.total}</span>
                  <span className="text-[#5c0b1c] dark:text-rose-400 font-black">
                    {subtotal.toLocaleString()} {t.currency}
                  </span>
                </div>
              </div>

              {/* Wallet Status Badge */}
              <div className="p-3 rounded-2xl bg-bg-secondary border border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 flex items-center justify-center text-[#B2782A]">
                    <Icon name="CreditCard" size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted font-medium">{t.walletBalance}</span>
                    <span className="text-[13px] font-extrabold text-text-primary leading-tight">
                      {userBalance.toLocaleString()} {t.currency}
                    </span>
                  </div>
                </div>

                {!isBalanceSufficient && (
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.WALLET.DEPOSIT)}
                    className="px-2.5 py-1 rounded-xl bg-[#5c0b1c] hover:bg-[#7a2330] text-white text-[11px] font-bold shadow-sm active:scale-95 transition-all"
                  >
                    {t.depositShortcut}
                  </button>
                )}
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => setConfirmCheckoutOpen(true)}
                className="h-12 w-full rounded-2xl bg-[#5c0b1c] hover:bg-[#7a2330] text-white font-extrabold text-[13.5px] flex items-center justify-center gap-2 shadow-lg shadow-[#5c0b1c]/25 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Icon name="CheckCircle" size={17} />
                <span>{t.checkoutButton}</span>
              </button>
            </section>
          </>
        )}
      </main>

      {/* ── Confirmation Bottom Sheet ─────────────────────────────────── */}
      {confirmCheckoutOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmCheckoutOpen(false);
          }}
        >
          <div className="bg-bg-primary rounded-t-3xl w-full max-w-lg p-5 shadow-2xl flex flex-col gap-4 border-t border-border-subtle animate-slide-up">
            <div className="flex items-center justify-between pb-1 border-b border-border-subtle/50">
              <span className="text-[14px] font-extrabold text-text-primary">
                {t.confirmCheckout}
              </span>
              <button
                type="button"
                onClick={() => setConfirmCheckoutOpen(false)}
                className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Payment Summary */}
            <div className="p-3.5 rounded-2xl bg-bg-secondary flex flex-col gap-2.5 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-text-muted">{t.subtotal} ({t.itemsCount})</span>
                <span className="text-text-primary font-bold">{subtotal.toLocaleString()} {t.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{t.walletBalance}</span>
                <span className="text-text-primary font-mono font-bold">{userBalance.toLocaleString()} {t.currency}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border-subtle/50">
                <span className="text-text-muted">{t.remainingAfter}</span>
                <span
                  className={cn(
                    'font-mono font-extrabold',
                    isBalanceSufficient ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  )}
                >
                  {(userBalance - subtotal).toLocaleString()} {t.currency}
                </span>
              </div>
            </div>

            {!isBalanceSufficient && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                <span className="text-[12px] font-bold text-rose-700 dark:text-rose-300">
                  {t.insufficientBalance}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmCheckoutOpen(false);
                    navigate(ROUTES.WALLET.DEPOSIT);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#5c0b1c] text-white text-[11px] font-bold shadow-sm"
                >
                  {t.depositShortcut}
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmCheckoutOpen(false)}
                className="h-11 flex-1 rounded-2xl bg-bg-secondary hover:bg-bg-card border border-border-subtle text-text-primary font-semibold text-[13px] active:scale-[0.98] transition-all"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                disabled={!isBalanceSufficient || deductMutation.isPending}
                onClick={handleCheckoutConfirm}
                className={cn(
                  'h-11 flex-[2] rounded-2xl font-extrabold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]',
                  isBalanceSufficient && !deductMutation.isPending
                    ? 'bg-[#5c0b1c] hover:bg-[#7a2330] text-white shadow-[#5c0b1c]/25 cursor-pointer'
                    : 'bg-bg-secondary text-text-muted border border-border-subtle cursor-not-allowed opacity-60'
                )}
              >
                {deductMutation.isPending ? (
                  <Icon name="Loader2" size={17} className="animate-spin" />
                ) : (
                  <Icon name="Check" size={17} />
                )}
                <span>{t.confirmAndPay}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ─────────────────────────────────────────────── */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-subtle rounded-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center text-center gap-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Icon name="Check" size={32} />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-black text-text-primary leading-tight">
                {t.successTitle}
              </h2>
              <p className="text-[12px] text-text-muted leading-relaxed mt-1">
                {t.successSubtitle}
              </p>
            </div>

            <div className="w-full bg-bg-secondary rounded-2xl p-3 border border-border-subtle flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-text-muted">ማጣቀሻ / Reference</span>
                <span className="text-text-primary font-mono font-bold">{completedOrderRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">የተከፈለ / Paid</span>
                <span className="text-[#5c0b1c] dark:text-rose-400 font-extrabold">
                  {completedTotal.toLocaleString()} {t.currency}
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate(ROUTES.CATALOG.ROOT)}
                className="h-11 w-full bg-[#5c0b1c] hover:bg-[#7a2330] text-white rounded-2xl text-[13px] font-extrabold shadow-md active:scale-[0.98] transition-all"
              >
                {t.backToCatalog}
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.WALLET.ROOT)}
                className="h-10 w-full bg-bg-secondary hover:bg-bg-card text-text-primary border border-border-subtle rounded-2xl text-[12px] font-bold active:scale-[0.98] transition-all"
              >
                {t.viewWallet}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.26s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up { animation: scale-up 0.24s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default CartPage;
