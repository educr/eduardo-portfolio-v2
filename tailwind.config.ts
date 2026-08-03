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
        bg: "#EDF6EE",
        fg: "#351F57",
        paper: "#FFFFFF",
        accent: "#4C8C5E",
        "accent-dark": "#2E5B3D",
        border: "#7231D6",
        role: "#7231D6",
        "role-dark": "#5a28a8"
      }
    }
  },
  plugins: []
}
export default config
