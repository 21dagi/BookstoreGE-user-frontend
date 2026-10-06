import { WalletService } from '@/features/wallet/types';
import { delay } from '../utils';

const MOCK_BALANCE = { totalBalance: 2250, currency: 'ETB' as const };

const MOCK_ACCOUNTS = [
  {
    id: 'telebirr' as const,
    labelAm: 'ቴሌብር (Telebirr)',
    labelEn: 'Telebirr',
    accountNumber: '0911 23 45 67',
    shortCode: '0911234567',
  },
  {
    id: 'cbe' as const,
    labelAm: 'ንግድ ባንክ (CBE)',
    labelEn: 'Commercial Bank (CBE)',
    accountNumber: '1000 1234 5678 9',
    shortCode: '1000123456789',
  },
  {
    id: 'boa' as const,
    labelAm: 'አቢሲኒያ ባንክ (BoA)',
    labelEn: 'Bank of Abyssinia (BoA)',
    accountNumber: '8765 4321 0987',
    shortCode: '876543210987',
  },
];

const MOCK_PENDING_DEPOSITS = [
  {
    id: 'dep-1',
    amount: 1000,
    paymentMethod: 'telebirr' as const,
    reference: '#TX-984210',
    submittedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    status: 'awaiting_verification' as const,
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: { am: 'የመጽሐፍ ግዢ · መዝሙረ ዳዊት', en: 'Book Purchase · Psalms of David' },
    subtitle: { am: 'ጥቅምት 18 • ተጠናቋል (በቦታው ተወስዷል)', en: 'Oct 18 • Completed (In-Store Pickup)' },
    amount: 650,
    sign: 'debit' as const,
    category: 'purchase' as const,
    date: { am: 'ጥቅምት 18 ቀን 2016', en: 'October 18, 2016' },
    status: { am: 'ተጠናቋል (በቦታው ተወስዷል)', en: 'Completed (In-Store Pickup)' },
    description: { am: 'መዝሙረ ዳዊት በግዕዝና በአማርኛ የቆዳ ሽፋን ያለው ቅጂ።', en: 'Psalms of David in Geez and Amharic with leather cover.' },
    reference: '#ORD-88219',
  },
  {
    id: 'tx-2',
    title: { am: 'የእቁብ መዋጮ · ዙር 4', en: 'Equb Contribution · Round 4' },
    subtitle: { am: 'ጥቅምት 15 • የማኅበር ዙር 4', en: 'Oct 15 • Group Round 4' },
    amount: 500,
    sign: 'debit' as const,
    category: 'equb' as const,
    date: { am: 'ጥቅምት 15 ቀን 2016', en: 'October 15, 2016' },
    status: { am: 'ተጠናቋል', en: 'Completed' },
    description: { am: 'የጥቅምት ወር መደበኛ የመጽሐፍ እቁብ መዋጮ ክፍያ።', en: 'Regular October book equb contribution payment.' },
    reference: '#EQB-40192',
  },
  {
    id: 'tx-3',
    title: { am: 'የቴሌብር ተቀማጭ', en: 'Telebirr Deposit' },
    subtitle: { am: 'ጥቅምት 12 • ቴሌብር', en: 'Oct 12 • Telebirr' },
    amount: 1500,
    sign: 'credit' as const,
    category: 'deposit' as const,
    date: { am: 'ጥቅምት 12 ቀን 2016', en: 'October 12, 2016' },
    status: { am: 'የተረጋገጠ', en: 'Confirmed' },
    description: { am: 'የቴሌብር ማስተላለፊያ ደረሰኝ በአስተዳዳሪው ጸድቆ ወደ ቦርሳ የተጨመረ።', en: 'Telebirr receipt confirmed by admin and added to wallet.' },
    reference: '#DEP-91044',
    paymentMethod: 'telebirr' as const,
  },
  {
    id: 'tx-4',
    title: { am: 'የእቁብ ድርሻ ተቀበሉ', en: 'Equb Credit Received' },
    subtitle: { am: 'መስከረም 28 • የእቁብ እጣ ደረሰ', en: 'Sep 28 • Equb turn reached' },
    amount: 1200,
    sign: 'credit' as const,
    category: 'equb' as const,
    date: { am: 'መስከረም 28 ቀን 2016', en: 'September 28, 2016' },
    status: { am: 'የደረሰ እጣ', en: 'Turn Received' },
    description: { am: 'የእቁብ ዙር ደርሶዎት ለመጽሐፍት መግዣ የሚውል 1,200 ብር የክሬዲት ኩፖን ተሰጥቷል።', en: 'Your equb turn arrived — 1,200 ETB book credit issued.' },
    reference: '#EQB-TRN-03',
  },
];

export const mockWalletService: WalletService = {
  getBalance: async () => { await delay(400); return MOCK_BALANCE; },
  getTransactions: async (category) => {
    await delay(500);
    if (!category) return MOCK_TRANSACTIONS;
    return MOCK_TRANSACTIONS.filter((tx) => tx.category === category);
  },
  getPendingDeposits: async () => { await delay(300); return MOCK_PENDING_DEPOSITS; },
  getPaymentAccounts: async () => { await delay(200); return MOCK_ACCOUNTS; },
};
