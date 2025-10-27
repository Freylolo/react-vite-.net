/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5fbff',
          100: '#e0f2ff',
          200: '#bfe4ff',
          300: '#8dd0ff',
          400: '#52b7ff',
          500: '#2196f3',
          600: '#1d7ed1',
          700: '#1863a6',
          800: '#144f85',
          900: '#123f69'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}
