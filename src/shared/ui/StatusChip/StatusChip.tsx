import React from 'react';
import { cn } from '@/shared/lib';
import { Icon, IconName } from '@/shared/ui/Icon';
import { useLanguage } from '@/shared/i18n';
import {
  PaymentVerificationStatus,
  OrderStatus,
  ContributionStatus,
  BookAvailability,
  EqubGroupStatus,
} from '@/shared/types';

export type AnyDomainStatus =
  | PaymentVerificationStatus
  | OrderStatus
  | ContributionStatus
  | BookAvailability
  | EqubGroupStatus;

interface StatusConfig {
  icon: IconName;
  colorClass: string;
  labelEn: string;
  labelAm: string;
}

const STATUS_CONFIG_MAP: Record<string, StatusConfig> = {
  // Payments / Verification
  started: { icon: 'Clock', colorClass: 'bg-status-info-bg text-status-info-text border-status-info-border', labelEn: 'Started', labelAm: 'የተጀመረ' },
  submitted: { icon: 'Clock', colorClass: 'bg-status-warning-bg text-status-warning-text border-status-warning-border', labelEn: 'Awaiting Verification', labelAm: 'ማረጋገጫ በመጠበቅ ላይ' },
  awaiting_verification: { icon: 'Clock', colorClass: 'bg-status-warning-bg text-status-warning-text border-status-warning-border', labelEn: 'Awaiting Verification', labelAm: 'ማረጋገጫ በመጠበቅ ላይ' },
  further_review: { icon: 'AlertCircle', colorClass: 'bg-status-warning-bg text-status-warning-text border-status-warning-border', labelEn: 'In Review', labelAm: 'ግምገማ ላይ' },
  confirmed: { icon: 'CheckCircle2', colorClass: 'bg-status-success-bg text-status-success-text border-status-success-border', labelEn: 'Confirmed', labelAm: 'የተረጋገጠ' },
  rejected: { icon: 'XCircle', colorClass: 'bg-status-danger-bg text-status-danger-text border-status-danger-border', labelEn: 'Rejected', labelAm: 'ውድቅ የተደረገ' },
  expired: { icon: 'AlertTriangle', colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border', labelEn: 'Expired', labelAm: 'ጊዜው ያለፈበት' },
  cancelled: { icon: 'Ban', colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border', labelEn: 'Cancelled', labelAm: 'የተሰረዘ' },

  // Orders
  pending_payment: { icon: 'CreditCard', colorClass: 'bg-status-warning-bg text-status-warning-text border-status-warning-border', labelEn: 'Pending Payment', labelAm: 'ክፍያ በመጠበቅ ላይ' },
  preparing: { icon: 'Package', colorClass: 'bg-status-info-bg text-status-info-text border-status-info-border', labelEn: 'Preparing', labelAm: 'በመዘጋጀት ላይ' },
  ready_for_pickup: { icon: 'Store', colorClass: 'bg-status-success-bg text-status-success-text border-status-success-border', labelEn: 'Ready for Pickup', labelAm: 'ለመውሰድ ዝግጁ' },
  collected: { icon: 'CheckCheck', colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border', labelEn: 'Collected', labelAm: 'ተወስዷል' },
  refunded: { icon: 'RotateCcw', colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border', labelEn: 'Refunded', labelAm: 'የተመለሰ' },

  // Contributions
  upcoming: { icon: 'Calendar', colorClass: 'bg-status-info-bg text-status-info-text border-status-info-border', labelEn: 'Upcoming', labelAm: 'የሚመጣ' },
  due: { icon: 'AlertCircle', colorClass: 'bg-status-warning-bg text-status-warning-text border-status-warning-border', labelEn: 'Due Today', labelAm: 'ዛሬ የሚከፈል' },
  overdue: { icon: 'AlertOctagon', colorClass: 'bg-status-danger-bg text-status-danger-text border-status-danger-border', labelEn: 'Overdue', labelAm: 'ያለፈበት' },
  prepaid: { icon: 'CheckCircle2', colorClass: 'bg-status-success-bg text-status-success-text border-status-success-border', labelEn: 'Prepaid', labelAm: 'በቅድሚያ የተከፈለ' },
  covered_by_plan: { icon: 'ShieldCheck', colorClass: 'bg-status-success-bg text-status-success-text border-status-success-border', labelEn: 'Covered by Plan', labelAm: 'በእቅድ የተሸፈነ' },
  adjusted: { icon: 'Sliders', colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border', labelEn: 'Adjusted', labelAm: 'የተስተካከለ' },

  // Book Availability
  in_stock: { icon: 'CheckCircle2', colorClass: 'bg-status-success-bg text-status-success-text border-status-success-border', labelEn: 'In Stock', labelAm: 'በክምችት ላይ ያለ' },
  few_left: { icon: 'AlertTriangle', colorClass: 'bg-status-warning-bg text-status-warning-text border-status-warning-border', labelEn: 'Few Left', labelAm: 'ጥቂት የቀሩ' },
  out_of_stock: { icon: 'XCircle', colorClass: 'bg-status-danger-bg text-status-danger-text border-status-danger-border', labelEn: 'Out of Stock', labelAm: 'ያለቀ' },
  unavailable: { icon: 'MinusCircle', colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border', labelEn: 'Unavailable', labelAm: 'የማይገኝ' },

  // Equb Group Statuses
  enrollment_open: { icon: 'Users', colorClass: 'bg-status-success-bg text-status-success-text border-status-success-border', labelEn: 'Enrollment Open', labelAm: 'ክፍት እቁብ' },
  enrollment_closed: { icon: 'Lock', colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border', labelEn: 'Closed', labelAm: 'የተዘጋ' },
  active: { icon: 'PlayCircle', colorClass: 'bg-status-info-bg text-status-info-text border-status-info-border', labelEn: 'Active', labelAm: 'በሂደት ላይ' },
  paused: { icon: 'PauseCircle', colorClass: 'bg-status-warning-bg text-status-warning-text border-status-warning-border', labelEn: 'Paused', labelAm: 'ለጊዜው የቆመ' },
  completed: { icon: 'CheckCircle2', colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border', labelEn: 'Completed', labelAm: 'የተጠናቀቀ' },
  discontinued: { icon: 'XCircle', colorClass: 'bg-status-danger-bg text-status-danger-text border-status-danger-border', labelEn: 'Discontinued', labelAm: 'የተቋረጠ' },
};

export interface StatusChipProps {
  status: AnyDomainStatus | string;
  className?: string;
  customLabel?: string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  className,
  customLabel,
  size = 'md',
}) => {
  const { language } = useLanguage();
  const config = STATUS_CONFIG_MAP[status] || {
    icon: 'Info' as IconName,
    colorClass: 'bg-status-neutral-bg text-status-neutral-text border-status-neutral-border',
    labelEn: status,
    labelAm: status,
  };

  const label = customLabel || (language === 'am' ? config.labelAm : config.labelEn);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium select-none',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        config.colorClass,
        className,
      )}
    >
      <Icon name={config.icon} size={size === 'sm' ? 12 : 14} />
      <span>{label}</span>
    </span>
  );
};
