/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-bg':
          'url(/images/bg.jpg), linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(22, 43, 76, 0.8))',
      }
    },
  },
  plugins: [],
}

