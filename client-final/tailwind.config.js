/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens : {
      "mobile":{"max":"500px"},
      "tablet":{"max":"800px"},
      "small-computer":{"max":"1250px"},
      "big-computer":"1700px"
    },
    fontSize: {
      "50":"3.125rem",
      "20":"1.25rem",
      "24":"1.5rem", 
      "18":"1.125rem",
      "16":"1rem",
      "14":"0.875rem"

    },
    extend: {
      fontFamily:{
        "dm-sans":"DM Sans, sans-serif"
      },
      colors: {
        "pharmagency-cyan":"#00B591",
        "pharmagency-white":"#FFFFFF",
        "pharmagency-grey":"#707070",
        "pharmagency-blue":"#0E6095",
        "pharmagency-red":"#EA1D2C",
        "pharmagency-light-grey":"#DBDBDB",
        "pharmagency-lighter-grey":"#F7F7F7"
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      });
    }
  ],
}

