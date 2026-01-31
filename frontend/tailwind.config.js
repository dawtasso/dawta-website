/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Warm, readable typography
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // Warm paper backgrounds
        paper: {
          DEFAULT: '#FAF8F5',
          warm: '#F5F1EA',
          cream: '#FFFDF8',
        },
        // Earthy, natural palette
        earth: {
          charcoal: '#2C2C2C',
          stone: '#5C5C5C',
          clay: '#8B7355',
          terracotta: '#C4785A',
          sage: '#7A9A7A',
          forest: '#4A6741',
          moss: '#6B7F5E',
          sky: '#7BA3B5',
          river: '#5B8A9A',
        },
        // Text hierarchy
        ink: {
          DEFAULT: '#1A1A1A',
          soft: '#3D3D3D',
          muted: '#6B6B6B',
          faint: '#9A9A9A',
        },
      },
      spacing: {
        editorial: '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'lifted': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'warm': '0 4px 24px rgba(139, 115, 85, 0.1)',
      },
      borderRadius: {
        'organic': '3px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
          },
        },
      },
    },
  },
  plugins: [],
}
