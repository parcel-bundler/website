const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/plugin-browser/*.js',
    './src/**/*.html',
    './src/**/*.njk',
    './src/**/*.md'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
        emerald: colors.emerald,
        lime: colors.lime,
        orange: colors.orange,
        rose: colors.rose,
        fuchsia: colors.fuchsia,
        blueGray: colors.slate,
        violet: colors.violet,
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
      },
      maxWidth: {
        'full-screen': 'calc(100vw - 20px)'
      },
      width: {
        'full-screen': 'calc(100vw - 20px)'
      },
      height: {
        '128': '29rem'
      },
    },
    screens: {
      'xs': '375px',
      ...defaultTheme.screens,
    }
  },
  variants: {
    extend: {
      ringColor: ['focus-visible'],
      ringWidth: ['focus-visible'],
      ringOpacity: ['focus-visible'],
    },
  },
  plugins: [
    require('tailwindcss-safe-area'),
  ],
};
