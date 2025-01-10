/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3996f3',
        'primary-hover': '#163b78',
        'text-main': '#333333',
        'text-heading': '#000000',
        'text-footer': '#666666',
        'bg-footer': '#F5F5F5',
        'font-dark': 'rgb(22, 59, 120)',
        'font-light': 'rgb(57, 150, 243)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}