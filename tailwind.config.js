/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Example Palette (Palette 1) — you can change later */
        primary: "#2CB7B1",
        secondary: "#F4EDE2",
        accent: "#1A3C57",
        background: "#FAF9F7",
        muted: "#C8D8D6",
      },
    },
  },
  plugins: [],
};
