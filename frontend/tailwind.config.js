/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Mono"', 'monospace'],
        serif: ['"Newsreader Variable"', 'Georgia', 'serif'],
        display: ['Mergila', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0F0F0F',
          50: '#2A2A2A',
          100: '#1A1A1A',
          200: '#151515',
          900: '#0F0F0F',
        },
        vermillion: {
          DEFAULT: '#E85D3A',
          50: '#FEF2EE',
          100: '#FDDDD4',
          200: '#F9B5A3',
          300: '#F38D6F',
          400: '#E85D3A',
          500: '#D14A28',
          600: '#B33D20',
          700: '#8E3019',
          800: '#6E2614',
          900: '#4D1A0E',
        },
        mint: {
          DEFAULT: '#3ECFB4',
          50: '#EEFBF8',
          100: '#D0F5ED',
          200: '#A3EBDC',
          300: '#6ADFC7',
          400: '#3ECFB4',
          500: '#2BB89E',
          600: '#1F9880',
          700: '#187862',
          800: '#115A49',
          900: '#0B3C30',
        },
        gold: {
          DEFAULT: '#F2C94C',
          50: '#FEFAED',
          100: '#FDF3D0',
          200: '#FAE6A0',
          300: '#F6D770',
          400: '#F2C94C',
          500: '#E5B825',
          600: '#C49B1C',
          700: '#9E7D16',
          800: '#785F11',
          900: '#52410C',
        },
        surface: '#1A1A1A',
        border: '#2A2A2A',
      },
      spacing: {
        'editorial': '1.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#F5F0EB',
          },
        },
      },
      keyframes: {
        'ripple-expand': {
          '0%': { transform: 'scale(0)', opacity: '0.4' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'ripple': 'ripple-expand 0.8s ease-out forwards',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
