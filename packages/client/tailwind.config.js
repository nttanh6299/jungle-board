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
