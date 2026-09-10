/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary: warm saffron/marigold — the spiritual hero color
        saffron: {
          50: '#FFF4E9',
          100: '#FFE3C7',
          200: '#FFC98F',
          300: '#CD8B6E',
          400: '#EE8A38',
          500: '#A65338', // base
          600: '#C85D12',
          700: '#A2480D',
          800: '#7C3609',
          900: '#5A2606',
        },
        // Secondary: temple maroon — deep, elegant, not loud
        maroon: {
          50: '#FBEEEF',
          100: '#F3D2D6',
          200: '#DFA3AA',
          300: '#C6737F',
          400: '#A6394A',
          500: '#55334A', // base
          600: '#6E1D2A',
          700: '#54151F',
          800: '#3D0F16',
        },
        // Accent: antique gold for hairlines, borders, badges
        gold: {
          50: '#FDF8EC',
          100: '#F7E9C2',
          200: '#EDD48F',
          300: '#DFC99F',
          400: '#D4AF37',
          500: '#B39562', // base
          600: '#A3821D',
          700: '#7D6416',
        },
        // Neutral warm surfaces — white is the main background
        sand: {
          50: '#FFFFFF',
          100: '#FFFCF8',
          150: '#F0EAE2',
          200: '#FDF1E1',
          300: '#F5E6CF',
          400: '#E9D6B8',
        },
        // Warm ink for text (never cold gray)
        ink: {
          50: '#EFE7DA',
          100: '#DDD0BC',
          300: '#C9BBA8',
          500: '#8A7863',
          700: '#74696A',
          900: '#292328',
        },
        success: '#3E8E5A',
        warning: '#C9821F',
        danger: '#C0392B',
      },
      fontFamily: {
        display: ['System'],
      },
      borderRadius: {
        xl2: '20px',
        xl3: '28px',
      },
    },
  },
  plugins: [],
};
