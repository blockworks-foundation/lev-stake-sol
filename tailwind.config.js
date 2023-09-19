module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      display: ['var(--font-display)'],
      body: ['var(--font-body)'],
      mono: ['var(--font-mono)'],
    },
    extend: {
      animation: {
        shake: 'shake 0.4s linear 4',
        'spin-fast': 'spin 0.5s linear infinite',
      },
      colors: {
        'light-theme': {
          active: {
            DEFAULT: 'hsl(0, 0%, 8%)',
            dark: 'hsl(33, 100%, 52%)',
          },
          button: {
            DEFAULT: 'hsl(0, 0%, 84%)',
            hover: 'hsl(0, 0%, 74%)',
          },
          input: {
            bkg: 'hsl(0, 0%, 97%)',
            border: 'hsl(0, 0%, 33%)',
            borderDark: 'hsl(0, 0%, 23%)',
          },
          link: { DEFAULT: 'hsl(33, 100%, 57%)', hover: 'hsl(33, 100%, 52%)' },
          down: {
            DEFAULT: 'hsl(0, 39%, 58%)',
            dark: 'hsl(0, 39%, 53%)',
            muted: 'hsl(0, 19%, 53%)',
          },
          up: {
            DEFAULT: 'hsl(111, 47%, 53%)',
            dark: 'hsl(111, 47%, 48%)',
            muted: 'hsl(111, 7%, 48%)',
          },
          error: 'hsl(0, 39%, 58%)',
          success: 'hsl(111, 47%, 53%)',
          warning: 'hsl(33, 100%, 57%)',
          'bkg-1': 'hsl(0, 0%, 99%)',
          'bkg-2': 'hsl(0, 0%, 94%)',
          'bkg-3': 'hsl(0, 0%, 89%)',
          'bkg-4': 'hsl(0, 0%, 84%)',
          'fgd-1': 'hsl(0, 0%, 8%)',
          'fgd-2': 'hsl(0, 0%, 23%)',
          'fgd-3': 'hsl(0, 0%, 38%)',
          'fgd-4': 'hsl(0, 0%, 53%)',
        },
        'dark-theme': {
          active: {
            DEFAULT: 'hsl(45, 86%, 62%)',
            dark: 'hsl(45, 86%, 57%)',
          },
          button: {
            DEFAULT: 'hsl(269, 0%, 38%)',
            hover: 'hsl(269, 0%, 33%)',
          },
          input: {
            bkg: 'hsl(240, 6%, 5%)',
            border: 'hsl(0, 0%, 32%)',
            borderDark: 'hsl(0, 0%, 22%)',
          },
          link: { DEFAULT: 'hsl(45, 86%, 62%)', hover: 'hsl(45, 86%, 57%)' },
          down: {
            DEFAULT: 'hsl(358, 55%, 50%)',
            dark: 'hsl(0, 45%, 26%)',
            muted: 'hsl(0, 45%, 30%)',
          },
          up: {
            DEFAULT: 'hsl(111, 47%, 43%)',
            dark: 'hsl(111, 47%, 38%)',
            muted: 'hsl(130, 34%, 26%)',
          },
          error: 'hsl(0, 59%, 58%)',
          success: 'hsl(111, 47%, 43%)',
          warning: 'hsl(45, 86%, 62%)',
          'bkg-1': 'hsl(240, 6%, 7%)',
          'bkg-2': 'hsl(240, 6%, 12%)',
          'bkg-3': 'hsl(240, 6%, 17%)',
          'bkg-4': 'hsl(240, 6%, 22%)',
          'fgd-1': 'hsl(0, 0%, 82%)',
          'fgd-2': 'hsl(0, 0%, 72%)',
          'fgd-3': 'hsl(0, 0%, 62%)',
          'fgd-4': 'hsl(0, 0%, 52%)',
        },
        'th-bkg-1': 'var(--bkg-1)',
        'th-bkg-2': 'var(--bkg-2)',
        'th-bkg-3': 'var(--bkg-3)',
        'th-bkg-4': 'var(--bkg-4)',
        'th-fgd-1': 'var(--fgd-1)',
        'th-fgd-2': 'var(--fgd-2)',
        'th-fgd-3': 'var(--fgd-3)',
        'th-fgd-4': 'var(--fgd-4)',
        'th-active': 'var(--active)',
        'th-active-dark': 'var(--active-dark)',
        'th-error': 'var(--error)',
        'th-success': 'var(--success)',
        'th-warning': 'var(--warning)',
        'th-down': 'var(--down)',
        'th-down-dark': 'var(--down-dark)',
        'th-down-muted': 'var(--down-muted)',
        'th-up': 'var(--up)',
        'th-up-dark': 'var(--up-dark)',
        'th-up-muted': 'var(--up-muted)',
        'th-link': 'var(--link)',
        'th-link-hover': 'var(--link-hover)',
        'th-button': 'var(--button)',
        'th-button-hover': 'var(--button-hover)',
        'th-input-bkg': 'var(--input-bkg)',
        'th-input-border': 'var(--input-border)',
        'th-input-border-hover': 'var(--input-border-hover)',
      },
      cursor: {
        help: 'help',
      },
      fontSize: {
        xxs: '.65rem',
      },
      keyframes: {
        shake: {
          '0%, 100%': {
            transform: 'rotate(0deg)',
          },
          '20%, 60%': {
            transform: 'rotate(6deg)',
          },
          '40%, 80%': {
            transform: 'rotate(-6deg)',
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [],
}
