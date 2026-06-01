/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 800: '#1a3a5c', 900: '#0f2540' },
      },
    },
  },
  plugins: [],
};
