/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        gray: "#bfbfbf",
        primary: "#1E3A8A", // Warna biru tua
        secondary: "#F59E0B", // Warna kuning
        accent: "#10B981", // Warna hijau terang
        danger: "#EF4444", // Warna merah
        info: "#3B82F6", // Warna biru
        light: "#F3F4F6", // Warna abu-abu terang
        dark: "#111827", // Warna abu-abu tua
      },
    },
  },
  plugins: [],
};
