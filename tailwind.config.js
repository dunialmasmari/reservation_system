/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#440099',
        'primary-700': '#3d007a',
        'primary-800': '#35006d',
        'primary-900': '#2c005f',
        'primary-300': '#9162e4',
        'primary-100': '#f0e6fd',
        'primary-50': '#f3e6ff',
        'secondary': '#333333',
      },
    },
  },
  plugins: [],
}