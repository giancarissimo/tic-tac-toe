/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        handDrawn: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'note-shadow': '0px 4px 15px 0px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        darkBackground: '#202F28',
      }
    },
  },
  plugins: [],
}
