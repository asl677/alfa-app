import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: '#d4622a',
        'coral-dim': 'rgba(212,98,42,0.15)',
        bg: {
          dark: '#0f0d0a',
          light: '#fefefe',
          classic: '#000000',
        },
        surface: {
          dark: '#1c1810',
          light: '#efefef',
          classic: '#141414',
        },
        cream: {
          DEFAULT: '#ede0c8',
          2: '#b0a08a',
          dark: '#1a1208',
        },
        dust: '#7a6a54',
        positive: '#4caf50',
        negative: '#f44336',
      },
      fontFamily: {
        serif: ["'EB Garamond'", 'Georgia', 'serif'],
        mono: ["'DM Mono'", 'monospace'],
        sans: ["'Space Grotesk'", "'Inter'", "'Helvetica Neue'", 'Arial', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(64px,11.5vw,148px)', { lineHeight: '1.0' }],
        title: ['clamp(36px,5vw,64px)', { lineHeight: '1.1' }],
        section: ['clamp(20px,2.4vw,32px)', { lineHeight: '1.2' }],
        body: ['17px', { lineHeight: '1.75' }],
        'body-sm': ['15px', { lineHeight: '1.6' }],
        label: ['10px', { letterSpacing: '0.14em' }],
        tag: ['9px', { letterSpacing: '0.14em' }],
      },
      borderColor: {
        rule: 'rgba(255,255,255,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
