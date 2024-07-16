/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./component/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      transitionDuration: {
        200: "200ms",
      },
      scale: {
        105: "1.05",
      },
      boxShadow: {
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  variants: {
    extend: {
      scale: ["hover", "focus"],
      translate: ["hover", "focus"],
      opacity: ["group-hover"],
      boxShadow: ["hover", "focus"],
    },
  },
  plugins: [],
  safelist: [
    'hover:border-indigo-400',
    'hover:border-green-500',
    'hover:border-purple-500',
    'hover:border-orange-500',
    'hover:border-red-500',
    'hover:border-stone-500',
    'hover:text-indigo-400',
    'hover:text-green-500',
    'hover:text-purple-500',
    'hover:text-orange-500',
    'hover:text-red-500',
    'hover:border-stone-500',
    'text-green-500',
    'text-purple-500',
    'text-orange-500',
    'text-indigo-400',
    'text-red-500',
    'text-stone-500',
    'text-yellow-500',
  ],
};
