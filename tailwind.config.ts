import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        chapel: {
          DEFAULT: '#1E9FD8',
          50: '#EBF6FD', 100: '#C8E8F8', 200: '#8ED0F1',
          300: '#4DB5E8', 400: '#1E9FD8', 500: '#1480B0',
          600: '#0E6188', 700: '#094662', 800: '#062E41', 900: '#031820',
        },
        navy: { 500: '#0A2D52', 600: '#071F3A', 700: '#040F1E' },
        gold: { 400: '#FFD23F', 500: '#F0B429', 600: '#C8941A', 700: '#9A6F0C' },
        crimson: { 500: '#8B1A1A', 600: '#6B1111', 700: '#4E0A0A' },
        magenta: { 400: '#E8006A', 500: '#C8005A' },
        ivory: { DEFAULT: '#F8F7F3', dark: '#F0EEE8' },
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],           // Page titles, chapel name
        heading: ['Libre Baskerville', 'serif'], // Section headings
        body: ['Nunito', 'sans-serif'],          // All body text
        quote: ['Cormorant Garamond', 'serif'],  // Scripture quotes
      },
      boxShadow: {
        'chapel': '0 4px 24px rgba(14,97,136,0.15)',
        'chapel-lg': '0 8px 48px rgba(14,97,136,0.25)',
        'gold': '0 4px 24px rgba(240,180,41,0.30)',
        'live': '0 0 20px rgba(239,68,68,0.50)',
      },
      backgroundImage: {
        'radial-light': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(30,159,216,0.12) 0%, transparent 70%)',
        'chapel-gradient': 'linear-gradient(135deg, #0A2D52 0%, #1E9FD8 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F0B429 0%, #FFD23F 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(10,45,82,0.7) 0%, rgba(10,45,82,0.4) 50%, rgba(10,45,82,0.8) 100%)',
      },
      animation: {
        'live-pulse': 'livePulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'radiate': 'radiate 3s ease-out infinite',
      },
      keyframes: {
        livePulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(239,68,68,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        radiate: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
    },
  },
}
export default config
