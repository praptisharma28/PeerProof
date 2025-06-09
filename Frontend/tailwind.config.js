/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors:{
        primary: '#9BC4BC', // Light Blue
        secondary: '#D3FFE9', // Green
        accent: '#8DDBE0', // Cyan
        background: '#000', // Black
        light: '#fff', // White
      }
    },
  },
  plugins: [],
};
