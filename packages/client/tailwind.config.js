const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './containers/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'fill-40': 'repeat(auto-fill, minmax(180px, 1fr))',
      },
      delay: {
        100: '100',
        200: '200',
        300: '300',
        400: '400',
        500: '500',
      },
      colors: {
        primary: '#FFD966',
        secondary: '#3EC333',

        textPrimary: '#797979',
        placeholder: '#ccc',
        disabled: '#797979',

        cred: '#FF0000',
        cpurple: '#871CF2',
        cblue: '#0017E7',
        cgreen: '#3EC333',
        corange: '#F99500',
        cgray: '#797979',

        google: '#FF3300',
        facebook: '#007AFF',
        github: '#333',

        cardShadow: '#DCC600',
      },
      boxShadow: {
        tight: '-4px 4px 4px 0 rgb(0 0 0 / 0.05)',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('sibling', '&:not(:first-child)')
    }),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'animation-delay': (value) => ({
            'animation-delay': `${value}ms`,
          }),
        },
        { values: theme('delay') },
      )
    }),
  ],
}
