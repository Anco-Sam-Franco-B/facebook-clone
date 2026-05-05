/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        messenger: {
          50: '#eef8ff',
          100: '#d9f0ff',
          200: '#bce4ff',
          300: '#8ed4ff',
          400: '#59bcff',
          500: '#2fa1ff',
          600: '#0084FF', // Primary Messenger Color
          700: '#006add',
          800: '#0055b8',
          900: '#064897',
          950: '#042d62',
        },
        facebook: {
          50: '#f0f2f5',
          100: '#e7f3ff',
          200: '#dbeafe',
          300: '#bfdbfe',
          400: '#93c5fd',
          500: '#1877f2', // Primary Facebook Color
          600: '#0866ff',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        primary: {
          50: '#eef8ff',
          100: '#d9f0ff',
          200: '#bce4ff',
          300: '#8ed4ff',
          400: '#59bcff',
          500: '#2fa1ff',
          600: '#0084FF',
          700: '#006add',
          800: '#0055b8',
          900: '#064897',
          950: '#042d62',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
