/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        intel: {
          bg: '#080C14',
          panel: '#0F172A',
          card: '#131D31',
          surface: '#1E293B',
          border: '#1E293B',
          borderSubtle: '#334155',
          textMuted: '#94A3B8',
          textBright: '#F8FAFC',
          accent: '#0EA5E9',
          accentGlow: 'rgba(14, 165, 233, 0.15)',
          warning: '#F59E0B',
          danger: '#EF4444',
          success: '#10B981',
          highlight: '#38BDF8',
          nodeOp: '#F43F5E',
          nodeAd: '#0EA5E9',
          nodePhone: '#10B981',
          nodeHandle: '#8B5CF6',
          nodeImage: '#EC4899',
          nodeLoc: '#F59E0B',
          nodeAccount: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Roboto Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
