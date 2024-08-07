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
        shake: 'shake 0.2s linear infinite',
        'spin-fast': 'spin 0.5s linear infinite',
      },
      colors: {
        'light-theme': {
          active: {
            DEFAULT: '#110B11',
            dark: '#000',
          },
          button: {
            DEFAULT: '#47D1FF',
            hover: '#00BBF9',
            text: '#FFFFFF',
          },
          input: {
            bkg: '#F2F2F2',
            border: 'hsl(0, 0%, 33%)',
            borderDark: 'hsl(0, 0%, 23%)',
          },
          link: { DEFAULT: '#9425A7', hover: '#6B1B79' },
          error: '#EA6161',
          success: '#51E44E',
          warning: '#EAB348',
          'bkg-1': 'hsl(0, 0%, 100%)',
          'bkg-2': 'hsl(0, 0%, 93%)',
          'bkg-3': 'hsl(0, 0%, 86%)',
          'bkg-4': 'hsl(0, 0%, 65%)',
          'fgd-1': 'hsl(0, 0%, 5%)',
          'fgd-2': 'hsl(0, 0%, 15%)',
          'fgd-3': 'hsl(0, 0%, 30%)',
          'fgd-4': 'hsl(0, 0%, 40%)',
          'primary-1': '#EBF441',
          'primary-2': '#F1F778',
          'primary-3': '#110B11',
          'primary-4': '#627DB8',
        },
        'dark-theme': {
          active: {
            DEFAULT: '#EBF441',
            dark: '#B57A79',
          },
          button: {
            DEFAULT: '#47D1FF',
            hover: '#00BBF9',
            text: '#110B11',
          },
          input: {
            bkg: '#352130',
            border: 'hsl(0, 0%, 32%)',
            borderDark: 'hsl(0, 0%, 22%)',
          },
          link: { DEFAULT: '#E29997', hover: '#B57A79' },
          error: '#EA6161',
          success: '#51E44E',
          warning: '#EAB348',
          'bkg-1': '#21151E',
          'bkg-2': '#352130',
          'bkg-3': '#482D42',
          'bkg-4': '#5B3953',
          'fgd-1': 'hsl(0, 0%, 100%)',
          'fgd-2': 'hsl(0, 0%, 93%)',
          'fgd-3': 'hsl(0, 0%, 86%)',
          'fgd-4': 'hsl(0, 0%, 65%)',
          'primary-1': '#531D46',
          'primary-2': '#401736',
          'primary-3': '#311229',
          'primary-4': '#260D1F',
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
        'th-button-text': 'var(--button-text)',
        'th-button-hover': 'var(--button-hover)',
        'th-input-bkg': 'var(--input-bkg)',
        'th-input-border': 'var(--input-border)',
        'th-input-border-hover': 'var(--input-border-hover)',
        'th-primary-1': 'var(--primary-1)',
        'th-primary-2': 'var(--primary-2)',
        'th-primary-3': 'var(--primary-3)',
        'th-primary-4': 'var(--primary-4)',
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
