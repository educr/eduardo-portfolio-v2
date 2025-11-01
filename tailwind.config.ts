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
        bg: "#f1f7fb",
        fg: "#10212b",
        accent: "#2f9e99",
        "accent-dark": "#1f7a73",
        border: "#c6e3e8",
        role: "#2563eb",
        "role-dark": "#1d4ed8"
      }
    }
  },
  plugins: []
}
export default config
