import React, { useState } from 'react';
import { useLanguage } from '@/shared/i18n';
import { ErrorState } from '@/shared/ui/ErrorState';
import { cn } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';
import { useThemeStore } from '@/shared/theme';
import { NotificationPanel } from '@/shared/components/display/NotificationPanel';
import {
  useWalletBalanceQuery,
  useWalletTransactionsQuery,
  usePendingDepositsQuery,
  usePaymentAccountsQuery,
} from '@/features/wallet/api';
import { TransactionCategory, WalletTransaction } from '@/features/wallet/types';

// ─── Transaction Detail Modal ──────────────────────────────────────────────────

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
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-0"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-bg-primary rounded-t-3xl w-full max-w-[440px] p-5 shadow-2xl flex flex-col gap-4 border-t border-border-subtle animate-slide-up">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-text-muted">
            {language === 'am' ? 'የደረሰኝ ዝርዝር' : 'Transaction Details'}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-3 px-3 bg-bg-secondary rounded-2xl">
          <span className="text-[13px] font-bold text-text-primary text-center truncate max-w-full">{tx.title[language]}</span>
          <span className={cn('text-[26px] font-extrabold my-1', isCredit ? 'text-emerald-600' : 'text-[#5c0b1c]')}>
            {isCredit ? '+' : '-'}{tx.amount.toLocaleString()} ETB
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-bg-card text-text-muted text-[11px] font-semibold border border-border-subtle">
            {tx.status[language]}
          </span>
        </div>
        <div className="flex flex-col gap-2 text-[12px]">
          <div className="flex justify-between py-1 border-b border-border-subtle/40">
            <span className="text-text-muted">{language === 'am' ? 'ቀን' : 'Date'}</span>
            <span className="text-text-primary font-medium">{tx.date[language]}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border-subtle/40">
            <span className="text-text-muted">{language === 'am' ? 'ማጣቀሻ' : 'Reference'}</span>
            <span className="text-text-primary font-mono font-medium">{tx.reference}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-full bg-bg-secondary text-text-primary rounded-xl text-[13px] font-semibold hover:bg-bg-card transition-colors"
        >
          {language === 'am' ? 'ዝጋ' : 'Close'}
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.28s cubic-bezier(0.32,0.72,0,1); }
      `}</style>
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────────

const WalletPage: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const [depositPanelOpen, setDepositPanelOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<TransactionCategory | undefined>(undefined);
  const [txModal, setTxModal] = useState<TxModalState>({ open: false, tx: null });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

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
    } catch { /* no-op */ }
  };

  const getCategoryIcon = (category: TransactionCategory, sign: 'credit' | 'debit') => {
    if (category === 'purchase') return { icon: '📖', bg: 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/30' };
    if (category === 'equb' && sign === 'debit') return { icon: '🔄', bg: 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/30' };
    if (category === 'equb' && sign === 'credit') return { icon: '🏅', bg: 'bg-orange-50 border-orange-200/80 dark:bg-orange-900/20 dark:border-orange-800/30' };
    if (category === 'deposit') return { icon: '↓', bg: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/30', emerald: true };
    return { icon: '💳', bg: 'bg-bg-secondary border-border-subtle' };
  };

  if (hasError) {
    return <div className="px-5 pt-20"><ErrorState onRetry={refetchAll} /></div>;
  }

  const t = {
    walletTitle: language === 'am' ? 'ቦርሳ' : 'Wallet',
    balanceLabel: language === 'am' ? 'የቦርሳ ቀሪ ሂሳብ' : 'Wallet Balance',
    deposit: language === 'am' ? '+ አስገባ' : '+ Deposit',
    viewDetails: language === 'am' ? 'ዝርዝር' : 'Details',
    pendingTitle: language === 'am' ? 'ተቀማጭ ማረጋገጫ ላይ' : 'Pending Deposit',
    pendingBadge: language === 'am' ? 'በጥበቃ' : 'Pending',
    txHistory: language === 'am' ? 'የግብይት ታሪክ' : 'Transactions',
    depositPanelTitle: language === 'am' ? 'ዝውውር ሂሳቦች' : 'Transfer Accounts',
    depositInstruction: language === 'am'
      ? 'ከዚህ በታች ካሉ ሂሳቦች ገንዘብ ካስገቡ ደረሰኙን ይላኩ።'
      : 'Transfer to an account below, then send your receipt.',
    receiptUpload: language === 'am' ? 'ደረሰኝ ይጫኑ' : 'Upload receipt',
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
    <div className="w-full bg-bg-primary text-text-primary min-h-screen flex flex-col pb-24">

      {/* ── Compact Sticky Header ───────────────────────────── */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-border-subtle">
              <img src="/app-logo.png" alt="logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-[15px] font-bold text-text-primary">{t.walletTitle}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            >
              <span className="text-[10px] font-extrabold text-brand-500">{language === 'am' ? 'EN' : 'አማ'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            >
              {resolvedTheme === 'dark'
                ? <Icon name="Sun" size={13} className="text-amber-400" />
                : <Icon name="Moon" size={13} className="text-brand-500" />
              }
            </button>
            <button
              onClick={() => setNotifOpen(true)}
              className="relative h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
            >
              <Icon name="Bell" size={14} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-4 pt-3 pb-3 gap-3 max-w-md mx-auto w-full">

        {/* ── Balance Card ─────────────────────────────────── */}
        <section className="bg-bg-card rounded-2xl p-4 border border-border-subtle shadow-card relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-[#7a2330]/5 blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200/60 dark:border-orange-800/30 flex items-center justify-center text-[#B2782A]">
                <Icon name="CreditCard" size={15} />
              </div>
              <span className="text-[12px] font-medium text-text-secondary">{t.balanceLabel}</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mb-3">
            {isLoading ? (
              <div className="h-8 w-28 bg-bg-secondary rounded animate-pulse" />
            ) : (
              <>
                <h1 className="text-[30px] font-extrabold tracking-tight text-text-primary leading-none">
                  {(balance.data?.totalBalance ?? 0).toLocaleString()}
                </h1>
                <span className="text-[13px] font-bold text-[#B2782A]">ETB</span>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDepositPanelOpen((v) => !v)}
              className="h-9 px-3 rounded-xl bg-[#5c0b1c] hover:bg-[#7a2330] text-white font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
            >
              <Icon name="Plus" size={15} />
              <span>{t.deposit}</span>
            </button>
            <button className="h-9 px-3 rounded-xl bg-bg-secondary hover:bg-bg-card text-text-primary font-semibold text-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all border border-border-subtle">
              <Icon name="FileText" size={15} className="text-text-muted" />
              <span>{t.viewDetails}</span>
            </button>
          </div>
        </section>

        {/* ── Deposit Panel ─────────────────────────────────── */}
        {depositPanelOpen && (
          <section className="bg-bg-card rounded-2xl p-4 border border-border-subtle shadow-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="CreditCard" size={18} className="text-[#5c0b1c]" />
                <h2 className="text-[14px] font-bold text-text-primary">{t.depositPanelTitle}</h2>
              </div>
              <button
                onClick={() => setDepositPanelOpen(false)}
                className="w-6 h-6 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">{t.depositInstruction}</p>

            <div className="flex flex-col gap-2">
              {(accounts.data ?? []).map((acc) => (
                <div key={acc.id} className="flex items-center justify-between p-2.5 rounded-xl bg-bg-secondary border border-border-subtle">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn(
                      'w-7 h-7 rounded-lg font-bold flex items-center justify-center text-[10px] shrink-0',
                      acc.id === 'telebirr' && 'bg-orange-100/70 dark:bg-orange-900/20 text-[#5c0b1c]',
                      acc.id === 'cbe' && 'bg-amber-100 dark:bg-amber-900/20 text-[#B2782A]',
                      acc.id === 'boa' && 'bg-rose-100 dark:bg-rose-900/20 text-[#821D30]',
                    )}>
                      {acc.id === 'telebirr' ? 'TB' : acc.id === 'cbe' ? 'CBE' : 'BOA'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-bold text-text-primary">{language === 'am' ? acc.labelAm : acc.labelEn}</span>
                      <span className="text-[10.5px] font-mono text-text-secondary">{acc.accountNumber}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(acc.shortCode, acc.id)}
                    className="px-2 py-1 rounded-lg bg-bg-primary border border-border-subtle text-text-primary flex items-center gap-1 text-[10px] font-medium hover:bg-bg-secondary transition-colors shrink-0"
                  >
                    {copiedId === acc.id ? (
                      <>
                        <Icon name="Check" size={12} className="text-emerald-600" />
                        <span className="text-emerald-600">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Icon name="Copy" size={12} />
                        <span>{t.copy}</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="h-20 rounded-xl border-2 border-dashed border-border-strong/50 bg-bg-secondary flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-bg-card transition-colors">
              <Icon name="Image" size={22} className="text-text-muted" />
              <span className="text-[11px] font-semibold text-text-secondary">{t.receiptUpload}</span>
            </div>

            <button className="h-10 w-full bg-[#5c0b1c] hover:bg-[#7a2330] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all">
              <Icon name="Upload" size={16} />
              <span>{t.submitReceipt}</span>
            </button>
          </section>
        )}

        {/* ── Pending Deposit ───────────────────────────────── */}
        {(pending.data ?? []).length > 0 && (
          <section className="bg-bg-card rounded-2xl p-3.5 border border-border-subtle shadow-card flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-[12px] font-bold text-text-primary">{t.pendingTitle}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 border border-amber-200/80 dark:border-amber-800/30">
                {t.pendingBadge}
              </span>
            </div>
            {pending.data!.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between bg-bg-secondary rounded-xl px-3 py-2.5 border border-border-subtle">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200/60 dark:border-orange-800/30 flex items-center justify-center text-[#5c0b1c] shrink-0">
                    <Icon name="Smartphone" size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-text-primary truncate">
                      {dep.amount.toLocaleString()} ETB · {dep.paymentMethod === 'telebirr' ? 'Telebirr' : dep.paymentMethod.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-text-muted">Ref: {dep.reference}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── Transaction History ───────────────────────────── */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-text-primary">{t.txHistory}</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  'shrink-0 px-3 py-1 rounded-full text-[11px] shadow-sm active:scale-95 transition-all',
                  activeFilter === tab.value
                    ? 'bg-[#5c0b1c] text-white font-bold'
                    : 'bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary font-medium',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Transaction rows */}
          <div className="flex flex-col gap-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-bg-card border border-border-subtle animate-pulse" />
              ))
            ) : (transactions.data ?? []).map((tx) => {
              const isCredit = tx.sign === 'credit';
              const catInfo = getCategoryIcon(tx.category, tx.sign);

              return (
                <article
                  key={tx.id}
                  onClick={() => setTxModal({ open: true, tx })}
                  className="flex items-center justify-between p-3 rounded-2xl bg-bg-card border border-border-subtle hover:border-border-strong transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn('w-9 h-9 rounded-full border flex items-center justify-center shrink-0 text-[16px]', catInfo.bg)}>
                      {(catInfo as any).emerald ? (
                        <Icon name="ArrowDown" size={16} className="text-emerald-700" />
                      ) : (
                        <span>{catInfo.icon}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] font-bold text-text-primary truncate">{tx.title[language]}</span>
                      <span className="text-[10.5px] text-text-muted">
                        {tx.date[language].split(' ')[0]} {tx.date[language].split(' ')[1]}
                      </span>
                    </div>
                  </div>
                  <span className={cn(
                    'text-[13px] font-extrabold shrink-0 pl-2',
                    isCredit
                      ? tx.category === 'equb' ? 'text-[#B2782A]' : 'text-emerald-600'
                      : 'text-text-primary',
                  )}>
                    {isCredit ? '+' : '-'}{tx.amount.toLocaleString()} ETB
                  </span>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <TxDetailModal state={txModal} onClose={() => setTxModal({ open: false, tx: null })} language={language} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} unreadCount={2} />
    </div>
  );
};

export default WalletPage;
