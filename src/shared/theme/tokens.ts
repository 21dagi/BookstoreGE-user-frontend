/**
 * Core design tokens representation for type safety and JS access
 */

export const THEME_COLORS = {
  brand: {
    primary: 'var(--color-brand-500)',
    hover: 'var(--color-brand-600)',
    active: 'var(--color-brand-700)',
    light: 'var(--color-brand-50)',
    text: 'var(--color-brand-500)',
  },
  accent: {
    primary: 'var(--color-accent-400)',
    hover: 'var(--color-accent-500)',
    light: 'var(--color-accent-50)',
  },
  status: {
    success: 'var(--color-status-success-text)',
    warning: 'var(--color-status-warning-text)',
    danger: 'var(--color-status-danger-text)',
    info: 'var(--color-status-info-text)',
    neutral: 'var(--color-status-neutral-text)',
  },
} as const;
