import { EqubService, MyEqubCycle, OpenEqubGroup } from '@/features/equb/types';
import { delay } from '../utils';

const MOCK_MY_EQUB: MyEqubCycle = {
  id: 'equb-st-george',
  name: {
    am: 'የቅዱስ ጊዮርጊስ የመጽሐፍ እቁብ',
    en: "St. George's Book Equb",
  },
  groupLabel: {
    am: "ቡድን 'ሀ' (Group A)",
    en: "Group 'A'",
  },
  memberCount: 12,
  totalMembers: 12,
  currentRound: 5,
  totalRounds: 12,
  progressPercent: 41.6,
  startDate: {
    am: 'ጥቅምት 2017',
    en: 'Oct 2024',
  },
  endDate: {
    am: 'ሚያዝያ 2017',
    en: 'Apr 2025',
  },
  userTurnRound: 7,
  userTurnMonth: {
    am: 'ኅዳር 2017 ዓ.ም.',
    en: 'Nov 2024',
  },
  creditVoucherAmount: 6000,
  nextContributionAmount: 500,
  nextDueDate: {
    am: 'ጥቅምት 30',
    en: 'Nov 9',
  },
  dueDaysLeft: 4,
  hasOutstanding: true,
  outstandingRound: 4,
  outstandingAmount: 500,
};

const MOCK_OPEN_EQUBS: OpenEqubGroup[] = [
  {
    id: 'open-1',
    title: {
      am: 'የሰንበት ትምህርት ቤት መጻሕፍት እቁብ',
      en: 'Sunday School Book Equb',
    },
    subtitle: {
      am: 'በየሁለት ሳምንቱ የሚከፈል · ለተተኪ ወጣቶች',
      en: 'Bi-weekly · For Youth & Scholars',
    },
    closesInDays: 2,
    contributionAmount: 300,
    frequency: {
      am: 'በየሁለት ሳምንቱ',
      en: 'Bi-weekly',
    },
    currentMembers: 18,
    maxMembers: 20,
    creditVoucherAmount: 6000,
    iconType: 'auto_stories',
  },
  {
    id: 'open-2',
    title: {
      am: 'የታላላቅ የትርጓሜ መጻሕፍት እቁብ',
      en: 'Major Commentaries Book Equb',
    },
    subtitle: {
      am: 'በወር አንድ ጊዜ · ጥልቅ ጥናት',
      en: 'Monthly · In-depth Scriptural Study',
    },
    closesInDays: 6,
    contributionAmount: 1000,
    frequency: {
      am: 'በወር አንድ ጊዜ',
      en: 'Monthly',
    },
    currentMembers: 8,
    maxMembers: 12,
    creditVoucherAmount: 12000,
    iconType: 'menu_book',
  },
  {
    id: 'open-3',
    title: {
      am: 'የግዕዝ እና የዜማ መጻሕፍት እቁብ',
      en: "Ge'ez & Zema Hymnal Book Equb",
    },
    subtitle: {
      am: 'በወር አንድ ጊዜ · ለካህናትና ለዲያቆናት',
      en: 'Monthly · For Clergy & Deacons',
    },
    closesInDays: 10,
    contributionAmount: 600,
    frequency: {
      am: 'በወር አንድ ጊዜ',
      en: 'Monthly',
    },
    currentMembers: 11,
    maxMembers: 15,
    creditVoucherAmount: 9000,
    iconType: 'history_edu',
  },
];

export const mockEqubService: EqubService = {
  getMyEqub: async () => {
    await delay(180);
    return { ...MOCK_MY_EQUB };
  },
  getOpenEqubs: async () => {
    await delay(200);
    return [...MOCK_OPEN_EQUBS];
  },
  payContribution: async (_equbId, _round, _amount) => {
    await delay(350);
    return {
      success: true,
      txId: `tx-eqb-${Date.now()}`,
    };
  },
  joinEqub: async (_equbId) => {
    await delay(300);
    return {
      success: true,
      message: 'Successfully requested to join Equb',
    };
  },
};
