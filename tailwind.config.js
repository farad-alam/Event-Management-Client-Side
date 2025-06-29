/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        eventtheme: {
          "primary": "#3B82F6",
          "secondary": "#14B8A6",
          "accent": "#F97316",
          "neutral": "#1F2937",
          "base-100": "#FFFFFF",
          "base-200": "#F9FAFB",
          "base-300": "#E5E7EB",
          "info": "#06B6D4",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
      },
      "light",
      "dark",
    ],
    base: true,
    styled: true,
    utils: true,
  },
}