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
            DEFAULT: '#ECEE8F',
            dark: '#CCCE7D',
          },
          button: {
            DEFAULT: '#A0DDCC',
            hover: '#5EC1AD',
          },
          input: {
            bkg: '#F2F2F2',
            border: 'hsl(0, 0%, 33%)',
            borderDark: 'hsl(0, 0%, 23%)',
          },
          link: { DEFAULT: 'hsl(33, 100%, 57%)', hover: 'hsl(33, 100%, 52%)' },
          error: '#E29997',
          success: '#7EDA92',
          warning: '#EAD59E',
          'bkg-1': 'hsl(0, 0%, 100%)',
          'bkg-2': 'hsl(0, 0%, 93%)',
          'bkg-3': 'hsl(0, 0%, 86%)',
          'bkg-4': 'hsl(0, 0%, 65%)',
          'fgd-1': 'hsl(0, 0%, 5%)',
          'fgd-2': 'hsl(0, 0%, 15%)',
          'fgd-3': 'hsl(0, 0%, 30%)',
          'fgd-4': 'hsl(0, 0%, 40%)',
          'primary-1': '#99ADD9',
          'primary-2': '#889FD3',
          'primary-3': '#728DC8',
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
          'primary-1': '#99ADD9',
          'primary-2': '#889FD3',
          'primary-3': '#728DC8',
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
        'th-link': 'var(--link)',
        'th-link-hover': 'var(--link-hover)',
        'th-button': 'var(--button)',
        'th-button-hover': 'var(--button-hover)',
        'th-input-bkg': 'var(--input-bkg)',
        'th-input-border': 'var(--input-border)',
        'th-input-border-hover': 'var(--input-border-hover)',
        'th-primary-1': 'var(--primary-1)',
        'th-primary-2': 'var(--primary-2)',
        'th-primary-3': 'var(--primary-3)',
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
