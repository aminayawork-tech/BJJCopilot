import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        accent: '#dc2626',
        'text-primary': '#f5f5f5',
        'text-secondary': '#a3a3a3',
        border: '#262626',
      },
    },
  },
  plugins: [],
};

export default config;
