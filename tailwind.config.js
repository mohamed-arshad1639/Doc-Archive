/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: ['class', '.dark-theme'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'jet-black': '#121212',
        'off-white': '#F5F5F5',
        'soft-gray': '#E0E0E0',
        'dark-gray': '#1E1E1E',
      },
    },
  },
  plugins: [],
}
