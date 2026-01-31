/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Mergila', 'serif'],
      },
      colors: {
        dawta: {
          DEFAULT: '#535353',
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#535353',
          700: '#474747',
          800: '#3d3d3d',
          900: '#353535',
          950: '#1a1a1a',
        },
        bordeaux: {
          DEFAULT: '#8B4A5C',
          50: '#f5f2f3',
          100: '#e8dde0',
          200: '#d4bcc2',
          300: '#b8949f',
          400: '#9d6f7d',
          500: '#8B4A5C',
          600: '#7a3d4f',
          700: '#6a3242',
          800: '#5a2837',
          900: '#4a1f2c',
        },
      },
      spacing: {
        'editorial': '1.5rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#1a1a1a',
          },
        },
      },
      backgroundImage: {
        'diffraction': 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(83, 83, 83, 0.03) 1px, rgba(83, 83, 83, 0.03) 2px)',
      },
    },
  },
  plugins: [],
}

