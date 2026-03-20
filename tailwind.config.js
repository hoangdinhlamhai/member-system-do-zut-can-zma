module.exports = {
  darkMode: ["selector", '[zaui-theme="dark"]'],
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#C8956C",
          light: "#E0BFA0",
          dark: "#A07248",
          50: "#FDF6F0",
          100: "#FAEADE",
          200: "#F2D3BA",
          500: "#C8956C",
          600: "#A07248",
          700: "#7D5A38",
        },
        secondary: {
          DEFAULT: "#5B3A29",
          light: "#7D5A42",
          dark: "#3E2518",
        },
        accent: {
          DEFAULT: "#E8734A",
          light: "#FF9D7A",
          dark: "#C85C35",
        },
        cream: "#FBF7F2",
        surface: "#FFFFFF",
        "text-main": "#2A1F18",
        "text-muted": "#8A7968",
        success: {
          DEFAULT: "#3DAA6D",
          light: "#E6F5ED",
        },
        warning: {
          DEFAULT: "#E8A84C",
          light: "#FFF5E6",
        },
        error: {
          DEFAULT: "#D94F4F",
          light: "#FDEDED",
        },
        info: {
          DEFAULT: "#4A8FD4",
          light: "#EBF3FC",
        },
        // Tier colors — refined
        tier: {
          bronze: "#B87B4F",
          "bronze-dark": "#946035",
          silver: "#9EAAAF",
          "silver-dark": "#788488",
          gold: "#D4A840",
          "gold-dark": "#B58E2A",
          platinum: "#8393A0",
          "platinum-dark": "#617280",
        },
        // Dark mode
        "dark-bg": "#171210",
        "dark-surface": "#231E1A",
        "dark-card": "#2E2722",
        "dark-text": "#F0E6DA",
        "dark-muted": "#A6917E",
        "dark-border": "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "Roboto", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        "2.5xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        soft: "0 2px 12px 0 rgba(42,31,24,0.06)",
        card: "0 4px 20px 0 rgba(42,31,24,0.08)",
        elevated: "0 8px 32px 0 rgba(42,31,24,0.12)",
        glass: "0 8px 32px 0 rgba(139,69,19,0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0,0,0,0.4)",
        glow: "0 0 24px 0 rgba(200,149,108,0.25)",
        "inner-soft": "inset 0 2px 4px 0 rgba(42,31,24,0.04)",
      },
      backdropBlur: {
        xs: "4px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-down": "slide-down 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in": "scale-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
};
