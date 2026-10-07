import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/ui/Icon';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorState } from '@/shared/ui/ErrorState';
import { toast } from '@/shared/ui/Toast';
import { BackButton } from '@/shared/components/navigation/BackButton';
import { useBookQuery, useTrendingBooksQuery, useToggleSavedMutation } from '@/features/catalog/api';
import { useCartStore } from '@/features/cart/store/cartStore';
import { useWalletBalanceQuery, useDeductWalletBalanceMutation } from '@/features/wallet/api';
import { BookCard } from '@/features/home/components/BookCard';
import { cn } from '@/shared/lib';

export const ProductDetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [descExpanded, setDescExpanded] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const [purchaseSheetOpen, setPurchaseSheetOpen] = useState(false);
  const [purchaseSuccessModalOpen, setPurchaseSuccessModalOpen] = useState(false);
  const [purchasedOrderRef, setPurchasedOrderRef] = useState('');

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const balanceQuery = useWalletBalanceQuery();
  const deductMutation = useDeductWalletBalanceMutation();

  const { data: book, isLoading, isError, refetch } = useBookQuery(bookId ?? '');
  const { data: relatedBooks } = useTrendingBooksQuery();
  const toggleSaved = useToggleSavedMutation();

  const handleLanguageToggle = () => changeLanguage(language === 'am' ? 'en' : 'am');

  const handleShare = async () => {
    try {
      if (navigator.share && book) {
        await navigator.share({
          title: book.title[language],
          text: book.title[language],
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(language === 'am' ? 'የመጽሐፉ ሊንክ ተቀድቷል!' : 'Link copied to clipboard!');
      }
    } catch {
      // user dismissed share dialog
    }
  };

  const handleAddToCart = () => {
    if (!book) return;
    addItem(book, quantity);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
    toast.success(
      language === 'am'
        ? `${quantity}x ${book.title.am} ወደ ጋሪ ተጨምሯል!`
        : `${quantity}x ${book.title.en} added to cart!`,
    );
  };

  const handleBuyNow = () => {
    setPurchaseSheetOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!book) return;
    const orderTotal = book.price * quantity;
    const currentBalance = balanceQuery.data?.totalBalance ?? 0;
    if (currentBalance < orderTotal) {
      toast.error(language === 'am' ? 'ቀሪ ሒሳብዎ በቂ አይደለም' : 'Insufficient balance');
      return;
    }

    const orderRef = `#ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      await deductMutation.mutateAsync({
        amount: orderTotal,
        tx: {
          titleAm: `የመጽሐፍ ግዢ · ${book.title.am} (${quantity}x)`,
          titleEn: `Book Purchase · ${book.title.en} (${quantity}x)`,
          reference: orderRef,
        },
      });
      setPurchasedOrderRef(orderRef);
      setPurchaseSheetOpen(false);
      setPurchaseSuccessModalOpen(true);
    } catch {
      toast.error(language === 'am' ? 'ክፍያው አልተሳካም፤ እባክዎ እንደገና ይሞክሩ' : 'Payment failed, please try again');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-bg-primary px-4 pt-4 pb-20 flex flex-col gap-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <Skeleton width={36} height={36} className="rounded-full" />
          <Skeleton width={80} height={32} className="rounded-full" />
        </div>
        <Skeleton height={280} className="w-full rounded-3xl" />
        <Skeleton height={32} className="w-3/4 rounded-xl" />
        <Skeleton height={20} className="w-1/2 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton height={60} className="flex-1 rounded-2xl" />
          <Skeleton height={60} className="flex-1 rounded-2xl" />
          <Skeleton height={60} className="flex-1 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="w-full min-h-screen bg-bg-primary px-5 pt-16 flex flex-col items-center">
        <BackButton className="self-start mb-6" />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  const isSaved = book.isSaved ?? false;
  const inStock = book.availability === 'in_stock';
  const totalPrice = book.price * quantity;
  const savings = book.originalPrice ? (book.originalPrice - book.price) * quantity : 0;

  const t = {
    inStock: language === 'am' ? 'በመደብር ይገኛል' : 'In Stock',
    fewLeft: language === 'am' ? 'ውሱን ቅጂዎች ብቻ' : 'Few Left',
    outOfStock: language === 'am' ? 'ለጊዜው አልቋል' : 'Out of Stock',
    pages: language === 'am' ? 'ገጾች' : 'Pages',
    languageLabel: language === 'am' ? 'ቋንቋ' : 'Language',
    langValue: language === 'am' ? 'ግዕዝ / አማርኛ' : 'Ge\'ez / Amharic',
    publisherLabel: language === 'am' ? 'አሳታሚ' : 'Publisher',
    categoryLabel: language === 'am' ? 'ምድብ' : 'Category',
    aboutTitle: language === 'am' ? 'ስለ መጽሐፉ / ንዋዩ' : 'About this item',
    readMore: language === 'am' ? 'ተጨማሪ አንብብ' : 'Read more',
    showLess: language === 'am' ? 'አሳጥር' : 'Show less',
    addToCart: language === 'am' ? 'ወደ ጋሪ ጨምር' : 'Add to Cart',
    buyNow: language === 'am' ? 'አሁን እዘዝ' : 'Order Now',
    relatedTitle: language === 'am' ? 'ተዛማጅ መጻሕፍትና ንዋያተ ቅድሳት' : 'Related Books & Sacred Items',
    seeAll: language === 'am' ? 'ሁሉንም' : 'See all',
    authenticSeal: language === 'am' ? 'ኦርጅናል እና የተባረከ እትም' : 'Authentic & Blessed Item',
    easyWalletPay: language === 'am' ? 'ቀጥታ በቦርሳዎ ወይም በቴሌብር ይክፈሉ' : 'Pay via Wallet or Telebirr',
  };

  const filteredRelated = (relatedBooks ?? []).filter((b) => b.id !== book.id).slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary flex flex-col pb-28">

      {/* ── Top Floating Navigation Bar with Shadow ─────────────────── */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-4 py-2.5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Back Button */}
          <div className="flex items-center gap-2">
            <BackButton />
            <span className="text-[14px] font-bold text-text-primary truncate max-w-[170px]">
              {book.title[language]}
            </span>
          </div>

          {/* Action cluster: Lang, Bookmark, Share, Cart */}
          <div className="flex items-center gap-1.5">
            {/* Globe Language Button */}
            <button
              onClick={handleLanguageToggle}
              className="h-9 px-2.5 rounded-full bg-bg-card border border-border-subtle shadow-sm hover:border-brand-500/50 flex items-center gap-1.5 active:scale-95 transition-all text-text-primary"
              aria-label="Switch language"
            >
              <Icon name="Globe" size={14} className="text-brand-500 shrink-0" />
              <span className="text-[11px] font-bold">{language === 'am' ? 'አማ' : 'EN'}</span>
            </button>

            {/* Bookmark Button */}
            <button
              onClick={() => toggleSaved.mutate(book.id)}
              className={cn(
                'w-9 h-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center transition-all active:scale-95',
                isSaved ? 'text-[#7a2330] border-[#7a2330]/40' : 'text-text-muted hover:text-text-primary',
              )}
              aria-label="Save book"
            >
              <Icon
                name="Bookmark"
                size={17}
                className={cn(isSaved && 'fill-[#7a2330] text-[#7a2330]')}
              />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-muted hover:text-text-primary active:scale-95 transition-all"
              aria-label="Share"
            >
              <Icon name="Share2" size={16} />
            </button>

            {/* Cart Link */}
            <Link
              to={ROUTES.CART.ROOT}
              className="relative w-9 h-9 rounded-full bg-bg-card border border-border-subtle shadow-sm flex items-center justify-center text-text-primary active:scale-95 transition-all"
              aria-label="Cart"
            >
              <Icon name="ShoppingBag" size={17} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#5c0b1c] text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Detail Content ─────────────────────────────────────── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 flex flex-col gap-4">

        {/* ── Book Cover Elevation Stage ─────────────────────────────── */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-bg-secondary via-bg-card to-bg-secondary p-6 flex flex-col items-center justify-center border border-border-subtle shadow-sm">
          {/* Ambient Glow */}
          <div className="absolute w-44 h-44 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

          {/* Badges on Top */}
          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
            {book.badgeLabel ? (
              <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#7a2330] text-white shadow-sm border border-white/20">
                ✦ {book.badgeLabel[language]}
              </span>
            ) : <span />}

            {/* Stock pill */}
            <span
              className={cn(
                'px-2.5 py-1 rounded-full text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm border backdrop-blur-sm',
                inStock
                  ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50/90 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
              )}
            >
              <span className={cn('w-1.5 h-1.5 rounded-full', inStock ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
              <span>{inStock ? t.inStock : t.fewLeft}</span>
            </span>
          </div>

          {/* 3D-styled Book Cover */}
          <div className="relative mt-4 group">
            <div className="w-[190px] aspect-[1/1.38] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.28)] border border-white/20 transform transition-transform duration-300 group-hover:scale-102">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title[language]}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#7a2330] text-white text-5xl font-bold">
                  📖
                </div>
              )}
            </div>
            {/* Book spine lighting overlay */}
            <div className="absolute inset-y-0 left-0 w-3 rounded-l-2xl bg-gradient-to-r from-black/35 to-transparent pointer-events-none" />
          </div>
        </section>

        {/* ── Title & Price Header ───────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          {/* Category & Item Type Tag */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-[#7a2330] dark:text-[#E8886E] text-[11px] font-bold border border-brand-200/60 dark:border-brand-800/40">
              {book.itemType === 'sacred_item' ? '⛪ ንዋየ ቅድሳት' : '📖 መጽሐፍ'}
            </span>
            <span className="text-[12px] text-text-muted">·</span>
            <span className="text-[12px] font-medium text-text-muted truncate">
              {book.publisher?.[language] ?? book.author[language]}
            </span>
          </div>

          {/* Book Title */}
          <h1 className="text-[22px] font-extrabold text-text-primary leading-snug tracking-tight">
            {book.title[language]}
          </h1>

          {/* Author */}
          <p className="text-[13.5px] font-semibold text-text-secondary flex items-center gap-1.5">
            <span>{language === 'am' ? 'ደራሲ / አዘጋጅ፦' : 'Author:'}</span>
            <span className="text-text-primary">{book.author[language]}</span>
          </p>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between mt-1 pt-2 border-t border-border-subtle">
            <div className="flex items-baseline gap-2">
              <span className="text-[26px] font-extrabold text-[#7a2330] dark:text-[#E8886E] leading-none">
                {book.price.toLocaleString()}
              </span>
              <span className="text-[15px] font-bold text-[#B2782A]">
                {language === 'am' ? 'ብር' : 'ETB'}
              </span>

              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-[14px] text-text-muted line-through font-medium ml-1">
                  {book.originalPrice.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
                </span>
              )}
            </div>

            {book.discountPercent && (
              <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[11px] font-extrabold shadow-sm">
                -{book.discountPercent}% {language === 'am' ? 'ቅናሽ' : 'OFF'}
              </span>
            )}
          </div>
        </section>

        {/* ── Key Specifications Ribbon (Glass Cards) ───────────────── */}
        <section className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="bg-bg-card rounded-2xl p-3 border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center">
            <Icon name="BookOpen" size={18} className="text-[#B2782A] mb-1" />
            <span className="text-[10px] text-text-muted font-medium">{t.pages}</span>
            <span className="text-[13px] font-bold text-text-primary mt-0.5">
              {book.pageCount ? `${book.pageCount} ቅጽ` : '1 ቅጽ'}
            </span>
          </div>

          <div className="bg-bg-card rounded-2xl p-3 border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center">
            <Icon name="Languages" size={18} className="text-[#7a2330] dark:text-[#E8886E] mb-1" />
            <span className="text-[10px] text-text-muted font-medium">{t.languageLabel}</span>
            <span className="text-[12px] font-bold text-text-primary mt-0.5 truncate max-w-full">
              {t.langValue}
            </span>
          </div>

          <div className="bg-bg-card rounded-2xl p-3 border border-border-subtle shadow-sm flex flex-col items-center justify-center text-center">
            <Icon name="CheckCircle" size={18} className="text-emerald-600 mb-1" />
            <span className="text-[10px] text-text-muted font-medium">{language === 'am' ? 'ሁኔታ' : 'Status'}</span>
            <span className="text-[12px] font-bold text-emerald-600 mt-0.5">
              {inStock ? (language === 'am' ? 'አለ' : 'Available') : (language === 'am' ? 'ውሱን' : 'Few')}
            </span>
          </div>
        </section>

        {/* ── Description / Excerpt ─────────────────────────────────── */}
        {book.description && (
          <section className="bg-bg-card rounded-2xl p-4 border border-border-subtle shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Icon name="AlignLeft" size={16} className="text-[#7a2330]" />
              <h2 className="text-[14px] font-bold text-text-primary">{t.aboutTitle}</h2>
            </div>
            <p
              className={cn(
                'text-[13px] text-text-secondary leading-relaxed whitespace-pre-line',
                descExpanded ? '' : 'line-clamp-3',
              )}
            >
              {book.description[language]}
            </p>
            <button
              onClick={() => setDescExpanded((v) => !v)}
              className="text-[11.5px] font-bold text-[#7a2330] dark:text-[#E8886E] flex items-center gap-1 self-start mt-1 active:scale-95 transition-all"
            >
              <span>{descExpanded ? t.showLess : t.readMore}</span>
              <Icon name={descExpanded ? 'ChevronUp' : 'ChevronDown'} size={14} />
            </button>
          </section>
        )}

        {/* ── Trust Seals Ribbon ─────────────────────────────────────── */}
        <section className="bg-bg-secondary rounded-2xl p-3.5 border border-border-subtle flex flex-col gap-2">
          <div className="flex items-center gap-2.5 text-[12px] text-text-secondary font-medium">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 shrink-0">
              ✓
            </div>
            <span>{t.authenticSeal}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[12px] text-text-secondary font-medium">
            <div className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-[#7a2330] shrink-0">
              💳
            </div>
            <span>{t.easyWalletPay}</span>
          </div>
        </section>

        {/* ── Related / Similar Items ────────────────────────────────── */}
        {filteredRelated.length > 0 && (
          <section className="pt-2 pb-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-text-primary">{t.relatedTitle}</h2>
              <Link
                to={ROUTES.CATALOG.ROOT}
                className="text-[12px] font-semibold text-accent-500 hover:text-brand-500 transition-colors"
              >
                {t.seeAll}
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {filteredRelated.map((item) => (
                <BookCard
                  key={item.id}
                  book={item}
                  className="w-[140px] shrink-0"
                  onToggleSaved={(id) => toggleSaved.mutate(id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Sticky Bottom Action Bar ─────────────────────────────────── */}
      <footer
        className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto z-40 bg-bg-card/98 backdrop-blur-xl border-t border-border-subtle shadow-[0_-8px_30px_rgba(0,0,0,0.18)] px-4 py-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 8px)' }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Quantity Controls + Total */}
          <div className="flex flex-col gap-1 shrink-0">
            <div className="flex items-center gap-2 bg-bg-secondary p-1 rounded-xl border border-border-subtle">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-bg-card flex items-center justify-center text-text-primary shadow-sm active:scale-90 transition-all font-bold disabled:opacity-40"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-5 text-center font-bold text-[13px] tabular-nums text-text-primary">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-lg bg-bg-card flex items-center justify-center text-text-primary shadow-sm active:scale-90 transition-all font-bold"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span className="text-[11px] font-extrabold text-[#7a2330] dark:text-[#E8886E] pl-1">
              {totalPrice.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
              {savings > 0 && <span className="text-[10px] text-text-muted font-normal ml-1">(-{savings})</span>}
            </span>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={handleAddToCart}
              className={cn(
                'flex-1 h-11 px-3 rounded-2xl border border-border-subtle bg-bg-secondary hover:bg-bg-card text-text-primary font-bold text-[12.5px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-sm',
                addedAnim && 'bg-emerald-50 border-emerald-300 text-emerald-700',
              )}
            >
              <Icon name={addedAnim ? 'Check' : 'ShoppingBag'} size={16} />
              <span>{addedAnim ? (language === 'am' ? 'ተጨምሯል!' : 'Added!') : t.addToCart}</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 h-11 px-3 rounded-2xl bg-gradient-to-r from-[#7a2330] to-[#9E2B3E] hover:from-[#601221] hover:to-[#7a2330] text-white font-extrabold text-[12.5px] flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all"
            >
              <span>{t.buyNow}</span>
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
        </div>
      </footer>

      {/* ── Purchase Confirmation Bottom Sheet ─────────────────────── */}
      {purchaseSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPurchaseSheetOpen(false);
          }}
        >
          <div className="bg-bg-primary rounded-t-3xl w-full max-w-lg p-5 shadow-2xl flex flex-col gap-4 border-t border-border-subtle animate-slide-up">
            <div className="flex items-center justify-between pb-1 border-b border-border-subtle/50">
              <span className="text-[14px] font-extrabold text-text-primary">
                {language === 'am' ? 'የግዢ ማረጋገጫ' : 'Confirm Purchase'}
              </span>
              <button
                type="button"
                onClick={() => setPurchaseSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Book Info Summary */}
            <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-2xl border border-border-subtle">
              <div className="w-14 h-16 rounded-xl overflow-hidden bg-bg-card border border-border-subtle shrink-0">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt={book.title[language]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted">
                    <Icon name="Book" size={20} />
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="text-[13px] font-bold text-text-primary truncate">{book.title[language]}</h4>
                <span className="text-[11px] text-text-muted">{book.author[language]}</span>
                <span className="text-[12px] font-extrabold text-[#7a2330] dark:text-[#E8886E] mt-0.5">
                  {quantity} × {book.price.toLocaleString()} = {totalPrice.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
                </span>
              </div>
            </div>

            {/* Wallet Calculation */}
            <div className="p-3.5 rounded-2xl bg-bg-secondary flex flex-col gap-2 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-text-muted">{language === 'am' ? 'የቦርሳዎ ቀሪ ሒሳብ' : 'Current Balance'}</span>
                <span className="text-text-primary font-mono font-bold">
                  {(balanceQuery.data?.totalBalance ?? 0).toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{language === 'am' ? 'የሚቀነስ ክፍያ' : 'Deduction'}</span>
                <span className="text-rose-600 font-mono font-bold">
                  -{totalPrice.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border-subtle/50">
                <span className="text-text-muted">{language === 'am' ? 'ከክፍያ በኋላ የሚቀር' : 'Remaining Balance'}</span>
                <span
                  className={cn(
                    'font-mono font-extrabold',
                    (balanceQuery.data?.totalBalance ?? 0) >= totalPrice
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600'
                  )}
                >
                  {((balanceQuery.data?.totalBalance ?? 0) - totalPrice).toLocaleString()}{' '}
                  {language === 'am' ? 'ብር' : 'ETB'}
                </span>
              </div>
            </div>

            {(balanceQuery.data?.totalBalance ?? 0) < totalPrice && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center justify-between">
                <span className="text-[12px] font-bold text-rose-700 dark:text-rose-300">
                  {language === 'am' ? 'ቀሪ ሒሳብዎ በቂ አይደለም' : 'Insufficient wallet balance'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPurchaseSheetOpen(false);
                    navigate(ROUTES.WALLET.DEPOSIT);
                  }}
                  className="px-3 py-1 rounded-lg bg-[#5c0b1c] text-white text-[11px] font-bold shadow-sm"
                >
                  {language === 'am' ? 'ገንዘብ አስገባ' : 'Deposit'}
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPurchaseSheetOpen(false)}
                className="h-11 flex-1 rounded-2xl bg-bg-secondary hover:bg-bg-card border border-border-subtle text-text-primary font-semibold text-[13px] active:scale-[0.98] transition-all"
              >
                {language === 'am' ? 'ይቅር' : 'Cancel'}
              </button>

              <button
                type="button"
                disabled={
                  (balanceQuery.data?.totalBalance ?? 0) < totalPrice || deductMutation.isPending
                }
                onClick={handleConfirmPurchase}
                className={cn(
                  'h-11 flex-[2] rounded-2xl font-extrabold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]',
                  (balanceQuery.data?.totalBalance ?? 0) >= totalPrice && !deductMutation.isPending
                    ? 'bg-[#5c0b1c] hover:bg-[#7a2330] text-white shadow-[#5c0b1c]/25 cursor-pointer'
                    : 'bg-bg-secondary text-text-muted border border-border-subtle cursor-not-allowed opacity-60'
                )}
              >
                {deductMutation.isPending ? (
                  <Icon name="Loader2" size={17} className="animate-spin" />
                ) : (
                  <Icon name="Check" size={17} />
                )}
                <span>{language === 'am' ? 'አረጋግጥና ክፈል' : 'Confirm & Pay'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ─────────────────────────────────────────────── */}
      {purchaseSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-subtle rounded-3xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center text-center gap-4 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Icon name="Check" size={32} />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-black text-text-primary leading-tight">
                {language === 'am' ? 'ግዢዎ በተሳካ ሁኔታ ተጠናቋል!' : 'Purchase Successful!'}
              </h2>
              <p className="text-[12px] text-text-muted leading-relaxed mt-1">
                {language === 'am'
                  ? 'ክፍያው ከቦርሳዎ ተቀንሷል። እቃውን በሰንበት ት/ቤቱ መደብር መውሰድ ይችላሉ።'
                  : 'Payment was deducted from your wallet. You can pick up your book at the store.'}
              </p>
            </div>

            <div className="w-full bg-bg-secondary rounded-2xl p-3 border border-border-subtle flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-text-muted">ማጣቀሻ / Reference</span>
                <span className="text-text-primary font-mono font-bold">{purchasedOrderRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">የተከፈለ / Paid</span>
                <span className="text-[#5c0b1c] dark:text-rose-400 font-extrabold">
                  {totalPrice.toLocaleString()} {language === 'am' ? 'ብር' : 'ETB'}
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setPurchaseSuccessModalOpen(false);
                  navigate(ROUTES.CATALOG.ROOT);
                }}
                className="h-11 w-full bg-[#5c0b1c] hover:bg-[#7a2330] text-white rounded-2xl text-[13px] font-extrabold shadow-md active:scale-[0.98] transition-all"
              >
                {language === 'am' ? 'ወደ መደብር ተመለስ' : 'Back to Store'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPurchaseSuccessModalOpen(false);
                  navigate(ROUTES.WALLET.ROOT);
                }}
                className="h-10 w-full bg-bg-secondary hover:bg-bg-card text-text-primary border border-border-subtle rounded-2xl text-[12px] font-bold active:scale-[0.98] transition-all"
              >
                {language === 'am' ? 'የቦርሳ ታሪክ እይ' : 'View Wallet'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
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

export default ProductDetailPage;
