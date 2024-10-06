const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin');

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
        primary: '#0ED762',
        secondary: '#00FF85',
        text: '#fff',
      },
      fontFamily: {
        sans: ['Raleway', ...defaultTheme.fontFamily.sans],
        heading: ['Russo One', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'scroll-left': 'scrollLeft 20s linear infinite',
        'scroll-right': 'scrollRight 20s linear infinite',
        'spin-slow': 'spin 6s linear infinite',
      },
      keyframes: {
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scrollRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.pause-animation': {
          'animation-play-state': 'paused',
        },
      }, ['hover']);
    }),
  ]
}

// Heading color: #0ED762
// Subheading color: #00FF85
// Text color: #fff
