import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fcf8fd",
        surface: "#fcf8fd",
        "surface-bright": "#fcf8fd",
        "surface-dim": "#dcd9de",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f2f7",
        "surface-container": "#f1ecf2",
        "surface-container-high": "#ebe7ec",
        "surface-container-highest": "#e5e1e6",
        "surface-variant": "#e5e1e6",
        "on-background": "#1c1b1f",
        "on-surface": "#1c1b1f",
        "on-surface-variant": "#47464f",
        outline: "#787680",
        "outline-variant": "#c8c5d0",
        primary: "#070235",
        "on-primary": "#ffffff",
        "primary-container": "#1e1b4b",
        "on-primary-container": "#8683ba",
        "primary-fixed": "#e3dfff",
        "primary-fixed-dim": "#c4c1fb",
        "on-primary-fixed": "#181445",
        "on-primary-fixed-variant": "#444173",
        "inverse-primary": "#c4c1fb",
        secondary: "#4648d4",
        "on-secondary": "#ffffff",
        "secondary-container": "#6063ee",
        "on-secondary-container": "#fffbff",
        "secondary-fixed": "#e1e0ff",
        "secondary-fixed-dim": "#c0c1ff",
        "on-secondary-fixed": "#07006c",
        "on-secondary-fixed-variant": "#2f2ebe",
        tertiary: "#160700",
        "on-tertiary": "#ffffff",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "9999px",
      },
      spacing: {
        card_padding: "24px",
        stack_gap: "12px",
        element_height: "40px",
        gutter: "16px",
        container_max_width: "1024px",
        section_margin: "32px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "label-caps": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" },
        ],
        currency: ["16px", { lineHeight: "24px", fontWeight: "500" }],
        h1: [
          "30px",
          { lineHeight: "38px", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "body-base": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        h3: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        h2: [
          "24px",
          { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
      },
      boxShadow: {
        card:
          "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
