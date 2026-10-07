import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/shared/i18n';
import { ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/ui/Icon';
import { useThemeStore } from '@/shared/theme';
import { BackButton } from '@/shared/components/navigation/BackButton';
import { cn } from '@/shared/lib';
import { toast } from '@/shared/ui/Toast';

// ─── Bank Configurations ────────────────────────────────────────────────────────

export type BankId = 'telebirr' | 'cbe' | 'boa';

interface BankOption {
  id: BankId;
  nameAm: string;
  nameEn: string;
  tagAm: string;
  tagEn: string;
  logo: string;
  accountNumber: string;
  shortCode: string;
  accountName: string;
  brandColor: string;
  accentBg: string;
}

const BANKS: BankOption[] = [
  {
    id: 'telebirr',
    nameAm: 'ቴሌብር',
    nameEn: 'Telebirr',
    tagAm: 'ፈጣን የሞባይል ክፍያ',
    tagEn: 'Mobile Money',
    logo: '/assets/banks/telebirr.png',
    accountNumber: '0911 23 45 67',
    shortCode: '0911234567',
    accountName: 'የኰኵሐ ሃይማኖት ሰንበት ት/ቤት',
    brandColor: '#0172bb',
    accentBg: 'hover:border-[#0172bb]/60 dark:hover:border-[#0172bb]/80',
  },
  {
    id: 'cbe',
    nameAm: 'የኢትዮጵያ ንግድ ባንክ',
    nameEn: 'Commercial Bank of Ethiopia',
    tagAm: 'CBE ብር / ሞባይል',
    tagEn: 'CBE Birr / Mobile',
    logo: '/assets/banks/cbe.png',
    accountNumber: '1000 1234 5678 9',
    shortCode: '1000123456789',
    accountName: 'የኰኵሐ ሃይማኖት ሰንበት ት/ቤት',
    brandColor: '#7a1b38',
    accentBg: 'hover:border-amber-500/60 dark:hover:border-amber-500/80',
  },
  {
    id: 'boa',
    nameAm: 'አቢሲኒያ ባንክ',
    nameEn: 'Bank of Abyssinia',
    tagAm: 'አቢሲኒያ ሞባይል ባንኪንግ',
    tagEn: 'BoA Mobile Banking',
    logo: '/assets/banks/boa.png',
    accountNumber: '8765 4321 0987',
    shortCode: '876543210987',
    accountName: 'የኰኵሐ ሃይማኖት ሰንበት ት/ቤት',
    brandColor: '#D97706',
    accentBg: 'hover:border-amber-500/60 dark:hover:border-amber-500/80',
  },
];

const PRESET_AMOUNTS = [20, 50, 100, 200, 500, 1000];

// ─── Component ─────────────────────────────────────────────────────────────────

export const WalletDepositPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme } = useThemeStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBankId, setSelectedBankId] = useState<BankId>('telebirr');
  const [amount, setAmount] = useState<number>(200);
  const [customInput, setCustomInput] = useState<string>('200');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [txReference, setTxReference] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedBank: BankOption = BANKS.find((b) => b.id === selectedBankId) ?? BANKS[0]!;

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    } else {
      navigate(ROUTES.WALLET.ROOT);
    }
  };

  const handleBankSelect = (bankId: BankId) => {
    setSelectedBankId(bankId);
    setStep(2);
  };

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomInput(val.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setCustomInput(raw);
    const parsed = parseInt(raw, 10);
    setAmount(Number.isNaN(parsed) ? 0 : parsed);
  };

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(selectedBank.shortCode);
      setCopied(true);
      toast.success(
        language === 'am'
          ? 'የሂሳብ ቁጥሩ ተቀድቷል!'
          : 'Account number copied to clipboard!'
      );
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  const handlePasteReference = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setTxReference(clipText.trim());
        toast.info(language === 'am' ? 'ማጣቀሻው ተለጥፏል' : 'Reference pasted');
      }
    } catch {
      // permission error
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDeposit = () => {
    if (amount <= 0) {
      toast.error(language === 'am' ? 'እባክዎ ትክክለኛ መጠን ያስገቡ' : 'Please enter a valid amount');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1000);
  };

  const t = {
    pageTitle: language === 'am' ? 'ገንዘብ አስገባ' : 'Deposit Funds',
    step1Title: language === 'am' ? 'የክፍያ ባንክ ይምረጡ' : 'Select Bank / Wallet',
    step2Title: language === 'am' ? 'የተቀማጭ መጠን ይምረጡ' : 'Select Amount',
    step3Title: language === 'am' ? 'ክፍያውን ያረጋግጡ' : 'Confirm & Verify',
    changeBank: language === 'am' ? 'ቀይር' : 'Change',
    currency: language === 'am' ? 'ብር' : 'ETB',
    enterAmount: language === 'am' ? 'የገንዘብ መጠን' : 'Amount',
    customAmountPlaceholder: language === 'am' ? 'ሌላ መጠን ጻፍ...' : 'Enter custom amount...',
    continue: language === 'am' ? 'ቀጣይ' : 'Continue',
    transferTo: language === 'am' ? 'ገንዘቡን ወደዚህ ሂሳብ ያስተላልፉ' : 'Transfer to this Account',
    accountHolder: language === 'am' ? 'የሂሳብ ባለቤት' : 'Account Name',
    accountNumber: language === 'am' ? 'የሂሳብ ቁጥር' : 'Account Number',
    copy: language === 'am' ? 'ቅዳ' : 'Copy',
    copied: language === 'am' ? 'ተቀድቷል' : 'Copied',
    expectedAmount: language === 'am' ? 'የሚተላለፍ መጠን' : 'Expected Amount',
    uploadReceipt: language === 'am' ? 'የክፍያ ደረሰኝ ስክሪንሾት ይጫኑ' : 'Upload Payment Receipt',
    uploadReceiptHint: language === 'am' ? 'ምስል ለመምረጥ ይጫኑ (PNG/JPG)' : 'Tap to upload screenshot (PNG/JPG)',
    receiptUploaded: language === 'am' ? 'ደረሰኝ ተመርጧል' : 'Receipt uploaded',
    removeReceipt: language === 'am' ? 'አስወግድ' : 'Remove',
    txRefLabel: language === 'am' ? 'የማስተላለፊያ ማጣቀሻ ቁጥር (TX ID)' : 'Transaction Reference / Code',
    txRefPlaceholder: language === 'am' ? 'ምሳሌ፡ 894109403' : 'e.g. 894109403',
    paste: language === 'am' ? 'ለጥፍ' : 'Paste',
    submit: language === 'am' ? 'ተቀማጭ አረጋግጥ' : 'Confirm Deposit',
    submitting: language === 'am' ? 'በማረጋገጥ ላይ...' : 'Submitting...',
    successTitle: language === 'am' ? 'ተቀማጭዎ በተሳካ ሁኔታ ተልኳል!' : 'Deposit Submitted Successfully!',
    successDesc: language === 'am'
      ? 'ክፍያዎ በአስተዳዳሪው ተረጋግጦ በጥቂት ደቂቃዎች ውስጥ ወደ ቦርሳዎ ቀሪ ሒሳብ ይጨመራል።'
      : 'Your transfer is being verified and will be credited to your balance shortly.',
    statusPending: language === 'am' ? 'በማረጋገጥ ላይ' : 'Under Verification',
    backToWallet: language === 'am' ? 'ወደ ቦርሳ ተመለስ' : 'Back to Wallet',
  };

  return (
    <div className="w-full min-h-screen bg-bg-primary text-text-primary flex flex-col">

      {/* ── Sticky Top Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-4 py-2.5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <BackButton onBack={handleBack} />
            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold text-text-primary leading-tight">
                {t.pageTitle}
              </span>
              <span className="text-[11px] font-semibold text-text-muted">
                {step === 1 && `1/3 · ${t.step1Title}`}
                {step === 2 && `2/3 · ${t.step2Title}`}
                {step === 3 && `3/3 · ${t.step3Title}`}
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

      {/* ── Step Progress Indicator ───────────────────────────────────── */}
      <div className="w-full max-w-lg mx-auto px-4 pt-3.5 pb-1">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-all duration-300',
                s === step
                  ? 'bg-[#5c0b1c] dark:bg-[#9e1c31]'
                  : s < step
                    ? 'bg-emerald-500'
                    : 'bg-bg-secondary border border-border-subtle'
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Main Step Container ───────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-3 flex flex-col">

        {/* ════════════════════════════════════════════════════════════════
            STEP 1: Select Bank (2-Column Big Buttons with Real Logos)
           ════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between animate-fade-in">
            <div className="flex flex-col gap-3.5">
              <div className="pt-1">
                <h1 className="text-[19px] font-extrabold text-text-primary leading-tight tracking-tight">
                  {t.step1Title}
                </h1>
                <p className="text-[12px] text-text-muted mt-0.5">
                  {language === 'am'
                    ? 'ተቀማጭ ለማድረግ የሚጠቀሙበትን ባንክ ወይም የክፍያ መንገድ ይጫኑ'
                    : 'Choose your preferred payment provider to proceed'}
                </p>
              </div>

              {/* 2-Column Grid of Big Buttons (No bulky wrapping container) */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                {/* Telebirr Big Button */}
                <button
                  type="button"
                  onClick={() => handleBankSelect('telebirr')}
                  className={cn(
                    'group flex flex-col items-center justify-center p-4 rounded-3xl',
                    'bg-bg-card border-2 border-border-subtle',
                    'hover:border-[#0172bb] hover:shadow-lg active:scale-95 transition-all duration-200',
                    'h-[148px] relative overflow-hidden text-center cursor-pointer',
                    selectedBankId === 'telebirr' && 'ring-2 ring-[#0172bb]/40 border-[#0172bb]'
                  )}
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-2 p-1 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 transition-transform group-hover:scale-105">
                    <img
                      src="/assets/banks/telebirr.png"
                      alt="Telebirr"
                      className="w-full h-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <span className="text-[14px] font-extrabold text-text-primary leading-tight">
                    {language === 'am' ? 'ቴሌብር' : 'Telebirr'}
                  </span>
                  <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                    {language === 'am' ? 'ፈጣን ክፍያ' : 'Instant Pay'}
                  </span>
                </button>

                {/* CBE Big Button */}
                <button
                  type="button"
                  onClick={() => handleBankSelect('cbe')}
                  className={cn(
                    'group flex flex-col items-center justify-center p-4 rounded-3xl',
                    'bg-bg-card border-2 border-border-subtle',
                    'hover:border-amber-500 hover:shadow-lg active:scale-95 transition-all duration-200',
                    'h-[148px] relative overflow-hidden text-center cursor-pointer',
                    selectedBankId === 'cbe' && 'ring-2 ring-amber-500/40 border-amber-500'
                  )}
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-2 p-1 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 transition-transform group-hover:scale-105">
                    <img
                      src="/assets/banks/cbe.png"
                      alt="Commercial Bank of Ethiopia"
                      className="w-full h-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <span className="text-[14px] font-extrabold text-text-primary leading-tight">
                    {language === 'am' ? 'ንግድ ባንክ' : 'CBE'}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                    {language === 'am' ? 'CBE ብር / ሂሳብ' : 'CBE Birr'}
                  </span>
                </button>

                {/* Bank of Abyssinia Big Button (Spans 2 columns for prominent logo display) */}
                <button
                  type="button"
                  onClick={() => handleBankSelect('boa')}
                  className={cn(
                    'col-span-2 group flex items-center justify-between px-5 py-4 rounded-3xl',
                    'bg-bg-card border-2 border-border-subtle',
                    'hover:border-amber-500 hover:shadow-lg active:scale-[0.98] transition-all duration-200',
                    'h-[96px] cursor-pointer',
                    selectedBankId === 'boa' && 'ring-2 ring-amber-500/40 border-amber-500'
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="h-14 w-32 flex items-center justify-center p-1.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 transition-transform group-hover:scale-105 shrink-0">
                      <img
                        src="/assets/banks/boa.png"
                        alt="Bank of Abyssinia"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[14px] font-extrabold text-text-primary leading-tight">
                        {language === 'am' ? 'አቢሲኒያ ባንክ' : 'Bank of Abyssinia'}
                      </span>
                      <span className="text-[11px] font-medium text-text-muted mt-0.5">
                        {language === 'am' ? 'ሞባይል ባንኪንግ / ሒሳብ' : 'BoA Mobile / Account'}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted group-hover:text-text-primary shrink-0">
                    <Icon name="ChevronRight" size={18} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 2: Enter Amount (Quick preset chips + Custom Input)
           ════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between gap-5 animate-fade-in">
            <div className="flex flex-col gap-4">
              {/* Selected Bank Banner */}
              <div className="flex items-center justify-between p-2.5 px-3.5 rounded-2xl bg-bg-card border border-border-subtle shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-bg-secondary flex items-center justify-center p-1 border border-border-subtle shrink-0">
                    <img
                      src={selectedBank.logo}
                      alt={selectedBank.nameEn}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-extrabold text-text-primary leading-none">
                      {language === 'am' ? selectedBank.nameAm : selectedBank.nameEn}
                    </span>
                    <span className="text-[10px] text-text-muted mt-0.5">
                      {language === 'am' ? selectedBank.tagAm : selectedBank.tagEn}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-2.5 py-1 rounded-full bg-bg-secondary hover:bg-bg-card text-brand-600 dark:text-brand-400 text-[11px] font-bold border border-border-subtle active:scale-95 transition-all"
                >
                  {t.changeBank}
                </button>
              </div>

              {/* Large Amount Display */}
              <div className="flex flex-col items-center justify-center py-5 px-4 bg-bg-card rounded-3xl border border-border-subtle shadow-card">
                <span className="text-[11.5px] font-semibold text-text-muted mb-1">
                  {t.step2Title}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[38px] font-black tracking-tight text-text-primary tabular-nums leading-none">
                    {amount.toLocaleString()}
                  </span>
                  <span className="text-[16px] font-extrabold text-[#B2782A]">
                    {t.currency}
                  </span>
                </div>
              </div>

              {/* Preset Clickable Number Chips */}
              <div className="flex flex-col gap-2">
                <span className="text-[11.5px] font-bold text-text-secondary px-1">
                  {language === 'am' ? 'ፈጣን መጠኖች' : 'Quick Presets'}
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRESET_AMOUNTS.map((val) => {
                    const isSelected = amount === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handlePresetSelect(val)}
                        className={cn(
                          'h-12 rounded-2xl text-[14px] font-extrabold transition-all duration-150 flex items-center justify-center gap-1 active:scale-95 shadow-sm',
                          isSelected
                            ? 'bg-[#5c0b1c] text-white shadow-md shadow-[#5c0b1c]/20'
                            : 'bg-bg-card border border-border-subtle text-text-primary hover:border-brand-500/50'
                        )}
                      >
                        <span>{val}</span>
                        <span className="text-[11px] font-semibold opacity-80">{t.currency}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Input Field */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-[11.5px] font-bold text-text-secondary px-1">
                  {t.customAmountPlaceholder}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customInput}
                    onChange={handleCustomInputChange}
                    placeholder="0"
                    className="w-full h-12 px-4 pr-14 rounded-2xl bg-bg-card border border-border-subtle focus:border-brand-500 focus:outline-none text-[16px] font-extrabold text-text-primary tabular-nums"
                  />
                  <span className="absolute right-4 text-[13px] font-bold text-[#B2782A] pointer-events-none">
                    {t.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="button"
              disabled={amount <= 0}
              onClick={() => setStep(3)}
              className={cn(
                'h-12 w-full rounded-2xl font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]',
                amount > 0
                  ? 'bg-[#5c0b1c] hover:bg-[#7a2330] text-white shadow-[#5c0b1c]/25 cursor-pointer'
                  : 'bg-bg-secondary text-text-muted border border-border-subtle cursor-not-allowed opacity-60'
              )}
            >
              <span>{t.continue}</span>
              <Icon name="ArrowRight" size={17} />
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 3: Transfer & Verification
           ════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between gap-5 animate-fade-in pb-4">
            <div className="flex flex-col gap-3.5">

              {/* Bank Account Details Card */}
              <div className="bg-bg-card rounded-3xl p-4 border border-border-subtle shadow-card flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-bg-secondary flex items-center justify-center p-1 border border-border-subtle shrink-0">
                      <img
                        src={selectedBank.logo}
                        alt={selectedBank.nameEn}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-extrabold text-text-primary leading-tight">
                        {language === 'am' ? selectedBank.nameAm : selectedBank.nameEn}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {t.transferTo}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-text-muted font-medium block">
                      {t.expectedAmount}
                    </span>
                    <span className="text-[15px] font-black text-[#5c0b1c] dark:text-rose-400">
                      {amount.toLocaleString()} {t.currency}
                    </span>
                  </div>
                </div>

                {/* Account Details & Copy Action */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11.5px]">
                    <span className="text-text-muted font-medium">{t.accountHolder}</span>
                    <span className="text-text-primary font-bold">{selectedBank.accountName}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-bg-secondary border border-border-subtle">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
                        {t.accountNumber}
                      </span>
                      <span className="text-[15px] font-mono font-extrabold text-text-primary tracking-wide">
                        {selectedBank.accountNumber}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className={cn(
                        'px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-bold active:scale-95 transition-all shrink-0',
                        copied
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-500/40'
                          : 'bg-bg-primary text-text-primary border-border-subtle hover:border-brand-500'
                      )}
                    >
                      {copied ? (
                        <>
                          <Icon name="Check" size={13} className="text-emerald-600" />
                          <span>{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Icon name="Copy" size={13} />
                          <span>{t.copy}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Receipt Section */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-text-secondary px-1">
                  {t.uploadReceipt}
                </span>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {receiptImage ? (
                  <div className="relative rounded-2xl border border-border-subtle bg-bg-card p-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg-secondary border border-border-subtle shrink-0">
                        <img
                          src={receiptImage}
                          alt="Receipt Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-text-primary">
                          {t.receiptUploaded}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ Image Ready
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReceiptImage(null)}
                      className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/40"
                    >
                      {t.removeReceipt}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 rounded-2xl border-2 border-dashed border-border-strong/40 bg-bg-card hover:bg-bg-secondary hover:border-brand-500/60 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Icon name="UploadCloud" size={24} className="text-brand-500" />
                    <span className="text-[11.5px] font-bold text-text-secondary">
                      {t.uploadReceiptHint}
                    </span>
                  </button>
                )}
              </div>

              {/* Transaction Reference Number Input */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-text-secondary px-1">
                  {t.txRefLabel}
                </span>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={txReference}
                    onChange={(e) => setTxReference(e.target.value)}
                    placeholder={t.txRefPlaceholder}
                    className="w-full h-12 px-3.5 pr-16 rounded-2xl bg-bg-card border border-border-subtle focus:border-brand-500 focus:outline-none text-[13px] font-medium text-text-primary"
                  />
                  <button
                    type="button"
                    onClick={handlePasteReference}
                    className="absolute right-2 px-2.5 py-1 rounded-xl bg-bg-secondary hover:bg-bg-primary text-text-primary border border-border-subtle text-[11px] font-bold transition-all active:scale-95"
                  >
                    {t.paste}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm & Submit Deposit Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitDeposit}
              className={cn(
                'h-12 w-full rounded-2xl font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]',
                'bg-[#5c0b1c] hover:bg-[#7a2330] text-white shadow-[#5c0b1c]/25 cursor-pointer',
                isSubmitting && 'opacity-75 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  <span>{t.submitting}</span>
                </>
              ) : (
                <>
                  <Icon name="CheckCircle" size={18} />
                  <span>{t.submit}</span>
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════════════════════════════
          Success Modal (Award-winning animated verification dialog)
         ════════════════════════════════════════════════════════════════ */}
      {showSuccessModal && (
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
                {t.successDesc}
              </p>
            </div>

            {/* Summary details */}
            <div className="w-full bg-bg-secondary rounded-2xl p-3 border border-border-subtle flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-text-muted">{language === 'am' ? 'ባንክ' : 'Bank'}</span>
                <span className="text-text-primary font-bold">
                  {language === 'am' ? selectedBank.nameAm : selectedBank.nameEn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{language === 'am' ? 'መጠን' : 'Amount'}</span>
                <span className="text-[#5c0b1c] dark:text-rose-400 font-extrabold">
                  {amount.toLocaleString()} {t.currency}
                </span>
              </div>
              {txReference && (
                <div className="flex justify-between">
                  <span className="text-text-muted">{language === 'am' ? 'ማጣቀሻ' : 'Reference'}</span>
                  <span className="text-text-primary font-mono font-medium">{txReference}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">{language === 'am' ? 'ሁኔታ' : 'Status'}</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {t.statusPending}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTES.WALLET.ROOT)}
              className="h-11 w-full bg-[#5c0b1c] hover:bg-[#7a2330] text-white rounded-2xl text-[13px] font-extrabold shadow-md active:scale-[0.98] transition-all"
            >
              {t.backToWallet}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up { animation: scale-up 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default WalletDepositPage;
