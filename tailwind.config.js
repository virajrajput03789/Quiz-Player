/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        blurple: '#5865f2',
        'dark-blurple': '#3442d9',
        'hover-blurple': '#8891f2',
        'spring-green': '#57f287',
        cerulean: '#00b0f4',
        'ember-orange': '#fda220',
        'ekko-red': '#de2761',
        snow: '#ffffff',
        'not-quite-black': '#23272a',
        'dark-charcoal': '#2c2f33',
        fog: '#babcd9',
        greyple: '#99aab5',
        'dim-grey': '#50555f',
        'cosmic-page': '#0e0f2d',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 23, 42, 0.28)',
      },
      fontFamily: {
        display: ['Nunito', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '24px',
        pill: '104px',
      },
      spacing: {
        '18': '18px',
        '30': '30px',
      },
    },
  },
  plugins: [],
}
