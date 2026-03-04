export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0df259',
        secondary: '#f43f5e',
        background: {
          dark: '#1a0209',
          card: '#2d030f'
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
