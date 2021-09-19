const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.html'
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
        blueGray: colors.blueGray
      },
      maxWidth: {
        'full-screen': 'calc(100vw - 20px)'
      },
      width: {
        'full-screen': 'calc(100vw - 20px)'
      },
      height: {
        '128': '29rem'
      }
    },
  },
  variants: {
    extend: {
      ringColor: ['focus-visible'],
      ringWidth: ['focus-visible'],
      ringOpacity: ['focus-visible'],
    },
  },
  plugins: [],
};
