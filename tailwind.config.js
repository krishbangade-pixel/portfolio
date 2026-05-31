/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#05050b",
        neon: "#22d3ee",
        violet: "#8b5cf6",
      },
      boxShadow: {
        neon: "0 0 30px rgba(34, 211, 238, 0.25)",
      },
      backgroundImage: {
        cinematic:
          "radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.3), transparent 30%), radial-gradient(circle at 80% 10%, rgba(34, 211, 238, 0.25), transparent 28%), linear-gradient(180deg, #07070f 0%, #030307 70%)",
      },
      animation: {
        marquee: "marquee 22s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
