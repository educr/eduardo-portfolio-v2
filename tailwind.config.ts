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
        bg: "#E8F1FA",
        fg: "#351F57",
        paper: "#FFFFFF",
        accent: "#5B8FB0",
        "accent-dark": "#35617D",
        border: "#7231D6",
        role: "#7231D6",
        "role-dark": "#5a28a8"
      }
    }
  },
  plugins: []
}
export default config
