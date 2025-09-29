import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f5f3f7",
        fg: "#2c2635",
        accent: "#8e7cc3",
        "accent-dark": "#6d5ca6",
        border: "#e2dce9"
      }
    }
  },
  plugins: []
}
export default config
