module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-gray': '#1f2937',
        'light-gray': '#d1d5db',
      },
      boxShadow: {
        'text-lg': '0 10px 15px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
