/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{svelte,html,js,ts}'],
  theme: {
    extend: {
      animation: {
        'bouncex': 'bouncex 1s linear infinite',
      },
      keyframes: {
        bouncex: {
          '0%, 100%':{
            transform: 'translateX(-5%)' ,
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%':{ 
            transform: 'translateX(0%)' ,
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)', 
          },
        },
      },
      colors:{
        'cyan': '#82dce7',
        'cyan-light': '#e5f3f8',
        'cyan-dark': '#6cc0ca',
        
      },
    },
  },
  plugins: [],
}

