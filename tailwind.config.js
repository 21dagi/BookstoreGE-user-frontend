/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          DEFAULT: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          DEFAULT: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
        },
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          card: 'var(--color-bg-card)',
          elevated: 'var(--color-bg-elevated)',
          overlay: 'var(--color-bg-overlay)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
          brand: 'var(--color-text-brand)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border-primary)',
          primary: 'var(--color-border-primary)',
          strong: 'var(--color-border-strong)',
        },
        status: {
          success: {
            bg: 'var(--color-status-success-bg)',
            text: 'var(--color-status-success-text)',
            border: 'var(--color-status-success-border)',
          },
          warning: {
            bg: 'var(--color-status-warning-bg)',
            text: 'var(--color-status-warning-text)',
            border: 'var(--color-status-warning-border)',
          },
          danger: {
            bg: 'var(--color-status-danger-bg)',
            text: 'var(--color-status-danger-text)',
            border: 'var(--color-status-danger-border)',
          },
          info: {
            bg: 'var(--color-status-info-bg)',
            text: 'var(--color-status-info-text)',
            border: 'var(--color-status-info-border)',
          },
          neutral: {
            bg: 'var(--color-status-neutral-bg)',
            text: 'var(--color-status-neutral-text)',
            border: 'var(--color-status-neutral-border)',
          },
        },
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        card: 'var(--shadow-card)',
        bottom: 'var(--shadow-bottom-nav)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        ethiopic: ['var(--font-ethiopic)', 'var(--font-sans)', 'sans-serif'],
        heading: ['var(--font-heading)', 'var(--font-sans)', 'serif'],
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom, 0px)',
        'safe-top': 'env(safe-area-inset-top, 0px)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};
