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
        bg: "#FDF8EE",
        fg: "#351F57",
        paper: "#FFFFFF",
        accent: "#D78C02",
        "accent-dark": "#82531A",
        border: "#7231D6",
        role: "#7231D6",
        "role-dark": "#5a28a8"
      }
    }
  },
  plugins: []
}
export default config
