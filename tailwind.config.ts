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
        bg: "#faf6f1",
        fg: "#2a1f15",
        paper: "#fefcf8",
        accent: "#b8704a",
        "accent-dark": "#8f5030",
        border: "#eddfd2",
        role: "#2563eb",
        "role-dark": "#1d4ed8"
      }
    }
  },
  plugins: []
}
export default config
