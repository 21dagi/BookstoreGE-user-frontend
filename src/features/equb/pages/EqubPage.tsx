import React, { useState } from 'react';
import { useLanguage } from '@/shared/i18n';
import { ErrorState } from '@/shared/ui/ErrorState';
import { cn } from '@/shared/lib';
import { useMyEqubQuery, useOpenEqubsQuery, usePayContributionMutation, useJoinEqubMutation } from '@/features/equb/api';
import { OpenEqubGroup } from '@/features/equb/types';
import { useThemeStore } from '@/shared/theme';
import { Icon } from '@/shared/ui/Icon';
import { NotificationPanel } from '@/shared/components/display/NotificationPanel';

type EqubTab = 'my' | 'open';

export const EqubPage: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<EqubTab>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [joinModalGroup, setJoinModalGroup] = useState<OpenEqubGroup | null>(null);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<string | null>(null);
  const [joinSuccessToast, setJoinSuccessToast] = useState<string | null>(null);

  const myEqubQuery = useMyEqubQuery();
  const openEqubsQuery = useOpenEqubsQuery();
  const payContributionMutation = usePayContributionMutation();
  const joinEqubMutation = useJoinEqubMutation();

  const isLoading = myEqubQuery.isLoading || openEqubsQuery.isLoading;
  const isError = myEqubQuery.isError || openEqubsQuery.isError;

  const myEqub = myEqubQuery.data;
  const openEqubs = openEqubsQuery.data ?? [];

  const handlePay = async (amount: number, round: number) => {
    if (!myEqub) return;
    try {
      await payContributionMutation.mutateAsync({
        equbId: myEqub.id,
        round,
        amount,
      });
      setPaymentModalOpen(false);
      setPaymentSuccessToast(
        language === 'am'
          ? `የዙር ${round} መዋጮ (${amount} ብር) በተሳካ ሁኔታ ተከፍሏል!`
          : `Round ${round} contribution (${amount} ETB) successfully paid!`
      );
      setTimeout(() => setPaymentSuccessToast(null), 4000);
    } catch {
      // Mock handles gracefully
    }
  };

  const handleJoin = async (group: OpenEqubGroup) => {
    try {
      await joinEqubMutation.mutateAsync(group.id);
      setJoinModalGroup(null);
      setJoinSuccessToast(
        language === 'am'
          ? `ለ'${group.title[language]}' ለመቀላቀል ጥያቄዎ በተሳካ ሁኔታ ተልኳል!`
          : `Application to join '${group.title[language]}' submitted successfully!`
      );
      setTimeout(() => setJoinSuccessToast(null), 4000);
    } catch {
      // Handled
    }
  };

  const { resolvedTheme, toggleTheme } = useThemeStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const t = {
    title: language === 'am' ? 'መጽሐፍ እቁብ' : 'Book Equb',
    subtitle: language === 'am' ? 'የኰኵሐ ሃይማኖት ሰንበት ት/ቤት' : 'Kokoha Haymanot Sunday School',
    tabMy: language === 'am' ? 'የእኔ እቁቦች (1)' : 'My Equbs (1)',
    tabOpen: language === 'am' ? 'ክፍት እቁቦች (3)' : 'Open Equbs (3)',
    activeCycle: language === 'am' ? 'ንቁ ዑደት' : 'Active Cycle',
    roundProgress: language === 'am' ? 'አጠቃላይ ጉዞ (Round Progress)' : 'Round Progress',
    roundOf: (curr: number, total: number) =>
      language === 'am' ? `ዙር ${curr} ከ ${total}` : `Round ${curr} of ${total}`,
    completed: language === 'am' ? 'ተጠናቋል' : 'completed',
    yourTurn: (round: number) =>
      language === 'am' ? `የእርስዎ ዙር፡ ዙር ${round}` : `Your Turn: Round ${round}`,
    turnDesc: (amt: number) =>
      language === 'am'
        ? `በመደብር አስተዳዳሪ የተመደበ የመጻሕፍት መግዣ ክሬዲት (${amt.toLocaleString()} ብር)።`
        : `Bookstore purchase credit voucher (${amt.toLocaleString()} ETB) allocated by store admin.`,
    creditNotice:
      language === 'am'
        ? 'ለመጻሕፍት ግዢ ብቻ የሚውል · በጥሬ ገንዘብ አይወጣም'
        : 'Bookstore purchases only · Non-withdrawable cash',
    nextContribution: language === 'am' ? 'የሚቀጥለው መዋጮ' : 'Next Contribution',
    birr: language === 'am' ? 'ብር' : 'ETB',
    dueDate: (date: string, days: number) =>
      language === 'am'
        ? `የመክፈያ ቀን፡ ${date} (በ${days} ቀን ውስጥ)`
        : `Due Date: ${date} (in ${days} days)`,
    payBtn: language === 'am' ? 'መዋጮ ይክፈሉ' : 'Pay Contribution',
    outstandingTitle: language === 'am' ? 'ያልተጠናቀቀ መዋጮ' : 'Pending Contribution',
    outstandingRound: (r: number) => (language === 'am' ? `ዙር ${r}` : `Round ${r}`),
    outstandingDesc: (amt: number, r: number) =>
      language === 'am'
        ? `ለዙር ${r} የቀረ ${amt} ብር መዋጮ አለ። እባክዎ በተመቻቸዎት ጊዜ በሰላም ያጠናቁ፤ የእርስዎ ጽናት ለጉባኤያችን በረከት ነው።`
        : `Pending ${amt} ETB contribution for Round ${r}. Please settle at your convenience; your commitment strengthens our community.`,
    viewDetails: language === 'am' ? 'ዝርዝር ይመልከቱ' : 'View Details',
    payNow: language === 'am' ? 'አሁን ይክፈሉ' : 'Pay Now',
    openSpotlightTitle: language === 'am' ? 'ለአዲስ ተሳታፊ ክፍት እቁብ' : 'Open for New Members',
    closesIn: (days: number) =>
      language === 'am' ? `በ${days} ቀን ይዘጋል` : `Closes in ${days} days`,
    details: language === 'am' ? 'ዝርዝር' : 'Details',
    whatIsEqubTitle: language === 'am' ? 'የመጽሐፍ እቁብ ምንድን ነው?' : 'What is Book Equb?',
    whatIsEqubBody:
      language === 'am'
        ? 'የመጽሐፍ እቁብ መንፈሳዊና ታሪካዊ መጻሕፍትን በጋራ መረዳዳት ወደ ግል ቤተ-መጻሕፍትዎ ለማስገባት የተዘጋጀ የተቀደሰ ማህበራዊ ሥርዓት ነው። አባላት በየተራ የገንዘብ ሳይሆን የየኰኵሐ ሃይማኖት ሰንበት ት/ቤት የመጻሕፍት መግዣ ክሬዲት (Voucher) ይቀበላሉ።'
        : 'Book Equb is a sacred community savings tradition created to build personal spiritual libraries together. Rather than cash payouts, members take turns receiving Kokoha Haymanot Sunday School Bookstore vouchers to purchase sacred books.',
    whatIsEqubGuarantee:
      language === 'am'
        ? 'ጥሬ ገንዘብ አይወጣም · ክሬዲቱ ለመጻሕፍት ብቻ ይውላል'
        : 'Zero cash disbursement · Credit redeemable for books only',
    contributionLabel: language === 'am' ? 'መዋጮ' : 'Contribution',
    membersLabel: language === 'am' ? 'ተሳታፊዎች' : 'Members',
    voucherLabel: language === 'am' ? 'የክሬዲት መጠን' : 'Voucher Amount',
    storeCreditOnly: language === 'am' ? 'የመደብር ክሬዲት ብቻ' : 'Store Credit Only',
    joinBtn: language === 'am' ? 'ይቀላቀሉ' : 'Join Group',
    confirmPaymentTitle: language === 'am' ? 'የእቁብ መዋጮ ማረጋገጫ' : 'Confirm Contribution Payment',
    fromWalletDesc:
      language === 'am'
        ? 'ክፍያው ከዋናው የደንበኛ ቦርሳዎ (Customer Wallet) በቀጥታ ይቀነሳል።'
        : 'Payment will be deducted directly from your verified Customer Wallet balance.',
    cancel: language === 'am' ? 'ተመለስ' : 'Cancel',
    confirmPay: language === 'am' ? 'አረጋግጥና ክፈል' : 'Confirm & Pay',
    joinModalTitle: language === 'am' ? 'በእቁብ ለመሳተፍ መጠየቅ' : 'Request to Join Equb',
    joinModalDesc:
      language === 'am'
        ? 'በዚህ እቁብ ሲሳተፉ በመደብሩ ደንብ መሠረት እያንዳንዱን ዙር በወቅቱ ለመክፈልና የመጻሕፍት ክሬዲት ለመቀበል ይስማማሉ።'
        : 'By joining, you agree to fulfill periodic contributions promptly and redeem designated book vouchers in person.',
    confirmJoin: language === 'am' ? 'ጥያቄ አቅርብ' : 'Submit Application',
  };

  const getEqubIcon = (type: string) => {
    switch (type) {
      case 'church':
        return '⛪';
      case 'auto_stories':
        return '📖';
      case 'menu_book':
        return '📚';
      case 'history_edu':
        return '📜';
      default:
        return '📖';
    }
  };

  if (isError) {
    return (
      <div className="w-full min-h-screen bg-[#FBF8F4] pt-20 px-4">
        <ErrorState onRetry={() => { myEqubQuery.refetch(); openEqubsQuery.refetch(); }} />
      </div>
    );
  }

  return (
    <div className="w-full bg-bg-primary text-text-primary min-h-screen flex flex-col pb-24">
      {/* ── Fixed Sticky Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          {/* Title & Emblem */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-border-subtle">
              <img
                src="/app-logo.png"
                alt="የኰኵሐ ሃይማኖት ሰንበት ት/ቤት"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[15px] font-bold text-text-primary">{t.title}</span>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-1.5">
            {/* Language Switch */}
            <button
              onClick={() => changeLanguage(language === 'am' ? 'en' : 'am')}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
              aria-label="Switch language"
            >
              <span className="text-[10px] font-extrabold text-brand-500">{language === 'am' ? 'EN' : 'አማ'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark'
                ? <Icon name="Sun" size={13} className="text-amber-400" />
                : <Icon name="Moon" size={13} className="text-brand-500" />
              }
            </button>

            {/* Search */}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((prev) => !prev)}
              className="h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-transform"
            >
              <Icon name="Search" size={13} />
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              onClick={() => setNotifOpen(true)}
              className="relative h-7 w-7 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center active:scale-95 transition-transform"
            >
              <Icon name="Bell" size={13} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
            </button>
          </div>
        </div>

        {/* Collapsible search bar */}
        {searchOpen && (
          <div className="mt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'am' ? 'እቁብ ይፈልጉ...' : 'Search equbs...'}
              className="w-full px-3.5 py-2 text-[13px] bg-bg-card border border-border-subtle text-text-primary placeholder:text-text-muted rounded-xl outline-none focus:border-brand-500 shadow-sm"
              autoFocus
            />
          </div>
        )}
      </header>

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <main className="flex flex-col relative w-full pt-3 px-4 max-w-lg mx-auto flex-1">
        {/* Segmented Navigation Tabs */}
        <div className="bg-bg-secondary p-1 rounded-2xl border border-border-subtle flex items-center gap-1">
          <button
            onClick={() => setActiveTab('my')}
            className={cn(
              'flex-1 h-10 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200',
              activeTab === 'my'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {/* Verified icon */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" />
            </svg>
            <span>{t.tabMy}</span>
          </button>

            <button
            onClick={() => setActiveTab('open')}
            className={cn(
              'flex-1 h-10 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-all duration-200',
              activeTab === 'open'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {/* Group add icon */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            <span>{t.tabOpen}</span>
          </button>
        </div>

        {/* ── TAB 1: MY EQUB (Active & Enrolled) ────────────────────── */}
        {activeTab === 'my' && (
          <div className="flex flex-col gap-4 mt-4">
            {isLoading ? (
              <div className="bg-bg-card rounded-2xl p-5 border border-border-subtle animate-pulse space-y-4">
                <div className="h-6 w-1/2 bg-bg-secondary rounded" />
                <div className="h-20 bg-bg-secondary rounded-xl" />
                <div className="h-16 bg-bg-secondary rounded-xl" />
              </div>
            ) : myEqub ? (
              <>
                {/* HERO CARD: Active Equb Cycle */}
                <section className="bg-bg-card rounded-2xl border border-border-subtle shadow-card overflow-hidden relative">
                  <div className="p-5 flex flex-col gap-4">
                    {/* Card Header & Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-brand-50/20 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0 text-[24px]">
                          ⛪
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-[17px] font-bold text-text-primary leading-tight truncate">
                            {myEqub.name[language]}
                          </h2>
                          <p className="text-[12px] text-text-secondary mt-0.5 font-medium">
                            {myEqub.groupLabel[language]} · {myEqub.memberCount} {language === 'am' ? 'ንቁ አባላት' : 'active members'}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5E7CE]/60 border border-[#7D5709]/20 text-[#7D5709] text-[11px] font-semibold shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7D5709] animate-pulse" />
                        {t.activeCycle}
                      </span>
                    </div>

                    {/* Progress Tracking */}
                    <div className="bg-[#F5EFE6]/70 rounded-xl p-3.5 border border-[#EDE6DB]/60 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-[#63585B] font-medium">{t.roundProgress}</span>
                        <span className="text-[#7A2330] font-bold">
                          {t.roundOf(myEqub.currentRound, myEqub.totalRounds)}
                        </span>
                      </div>
                      {/* Track */}
                      <div className="w-full bg-[#E5DCD1] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#7A2330] h-full rounded-full transition-all duration-500"
                          style={{ width: `${myEqub.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-[#968A8E]">
                        <span>{myEqub.startDate[language]}</span>
                        <span className="text-[#63585B] font-medium">
                          {Math.round(myEqub.progressPercent)}% {t.completed}
                        </span>
                        <span>{myEqub.endDate[language]}</span>
                      </div>
                    </div>

                    {/* Recipient Turn Highlight: Bookstore Purchasing Credit (NOT CASH) */}
                    <div className="bg-[#FAF3F4] rounded-xl p-3.5 border border-[#5C0B1C]/15 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#7A2330] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[14px] font-bold text-[#7A2330]">
                            {t.yourTurn(myEqub.userTurnRound)}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 bg-[#F9EDEF] rounded-md text-[#5C0B1C] font-medium border border-[#5C0B1C]/20">
                            {myEqub.userTurnMonth[language]}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#63585B] mt-1 leading-relaxed">
                          {t.turnDesc(myEqub.creditVoucherAmount)}
                        </p>
                        <div className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-medium text-[#63585B] bg-white/80 px-2 py-1 rounded-md border border-[#EDE6DB]">
                          <span className="text-emerald-700">🏪</span>
                          <span>{t.creditNotice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contribution Due Section */}
                    <div className="pt-2 border-t border-[#EDE6DB]/60 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-medium text-[#968A8E] block leading-none">
                          {t.nextContribution}
                        </span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-[22px] font-bold text-[#201A1C] tracking-tight">
                            {myEqub.nextContributionAmount.toLocaleString()}
                          </span>
                          <span className="text-[13px] font-semibold text-[#63585B]">{t.birr}</span>
                        </div>
                        <span className="text-[11px] text-[#63585B] block mt-0.5 font-medium">
                          {t.dueDate(myEqub.nextDueDate[language], myEqub.dueDaysLeft)}
                        </span>
                      </div>
                      <button
                        onClick={() => setPaymentModalOpen(true)}
                        className="h-11 px-5 rounded-full bg-[#7A2330] hover:bg-[#5C0B1C] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0_8px_24px_-6px_rgba(122,35,48,0.25)] active:scale-[0.98] transition-all shrink-0"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                        <span>{t.payBtn}</span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* GENTLE CATCH-UP / OUTSTANDING NOTICE */}
                {myEqub.hasOutstanding && myEqub.outstandingRound && (
                  <section className="bg-[#FFFBF2] rounded-2xl p-4 border border-[#E9D8B4] shadow-[0_2px_10px_-2px_rgba(36,30,32,0.05)] flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F5E7CE]/80 text-[#7D5709] flex items-center justify-center shrink-0 border border-[#7D5709]/20 text-[18px]">
                      ⏳
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[14px] font-bold text-[#644200]">{t.outstandingTitle}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#F5E7CE] text-[#7D5709] text-[11px] font-bold">
                          {t.outstandingRound(myEqub.outstandingRound)}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#63585B] mt-1 leading-relaxed">
                        {t.outstandingDesc(myEqub.outstandingAmount ?? 500, myEqub.outstandingRound)}
                      </p>
                      <div className="mt-3 flex items-center gap-2.5">
                        <button
                          onClick={() => setPaymentModalOpen(true)}
                          className="h-8 px-3.5 rounded-lg bg-white border border-[#E2CEAA] text-[#644200] text-[12px] font-semibold flex items-center gap-1 shadow-sm hover:bg-white active:scale-95 transition-all"
                        >
                          <span>{t.viewDetails}</span>
                        </button>
                        <button
                          onClick={() => setPaymentModalOpen(true)}
                          className="h-8 px-4 rounded-lg bg-[#7D5709] text-white text-[12px] font-semibold flex items-center gap-1 shadow-sm hover:bg-[#684606] active:scale-95 transition-all"
                        >
                          <span>{t.payNow}</span>
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {/* OPEN EQUB SPOTLIGHT PREVIEW */}
                <section className="bg-white rounded-2xl p-4 border border-[#EDE6DB] shadow-[0_2px_10px_-2px_rgba(36,30,32,0.05)] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#63585B] uppercase tracking-wider">
                      {t.openSpotlightTitle}
                    </span>
                    <span className="text-[11px] font-bold text-[#7A2330] bg-[#F9EDEF] px-2 py-0.5 rounded-full">
                      {t.closesIn(6)}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] flex items-center justify-center text-[#7A2330] shrink-0 border border-[#EDE6DB] text-[20px]">
                        📚
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#201A1C] leading-snug">
                          {language === 'am' ? 'የደብረ ሊባኖስ እቁብ (ቅጽ 2)' : 'Debre Libanos Equb (Vol 2)'}
                        </h4>
                        <p className="text-[11px] text-[#63585B]">
                          {language === 'am' ? '300 ብር/በወር · 18/20 አባላት (2 ቦታ ቀርቷል)' : '300 ETB/mo · 18/20 members (2 spots left)'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('open')}
                      className="h-8 px-3 rounded-lg bg-[#F9EDEF] text-[#7A2330] border border-[#5C0B1C]/20 text-[11px] font-bold hover:bg-[#5C0B1C]/10 active:scale-95 transition-all shrink-0"
                    >
                      {t.details}
                    </button>
                  </div>
                </section>

                {/* EDUCATIONAL & TRUST ASSURANCE CARD */}
                <section className="bg-white rounded-2xl p-4 border border-[#EDE6DB] shadow-[0_2px_10px_-2px_rgba(36,30,32,0.05)] flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[#7A2330]">
                    <span className="text-[20px]">📖</span>
                    <h3 className="text-[14px] font-bold">{t.whatIsEqubTitle}</h3>
                  </div>
                  <p className="text-[12px] text-[#63585B] leading-relaxed">
                    {t.whatIsEqubBody}
                  </p>
                  <div className="pt-2 border-t border-[#EDE6DB]/60 flex items-center gap-1.5 text-emerald-800 text-[11px] font-semibold">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>{t.whatIsEqubGuarantee}</span>
                  </div>
                </section>
              </>
            ) : null}
          </div>
        )}

        {/* ── TAB 2: OPEN EQUBS (Available Groups for Join) ───────── */}
        {activeTab === 'open' && (
          <div className="flex flex-col gap-4 mt-4">
            {openEqubs.map((group) => (
              <section
                key={group.id}
                className="bg-white rounded-2xl p-4 border border-[#EDE6DB] shadow-[0_2px_10px_-2px_rgba(36,30,32,0.05)] flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F9EDEF] border border-[#5C0B1C]/10 flex items-center justify-center text-[#7A2330] shrink-0 text-[20px]">
                      {getEqubIcon(group.iconType)}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#201A1C]">{group.title[language]}</h3>
                      <p className="text-[11px] text-[#63585B]">{group.subtitle[language]}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F9EDEF] text-[#7A2330] border border-[#5C0B1C]/20 shrink-0">
                    {t.closesIn(group.closesInDays)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#F5EFE6]/60 p-2.5 rounded-xl border border-[#EDE6DB]/60 text-center">
                  <div>
                    <span className="text-[10px] text-[#968A8E] block">{t.contributionLabel}</span>
                    <span className="text-[13px] font-bold text-[#201A1C]">
                      {group.contributionAmount.toLocaleString()} {t.birr}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#968A8E] block">{t.membersLabel}</span>
                    <span className="text-[13px] font-bold text-[#201A1C]">
                      {group.currentMembers} / {group.maxMembers}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#968A8E] block">{t.voucherLabel}</span>
                    <span className="text-[13px] font-bold text-[#7A2330]">
                      {group.creditVoucherAmount.toLocaleString()} {t.birr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[#63585B] text-[11px]">
                    <span className="text-emerald-700">🏪</span>
                    <span>{t.storeCreditOnly}</span>
                  </div>
                  <button
                    onClick={() => setJoinModalGroup(group)}
                    className="h-9 px-4 rounded-full bg-[#7A2330] hover:bg-[#5C0B1C] text-white text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-all shadow-sm"
                  >
                    <span>{t.joinBtn}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* ── Payment Confirmation Modal ─────────────────────────────── */}
      {paymentModalOpen && myEqub && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-[#EDE6DB] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE6DB]">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">🪙</span>
                <h3 className="font-bold text-[16px] text-[#201A1C]">{t.confirmPaymentTitle}</h3>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#63585B] text-[16px]"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 bg-[#FAF3F4] rounded-2xl border border-[#5C0B1C]/15 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#63585B] block">{myEqub.name[language]}</span>
                  <span className="font-bold text-[15px] text-[#7A2330]">
                    {t.roundOf(myEqub.currentRound, myEqub.totalRounds)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#63585B] block">{t.contributionLabel}</span>
                  <span className="text-[18px] font-extrabold text-[#201A1C]">
                    {myEqub.nextContributionAmount} {t.birr}
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-[#63585B] leading-relaxed">
                {t.fromWalletDesc}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-[#EDE6DB] font-semibold text-[13px] text-[#63585B] active:scale-95 transition-transform"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handlePay(myEqub.nextContributionAmount, myEqub.currentRound)}
                disabled={payContributionMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-[#7A2330] text-white font-bold text-[13px] shadow-sm active:scale-95 transition-transform disabled:opacity-50"
              >
                {payContributionMutation.isPending ? '...' : t.confirmPay}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Join Equb Modal ────────────────────────────────────────── */}
      {joinModalGroup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-[#EDE6DB] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EDE6DB]">
              <div className="flex items-center gap-2">
                <span className="text-[20px]">👥</span>
                <h3 className="font-bold text-[16px] text-[#201A1C]">{t.joinModalTitle}</h3>
              </div>
              <button
                onClick={() => setJoinModalGroup(null)}
                className="w-8 h-8 rounded-full bg-[#F5EFE6] flex items-center justify-center text-[#63585B] text-[16px]"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 bg-[#FAF3F4] rounded-2xl border border-[#5C0B1C]/15">
                <h4 className="font-bold text-[14px] text-[#7A2330]">
                  {joinModalGroup.title[language]}
                </h4>
                <div className="flex justify-between items-center mt-2 text-[12px] text-[#63585B]">
                  <span>{t.contributionLabel}: {joinModalGroup.contributionAmount} {t.birr}</span>
                  <span>{t.voucherLabel}: {joinModalGroup.creditVoucherAmount.toLocaleString()} {t.birr}</span>
                </div>
              </div>

              <p className="text-[12px] text-[#63585B] leading-relaxed">
                {t.joinModalDesc}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setJoinModalGroup(null)}
                className="flex-1 py-3 rounded-xl border border-[#EDE6DB] font-semibold text-[13px] text-[#63585B] active:scale-95 transition-transform"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handleJoin(joinModalGroup)}
                disabled={joinEqubMutation.isPending}
                className="flex-1 py-3 rounded-xl bg-[#7A2330] text-white font-bold text-[13px] shadow-sm active:scale-95 transition-transform disabled:opacity-50"
              >
                {joinEqubMutation.isPending ? '...' : t.confirmJoin}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notifications ───────────────────────────────────── */}
      {(paymentSuccessToast || joinSuccessToast) && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm bg-[#201A1C] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="text-emerald-400 text-[18px]">✓</span>
          <span className="text-[12px] font-medium leading-tight">
            {paymentSuccessToast || joinSuccessToast}
          </span>
        </div>
      )}

      {/* ── Notification Panel ───────────────────────────────────── */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} unreadCount={2} />
    </div>
  );
};

export default EqubPage;
