/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Distinctive typography - moving away from generic fonts
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Dark mode foundation
        void: {
          DEFAULT: '#1A1A1A',
          deep: '#0D0D0D',
          soft: '#242424',
          surface: '#2A2A2A',
        },
        // Paper mode (off-white)
        paper: {
          DEFAULT: '#FDFCFB',
          warm: '#F8F6F3',
          cool: '#F5F7FA',
        },
        // Spectral colors - The Prism palette
        spectral: {
          amber: '#E29578',
          orange: '#F4A261',
          gold: '#E9C46A',
          teal: '#83C5BE',
          sky: '#8ECAE6',
          // Chromatic aberration accents
          cyan: '#00D9FF',
          magenta: '#FF006E',
          yellow: '#FFE66D',
        },
        // Text colors
        luminous: {
          primary: '#FAFAFA',
          secondary: '#A0A0A0',
          muted: '#666666',
        },
      },
      spacing: {
        editorial: '1.5rem',
        ray: '0.5px',
      },
      borderWidth: {
        ray: '0.5px',
      },
      boxShadow: {
        // Glow effects for "projected light" look
        'glow-sm': '0 0 10px rgba(142, 202, 230, 0.3)',
        'glow-md': '0 0 20px rgba(142, 202, 230, 0.4)',
        'glow-lg': '0 0 40px rgba(142, 202, 230, 0.5)',
        'glow-spectral': '0 0 30px rgba(226, 149, 120, 0.3), 0 0 60px rgba(142, 202, 230, 0.2)',
        'diffraction': `
          0 0 20px rgba(226, 149, 120, 0.15),
          0 0 40px rgba(244, 162, 97, 0.1),
          0 0 60px rgba(131, 197, 190, 0.1),
          0 0 80px rgba(142, 202, 230, 0.15)
        `,
      },
      backgroundImage: {
        // Spectral gradients
        'spectral-horizontal': 'linear-gradient(90deg, #E29578, #F4A261, #E9C46A, #83C5BE, #8ECAE6)',
        'spectral-diagonal': 'linear-gradient(135deg, #E29578, #F4A261, #E9C46A, #83C5BE, #8ECAE6)',
        'spectral-radial': 'radial-gradient(circle, #E29578, #F4A261, #E9C46A, #83C5BE, #8ECAE6)',
        // Chromatic aberration style
        'chromatic': 'linear-gradient(90deg, #00D9FF 0%, transparent 15%, transparent 85%, #FF006E 100%)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'diffract': 'diffract 8s ease-in-out infinite',
        'ray-travel': 'ray-travel 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '200% 50%' },
          '50%': { backgroundPosition: '-100% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(142, 202, 230, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(142, 202, 230, 0.6)' },
        },
        diffract: {
          '0%, 100%': { filter: 'hue-rotate(0deg)' },
          '50%': { filter: 'hue-rotate(30deg)' },
        },
        'ray-travel': {
          '0%': { backgroundPosition: '200% 0%' },
          '100%': { backgroundPosition: '-100% 0%' },
        },
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
