const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './public/*.html',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/views/**/*.{erb,haml,html,slim}'
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#0ED762',
          dim: 'rgba(14, 215, 98, 0.2)',
          glow: 'rgba(14, 215, 98, 0.4)',
        },
        surface: {
          black: '#0A0A0A',
          dark: '#111111',
          mid: '#1A1A1A',
          light: '#E8E8E8',
          white: '#F5F5F0',
        },
        muted: '#6B6B6B',
        border: '#2A2A2A',
      },
      fontFamily: {
        display: ['"Syne"', ...defaultTheme.fontFamily.sans],
        body: ['"Instrument Sans"', ...defaultTheme.fontFamily.sans],
        mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 10vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'body-lg': ['1.25rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'meta': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
        'meta-sm': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.15em' }],
      },
      spacing: {
        'gutter': 'clamp(1.5rem, 4vw, 6rem)',
      },
      transitionTimingFunction: {
        'expo-in-out': 'cubic-bezier(0.83, 0, 0.17, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'power3-out': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
      transitionDuration: {
        'motion-fast': '200ms',
        'motion-normal': '400ms',
        'motion-slow': '800ms',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scroll-line': 'scrollLine 2s ease-in-out infinite',
      },
      keyframes: {
        scrollLine: {
          '0%, 100%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { transform: 'scaleY(1)', transformOrigin: 'top' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ]
}
