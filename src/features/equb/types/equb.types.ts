import { LocalizedString } from '@/shared/types';

export type EqubStatus = 'active' | 'completed' | 'pending';
export type EqubFrequency = 'biweekly' | 'monthly';

export interface MyEqubCycle {
  id: string;
  name: LocalizedString;
  groupLabel: LocalizedString;
  memberCount: number;
  totalMembers: number;
  currentRound: number;
  totalRounds: number;
  progressPercent: number;
  startDate: LocalizedString;
  endDate: LocalizedString;
  userTurnRound: number;
  userTurnMonth: LocalizedString;
  creditVoucherAmount: number;
  nextContributionAmount: number;
  nextDueDate: LocalizedString;
  dueDaysLeft: number;
  hasOutstanding: boolean;
  outstandingRound?: number;
  outstandingAmount?: number;
}

export interface OpenEqubGroup {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  closesInDays: number;
  contributionAmount: number;
  frequency: LocalizedString;
  currentMembers: number;
  maxMembers: number;
  creditVoucherAmount: number;
  iconType: 'auto_stories' | 'menu_book' | 'history_edu' | 'church';
}

export interface EqubService {
  getMyEqub: () => Promise<MyEqubCycle | null>;
  getOpenEqubs: () => Promise<OpenEqubGroup[]>;
  payContribution: (equbId: string, round: number, amount: number) => Promise<{ success: boolean; txId: string }>;
  joinEqub: (equbId: string) => Promise<{ success: boolean; message: string }>;
}
