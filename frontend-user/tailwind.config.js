/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#217346',
          light: '#2E8B57',
          dark: '#1D5C38',
        },
        background: '#F5F7FA',
        card: '#FFFFFF',
        border: '#E5E7EB',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
        'modal': '0 8px 32px rgba(0,0,0,0.16)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
