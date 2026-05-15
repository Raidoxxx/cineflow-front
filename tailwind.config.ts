import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cfGold: "#FF4655",
        cfDark: "#0B0B0D",
        cfDark2: "#111111",
        cfIvory: "#F5F1E8",
        cfTextMuted: "#A8A8A8",
        cfBorder: "rgba(255,255,255,0.08)",

        adminBg: "#0B0D10",
        adminSidebar: "#11151B",
        adminCard: "#161B22",
        adminBorder: "rgba(255,255,255,0.08)",
        adminText: "#F8F8F8",
        adminTextMuted: "#9CA3AF"
      },
      fontFamily: {
        heading: ["Sora", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        body: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 16px 40px rgba(0, 0, 0, 0.28)",
        card: "0 18px 60px rgba(0, 0, 0, 0.40)",
        glow: "0 0 0 1px rgba(255,70,85,0.20), 0 22px 90px rgba(255,70,85,0.08)"
      },
      backgroundImage: {
        "cf-noise":
          "radial-gradient(1000px circle at 20% 0%, rgba(255,70,85,0.12), transparent 40%), radial-gradient(800px circle at 80% 20%, rgba(255,255,255,0.06), transparent 55%), radial-gradient(900px circle at 50% 100%, rgba(255,70,85,0.10), transparent 55%)"
      }
    }
  },
  plugins: []
};

export default config;
