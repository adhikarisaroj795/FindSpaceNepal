/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik-Regular", "sans-serif"],
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
        "rubik-semibold": ["Rubik-SemiBold", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#0061FF0A",
          200: "#0061FF1A",
          300: "#0061FF",
        },
        accent: {
          100: "FBFBFD",
        },
        black: {
          Default: "#000000",
          100: "8C8E98",
          200: "#666876",
          300: "#191D31",
        },
        danger: "#F75555",
      },
      // colors: {
      //   primary: "#ff6a00",
      //   secondary: "#ffa400",
      //   tertiary: "#ffd700",
      //   dark: "#1a1a1a",
      //   ligt: "#f5f5f5",
      //   white: "#ffffff",
      // },
    },
  },
  plugins: [],
};
