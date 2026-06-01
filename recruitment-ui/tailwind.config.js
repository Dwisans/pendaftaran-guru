/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "cafe-maroon": "#7E262E",
        "cafe-orange": "#F58633",
        "cafe-brick": "#B54D34",
        "cafe-red": "#ED3338",
      },
    },
  },
  plugins: [],
};
