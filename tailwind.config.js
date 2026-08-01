/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            navy: '#002046',
            blue: '#1b365d',
            green: '#046c50',
            gold: '#cba72f',
            bgLight: '#f8f9fa',
            textDark: '#191c1d'
          }
        },
        fontFamily: {
          sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          serif: ['"Merriweather"', 'serif'],
        }
      },
    },
    plugins: [],
  }