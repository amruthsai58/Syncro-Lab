/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        syncro: {
          // Original Black, Gold & White Brand Theme
          black: '#0A0A0A',
          'black-soft': '#111111',
          'black-card': '#161616',
          'black-border': '#1E1E1E',
          'black-hover': '#242424',
          
          gold: '#C9A24B',
          'gold-light': '#F5D98B',
          'gold-mid': '#D4AF37',
          'gold-dark': '#8E6B23',
          'gold-muted': '#4A3B18',

          white: '#FFFFFF',
          'white-muted': '#CCCCCC',
          'white-dim': '#888888',

          // Difficulty Badges
          easy: '#22C55E',
          'easy-bg': 'rgba(34, 197, 94, 0.12)',
          'easy-border': 'rgba(34, 197, 94, 0.25)',

          medium: '#EAB308',
          'medium-bg': 'rgba(234, 179, 8, 0.12)',
          'medium-border': 'rgba(234, 179, 8, 0.25)',

          hard: '#EF4444',
          'hard-bg': 'rgba(239, 68, 68, 0.12)',
          'hard-border': 'rgba(239, 68, 68, 0.25)',

          success: '#22C55E',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Montserrat', 'Outfit', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5D98B 0%, #C9A24B 50%, #8E6B23 100%)',
        'gold-gradient-h': 'linear-gradient(90deg, #F5D98B 0%, #C9A24B 50%, #F5D98B 100%)',
        'gold-radial': 'radial-gradient(ellipse at center, #F5D98B 0%, #C9A24B 60%, #4A3B18 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
        'card-gradient': 'linear-gradient(145deg, #161616 0%, #111111 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,162,75,0.18) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201,162,75,0.4)',
        'gold-sm': '0 0 10px rgba(201,162,75,0.25)',
        'gold-lg': '0 0 40px rgba(201,162,75,0.6)',
        'gold-inset': 'inset 0 1px 0 rgba(245,217,139,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.6)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.8)',
      },
      animation: {
        'hex-spin': 'hexSpin 3s linear infinite',
        'hex-pulse': 'hexPulse 2s ease-in-out infinite',
        'gold-shimmer': 'goldShimmer 2.5s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'stagger-1': 'fadeUp 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'stagger-2': 'fadeUp 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'stagger-3': 'fadeUp 0.6s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'stagger-4': 'fadeUp 0.6s 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        hexSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        hexPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.95)' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,162,75,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(201,162,75,0.5)' },
        },
      },
    },
  },
  plugins: [],
};
