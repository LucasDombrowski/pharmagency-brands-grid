/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      "50":"3.125rem",
      "20":"1.25rem",
      "24":"1.5rem", 
      "16":"1rem"

    },
    extend: {
      fontFamily:{
        "poppins":"Poppins, sans-serif"
      },
      colors: {
        "pharmagency-cyan":"#37C2CA",
        "pharmagency-white":"#FFFFFF",
        "pharmagency-grey":"#707070",
        "pharmagency-blue":"#0E6095",
        "pharmagency-red":"#EA1D2C",
        "pharmagency-light-grey":"#DBDBDB"
      }
    },
  },
  plugins: [],
}
