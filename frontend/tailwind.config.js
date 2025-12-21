/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB", // Medical Blue
        secondary: "#1E40AF",
        accent: "#10B981",  // Medical Green
      }
    },
  },
  plugins: [],
}