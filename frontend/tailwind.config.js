/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-grey": "#393D3F",
        "off-white": "#FDFDFF",
        "warm-grey": "#C6C5B9",
        "soft-teal": "#62929E",
        "muted-slate": "#546A7B",
      },
    },
  },
};
