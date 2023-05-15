/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{svelte,html,js,ts}'],
  theme: {
    extend: {
      colors:{
        'cyan': '#82dce7',
        'cyan-light': '#e5f3f8',
        'cyan-dark': '#61bdc8',
        
      },
    },
  },
  plugins: [],
}

