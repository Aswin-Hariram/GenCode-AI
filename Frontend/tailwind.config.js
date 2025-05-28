module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'indigo-400': '#5c6bc0',
        'indigo-300': '#7986cb',
      },
      fontSize: {
        'xl': '1.25rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
