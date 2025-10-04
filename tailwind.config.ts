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
        bg: "#fef6ff",
        fg: "#241b2e",
        accent: "#c66a9b",
        "accent-dark": "#914b6f",
        border: "#e4d6e4",
        role: "#6a74c8",
        "role-dark": "#4f55a1"
      }
    }
  },
  plugins: []
}
export default config
