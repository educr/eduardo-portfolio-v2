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
        bg: "#eef2f6",
        fg: "#1f2530",
        accent: "#6fa6c1",
        "accent-dark": "#4f7f94",
        border: "#d6e0ea"
      }
    }
  },
  plugins: []
}
export default config
