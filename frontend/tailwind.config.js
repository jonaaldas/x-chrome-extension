/** @type {import('tailwindcss').Config} */
export default {
    content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '6rem',
                '2xl': '8rem',
            },
        },
        fontFamily: {
            body: ["'DM Sans'", 'sans-serif'],
        },
    },
    plugins: [require('daisyui')],
};
