import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { ErrorState } from '@/shared/ui/ErrorState';
import { telegramAdapter } from '@/shared/telegram';
import { cn } from '@/shared/lib';
import { Avatar } from '@/shared/ui/Avatar';
import {
  useWalletBalanceQuery,
  useWalletTransactionsQuery,
  usePendingDepositsQuery,
  usePaymentAccountsQuery,
} from '@/features/wallet/api';
import { TransactionCategory, WalletTransaction } from '@/features/wallet/types';

// ─── Sub-components ───────────────────────────────────────────────────────────

// Small inline receipt modal
interface TxModalState {
  open: boolean;
  tx: WalletTransaction | null;
}

const TxDetailModal: React.FC<{ state: TxModalState; onClose: () => void; language: 'am' | 'en' }> = ({
  state,
  onClose,
  language,
}) => {
  if (!state.open || !state.tx) return null;
  const tx = state.tx;
  const isCredit = tx.sign === 'credit';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl flex flex-col gap-4 border border-[#ECE7E1]">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-[#7A7073]">
            {language === 'am' ? 'የደረሰኝ ዝርዝር መረጃ' : 'Transaction Details'}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#7A7073] hover:text-[#241E20]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-4 px-3 bg-[#FAF6F2] rounded-2xl border border-[#EEE7DF]/60">
          <span className="text-[14px] font-bold text-[#241E20] text-center truncate max-w-full">
            {tx.title[language]}
          </span>
          <span className={cn('text-[28px] font-extrabold my-1', isCredit ? 'text-emerald-700' : 'text-[#5c0b1c]')}>
            {isCredit ? '+' : '-'}{tx.amount.toLocaleString()} ETB
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white text-[#7A7073] text-[11px] font-semibold border border-[#E0D8CE]">
            {tx.status[language]}
          </span>
        </div>
        <div className="flex flex-col gap-2 text-[12px]">
          <div className="flex justify-between py-1 border-b border-[#EEE7DF]/40">
            <span className="text-[#A39A9D]">{language === 'am' ? 'ቀን' : 'Date'}</span>
            <span className="text-[#241E20] font-medium">{tx.date[language]}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#EEE7DF]/40">
            <span className="text-[#A39A9D]">{language === 'am' ? 'የግብይት ቁጥር' : 'Reference'}</span>
            <span className="text-[#241E20] font-mono font-medium">{tx.reference}</span>
          </div>
          <div className="flex flex-col gap-1 py-1">
            <span className="text-[#A39A9D]">{language === 'am' ? 'ማብራሪያ' : 'Description'}</span>
            <p className="text-[#7A7073] leading-snug">{tx.description[language]}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-11 w-full bg-[#F5EFEB] text-[#241E20] rounded-xl text-[13px] font-semibold hover:bg-[#EFE8E2] transition-colors"
        >
          {language === 'am' ? 'ተመለስ' : 'Close'}
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const WalletPage: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const user = telegramAdapter.getUser();
  const displayName = user?.first_name ?? 'ቴዎድሮስ';

  const [depositPanelOpen, setDepositPanelOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TransactionCategory | undefined>(undefined);
  const [txModal, setTxModal] = useState<TxModalState>({ open: false, tx: null });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const balance = useWalletBalanceQuery();
  const transactions = useWalletTransactionsQuery(activeFilter);
  const pending = usePendingDepositsQuery();
  const accounts = usePaymentAccountsQuery();

  const isLoading = balance.isLoading || transactions.isLoading;
  const hasError = balance.isError || transactions.isError;

  const refetchAll = () => { balance.refetch(); transactions.refetch(); pending.refetch(); };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* no-op */
    }
  };

  const getCategoryIcon = (category: TransactionCategory, sign: 'credit' | 'debit') => {
    if (category === 'purchase') return { icon: '📖', bg: 'bg-rose-50 border-rose-100' };
    if (category === 'equb' && sign === 'debit') return { icon: '🔄', bg: 'bg-amber-50 border-amber-100' };
    if (category === 'equb' && sign === 'credit') return { icon: '🏅', bg: 'bg-orange-50 border-orange-200/80' };
    if (category === 'deposit') return { icon: '↓', bg: 'bg-emerald-50 border-emerald-100', emerald: true };
    return { icon: '💳', bg: 'bg-[#F5EFEB] border-[#EEE7DF]' };
  };

  if (hasError) {
    return <div className="px-5 pt-20"><ErrorState onRetry={refetchAll} /></div>;
  }

  const t = {
    walletTitle: language === 'am' ? 'ቦርሳ' : 'Wallet',
    storeName: language === 'am' ? 'ቅድስት ሥላሴ መጽሐፍ መደብር' : 'Holy Trinity Book Store',
    balanceLabel: language === 'am' ? 'የቦርሳ ቀሪ ሂሳብ' : 'Wallet Balance',
    inStoreOnly: language === 'am' ? 'በቦታው ብቻ' : 'In-Store Only',
    disclaimer: language === 'am'
      ? 'ለመጽሐፍት ግዢና ለእቁብ መዋጮ ብቻ የሚያገለግል (ጥሬ ወጪ የለውም)'
      : 'For book purchases and equb contributions only (no cash withdrawal)',
    deposit: language === 'am' ? '+ ገንዘብ አስገባ' : '+ Deposit',
    viewDetails: language === 'am' ? 'ዝርዝር መረጃ' : 'View Details',
    pendingTitle: language === 'am' ? 'በማረጋገጥ ላይ ያለ ተቀማጭ' : 'Pending Deposit',
    pendingBadge: language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending',
    txHistory: language === 'am' ? 'የግብይት ታሪክ' : 'Transaction History',
    seeAll: language === 'am' ? 'ሁሉንም እይ' : 'See All',
    depositPanelTitle: language === 'am' ? 'ገንዘብ ማስተላለፊያ የባንክ ሂሳቦች' : 'Bank Transfer Accounts',
    depositInstruction: language === 'am'
      ? 'ከታች ከተዘረዘሩት የቤተ-መጻሕፍቱ ይፋዊ ሂሳቦች በአንዱ ገንዘብ ካስገቡ በኋላ ደረሰኙን እዚህ ይላኩ።'
      : 'Transfer to one of the store\'s official accounts below, then send your receipt here.',
    receiptUpload: language === 'am' ? 'የስክሪንሾት ደረሰኝ እዚህ ይጫኑ' : 'Upload screenshot receipt here',
    receiptTypes: language === 'am' ? 'PNG, JPG እስከ 5MB' : 'PNG, JPG up to 5MB',
    submitReceipt: language === 'am' ? 'ደረሰኝ አስገባ' : 'Submit Receipt',
    copy: language === 'am' ? 'ቅዳ' : 'Copy',
    copied: language === 'am' ? 'ተቀድቷል' : 'Copied',
    filterAll: language === 'am' ? 'ሁሉም' : 'All',
    filterDeposit: language === 'am' ? 'ተቀማጭ' : 'Deposits',
    filterPurchase: language === 'am' ? 'ግዢ' : 'Purchases',
    filterEqub: language === 'am' ? 'እቁብ' : 'Equb',
  };

  const filterTabs: { label: string; value: TransactionCategory | undefined }[] = [
    { label: t.filterAll, value: undefined },
    { label: t.filterDeposit, value: 'deposit' },
    { label: t.filterPurchase, value: 'purchase' },
    { label: t.filterEqub, value: 'equb' },
  ];

  return (
    <div className="w-full bg-[#F8F7F5] min-h-screen flex flex-col pb-20">

      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F8F7F5]/90 backdrop-blur-md px-5 pt-4 pb-2">
        <div className="flex items-center justify-between">
          {/* Avatar + Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar name={displayName} src={user?.photo_url} size="md" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-bold text-[#241E20] leading-tight">{t.walletTitle}</span>
                <span className="text-[12px] font-medium text-[#A39A9D]">· Wallet</span>
              </div>
              <span className="text-[11.5px] text-[#7A7073] leading-tight mt-0.5 truncate max-w-[170px]">
                {t.storeName}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.CATALOG.SEARCH}
              aria-label="Search"
              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#7A7073] hover:text-[#241E20] active:scale-95 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </Link>
            <button
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-8 px-2.5 rounded-full bg-white/90 border border-[#ECE7E1] text-[11px] font-semibold text-[#241E20] flex items-center gap-1 shadow-sm hover:border-[#D4902A] active:scale-95 transition-all"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#B2782A]">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className={language === 'am' ? 'text-[#5c0b1c] font-bold' : 'text-[#A39A9D]'}>አማ</span>
              <span className="text-[#C5BDBE]">/</span>
              <span className={language === 'en' ? 'text-[#5c0b1c] font-bold' : 'text-[#A39A9D] font-normal'}>EN</span>
            </button>
            <Link
              to={ROUTES.NOTIFICATIONS}
              aria-label="Notifications"
              className="relative w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#241E20] active:scale-95 transition-transform"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E5484D]" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 pt-3 pb-4 gap-4 max-w-md mx-auto w-full">

        {/* ── Wallet Balance Hero Card ────────────────────────────── */}
        <section className="bg-white rounded-3xl p-5 border border-[#ECE7E1] shadow-[0_8px_24px_rgba(36,30,32,0.04)] relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-orange-500/5 blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#B2782A]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <span className="text-[13px] font-medium text-[#7A7073]">{t.balanceLabel}</span>
              {/* Pulsing live indicator */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F5EFEB] text-[#7A7073] font-medium">
              {t.inStoreOnly}
            </span>
          </div>

          {/* Balance amount */}
          <div className="flex items-baseline gap-2 mb-2">
            {isLoading ? (
              <div className="h-9 w-32 bg-[#F0E9E0] rounded animate-pulse" />
            ) : (
              <>
                <h1 className="text-[34px] font-extrabold tracking-tight text-[#241E20] leading-none">
                  {(balance.data?.totalBalance ?? 0).toLocaleString()}
                </h1>
                <span className="text-[15px] font-bold text-[#B2782A]">ETB</span>
              </>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#A39A9D] mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#B2782A] shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{t.disclaimer}</span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="wallet-deposit-btn"
              onClick={() => setDepositPanelOpen((v) => !v)}
              className="h-11 px-4 rounded-2xl bg-[#5c0b1c] hover:bg-[#7a2330] text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span>{t.deposit}</span>
            </button>
            <button
              id="wallet-details-btn"
              className="h-11 px-4 rounded-2xl bg-[#F5EFEB] hover:bg-[#EFE8E2] text-[#241E20] font-semibold text-[13px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#7A7073]">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>{t.viewDetails}</span>
            </button>
          </div>
        </section>

        {/* ── Deposit Panel (expandable) ──────────────────────────── */}
        {depositPanelOpen && (
          <section className="bg-white rounded-3xl p-5 border border-[#ECE7E1] shadow-md flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5c0b1c" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <h2 className="text-[16px] font-bold text-[#241E20]">{t.depositPanelTitle}</h2>
              </div>
              <button
                onClick={() => setDepositPanelOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F5EFEB] flex items-center justify-center text-[#7A7073] hover:text-[#241E20]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-[12px] text-[#7A7073] leading-relaxed">{t.depositInstruction}</p>

            {/* Payment accounts */}
            <div className="flex flex-col gap-2">
              {(accounts.data ?? []).map((acc) => (
                <div key={acc.id} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F2] border border-[#EEE7DF]/60">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                      'w-8 h-8 rounded-lg font-bold flex items-center justify-center text-[12px] shrink-0',
                      acc.id === 'telebirr' && 'bg-orange-100/70 text-[#5c0b1c]',
                      acc.id === 'cbe' && 'bg-amber-100 text-[#B2782A]',
                      acc.id === 'boa' && 'bg-rose-100 text-[#821D30]',
                    )}>
                      {acc.id === 'telebirr' ? 'TB' : acc.id === 'cbe' ? 'CBE' : 'BOA'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-bold text-[#241E20]">
                        {language === 'am' ? acc.labelAm : acc.labelEn}
                      </span>
                      <span className="text-[11.5px] font-mono text-[#7A7073] tracking-wide">{acc.accountNumber}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(acc.shortCode, acc.id)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#E5DFD7] text-[#241E20] flex items-center gap-1 text-[11px] font-medium shadow-sm hover:bg-[#F5EFEB] transition-colors shrink-0"
                  >
                    {copiedId === acc.id ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-emerald-600">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Receipt upload area */}
            <div className="h-24 rounded-2xl border-2 border-dashed border-[#DDD5CC] bg-white flex flex-col items-center justify-center p-3 gap-1 cursor-pointer hover:bg-[#FAF6F2] transition-colors">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#A39A9D]">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-[12px] font-semibold text-[#7A7073]">{t.receiptUpload}</span>
              <span className="text-[10px] text-[#A39A9D]">{t.receiptTypes}</span>
            </div>

            <button className="h-11 w-full bg-[#5c0b1c] hover:bg-[#7a2330] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{t.submitReceipt}</span>
            </button>
          </section>
        )}

        {/* ── Pending Deposit Card ────────────────────────────────── */}
        {(pending.data ?? []).length > 0 && (
          <section className="bg-white rounded-2xl p-4 border border-[#ECE7E1] shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </span>
                <span className="text-[13px] font-bold text-[#241E20]">{t.pendingTitle}</span>
              </div>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                {t.pendingBadge}
              </span>
            </div>
            {pending.data!.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between bg-[#FAF6F2] rounded-xl px-3.5 py-3 border border-[#EEE7DF]/60">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#5c0b1c] shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13.5px] font-bold text-[#241E20] truncate">
                      {dep.amount.toLocaleString()} ETB · {dep.paymentMethod === 'telebirr' ? 'ቴሌብር (Telebirr)' : dep.paymentMethod.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-[#A39A9D] truncate">
                      {language === 'am' ? 'ማጣቀሻ' : 'Ref'}: {dep.reference} · {language === 'am' ? 'ከ45 ደቂቃ በፊት' : '45 min ago'}
                    </span>
                  </div>
                </div>
                <button
                  className="w-8 h-8 rounded-full hover:bg-[#F5EFEB] flex items-center justify-center text-[#B2782A] shrink-0 transition-colors"
                  title={language === 'am' ? 'ደረሰኝ እይ' : 'View Receipt'}
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </button>
              </div>
            ))}
          </section>
        )}

        {/* ── Transaction History ─────────────────────────────────── */}
        <section className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A7073" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.61" />
              </svg>
              <h2 className="text-[17px] font-bold text-[#241E20]">{t.txHistory}</h2>
            </div>
            <button className="text-[12px] font-semibold text-[#B2782A] hover:text-[#5c0b1c] transition-colors">
              {t.seeAll}
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                id={`filter-${tab.value ?? 'all'}`}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  'shrink-0 px-3.5 py-1.5 rounded-full text-[12px] shadow-sm active:scale-95 transition-all',
                  activeFilter === tab.value
                    ? 'bg-[#5c0b1c] text-white font-bold'
                    : 'bg-white border border-[#E9E4DE] text-[#7A7073] hover:text-[#241E20] font-medium shadow-sm',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Transaction rows */}
          <div className="flex flex-col gap-2.5">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-white border border-[#ECE7E1] animate-pulse" />
              ))
            ) : (transactions.data ?? []).map((tx) => {
              const isCredit = tx.sign === 'credit';
              const catInfo = getCategoryIcon(tx.category, tx.sign);

              return (
                <article
                  key={tx.id}
                  onClick={() => setTxModal({ open: true, tx })}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#ECE7E1] shadow-sm hover:border-[#D9CFBE] transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn('w-10 h-10 rounded-full border flex items-center justify-center shrink-0 text-[18px]', catInfo.bg)}>
                      {catInfo.emerald ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-emerald-700">
                          <path d="M12 19V5M5 12l7 7 7-7" />
                        </svg>
                      ) : (
                        <span>{catInfo.icon}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-bold text-[#241E20] truncate">
                          {tx.title[language]}
                        </span>
                        {tx.category === 'deposit' && tx.sign === 'credit' && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9.5px] font-bold shrink-0">
                            {language === 'am' ? 'የተረጋገጠ' : 'Verified'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#A39A9D] mt-0.5">
                        <span>{tx.date[language].split(' ')[0]} {tx.date[language].split(' ')[1]}</span>
                        <span>•</span>
                        <span className={cn(
                          tx.category === 'equb' ? 'text-[#B2782A] font-medium' : 'text-[#7A7073]',
                        )}>
                          {tx.subtitle[language].split('•')[1]?.trim() ?? tx.status[language]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className={cn(
                      'text-[14px] font-extrabold',
                      isCredit
                        ? tx.category === 'equb' ? 'text-[#B2782A]' : 'text-emerald-700'
                        : 'text-[#241E20]',
                    )}>
                      {isCredit ? '+' : '-'}{tx.amount.toLocaleString()} ETB
                    </span>
                    <span className={cn(
                      'text-[10px]',
                      tx.category === 'equb' && isCredit ? 'text-[#B2782A] font-medium' : 'text-[#A39A9D]',
                    )}>
                      {tx.category === 'purchase'
                        ? (language === 'am' ? 'የቦርሳ ክፍያ' : 'Wallet payment')
                        : tx.category === 'equb' && !isCredit
                          ? (language === 'am' ? 'ቀጥታ መዋጮ' : 'Direct contribution')
                          : tx.category === 'deposit'
                            ? (language === 'am' ? 'ገቢ ተቀማጭ' : 'Incoming deposit')
                            : (language === 'am' ? 'የእቁብ ድርሻ' : 'Equb credit')}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── Transaction Detail Modal ─────────────────────────────── */}
      <TxDetailModal state={txModal} onClose={() => setTxModal({ open: false, tx: null })} language={language} />
    </div>
  );
};

export default WalletPage;
