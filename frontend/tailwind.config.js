/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Include all Vue components in src directory
  ],
  theme: {
    extend: {
      borderRadius: {
        'custom': '27px' // Custom class name and value
      },
      colors: {
        'custom-purple': '#B584FF'
      },
      backgroundImage: {
        'custom-linear-gradient': 'linear-gradient(90deg, #5D0DE6, #7439FF)'
      },
      boxShadow: {
        'custom-shadow': '0px 10px 33px rgba(0, 0, 0, 0.3)'  // Adjusted for CSS syntax correctness
      }
    },
  },
  plugins: [],
}

