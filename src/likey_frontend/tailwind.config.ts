import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors:{
        boy : "#53A5C0",
        girl: "#B694D7",
        main: "#BB6FCA",
        background : "#F9FCFD",
        text: "#050C0E",
        border_placeholder : "#D1D1D1",
      },
      fontSize: {
        title : "64px",
        content : "24px",
      },
      height: {
        auth_form_input : "80px",
        photo_form_input : "222px"
      },
      width: {
        photo_form_input : "222px"
      },
      borderRadius: {
        default: "25px"
      },
      borderWidth: {
        3 : "3px"
      }
    },
  },
  plugins: [],
};
export default config;
