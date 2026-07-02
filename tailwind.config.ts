import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { mono: ["'Space Mono'", 'monospace'] },
      colors: {
        space:  '#05050f',
        nebula: '#0a0a1f',
        accent: '#8B7FFF',
        cyan:   '#4FC3F7',
        gold:   '#FFD54F',
      },
    },
  },
  plugins: [],
}
export default config
