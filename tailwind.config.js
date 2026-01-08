/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ceci est crucial pour scanner tous vos composants
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}