/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        './layouts/**/*.{js,ts,jsx,tsx}',
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './utils/*.ts',
        './node_modules/@energie-burgenland/shared-components-nb/dist/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        fontSize: {
            sm: ['0.813rem', '1rem'], // Small header links
            base: ['1rem', '1.125rem'], // Description in Cards // Header links // Button text
            lg: ['1.188rem', '1.313'], // TextBlockWithButtonAndImage Label
            xl: ['1.5rem', '2.188rem'], // 24px // TextBreakSection Subtitle / HEro Subtitle / FullWidthImage Subtitle / TextBlockWithButtonAndImage Description
            '2xl': ['1.563rem', '1.75rem'], // Title next to hero icons / Title below numbers in FullWidthImage
            '3xl': ['2.063rem', '2.313rem'], // Title in Card
            '4xl': ['2.75rem', '3.063rem'], // 44px // TextBreakSection Title / TextBlockWithButtonAndImage Title / FullWidthImage Numbers
            '5xl': ['4.875rem', '5.438rem'], // Hero title
        },
        extend: {
            zIndex: {
                60: 60,
                70: 70,
            },
            borderRadius: {
                10: '10px',
            },
            colors: {
                primary: { DEFAULT: '#E75113', dark: '#E13505' },
                secondary: '#132F3E',
                tertiary: {
                    DEFAULT: '#CFCCBF',
                    light: 'rgba(207, 204, 191, 0.25)',
                    lightest: '#F0EEED',
                },
                gray: {
                    50: '#f8f8f8',
                    100: '#f0f0f0',
                    200: '#e4e4e4',
                    300: '#d1d1d1',
                    400: '#b4b4b4',
                    500: '#a1a1a1',
                    600: '#818181',
                    700: '#6a6a6a',
                    800: '#5a5a5a',
                    900: '#4e4e4e',
                    950: '#00000026',
                },
                'on-primary': '#fff',
                'on-secondary': '#fff',
                'on-info': '#FFFFFF',
                'on-success': '#000000',
                'on-failure': '#FFFFFF',
                'on-tertiary': '#000000',
            },
            fontFamily: {
                inter: ['var(--font-inter)'],
                comfortaa: ['var(--font-comfortaa)'],
            },
            containers: {
                min: '0rem',
            },
        },
    },
    safelist: [
        'font-comfortaa',
        {
            pattern: /text-(sm|base|lg|xl|2xl|3xl|4xl|5xl)/,
            variants: ['sm', 'md', 'lg', 'xl', '2xl'],
        },
        {
            pattern: /text-(|on)-(primary|secondary|tertiary|tertiary-light)/,
        },
        {
            pattern: /text-(primary|secondary|tertiary|tertiary-light)/,
            variants: ['marker'],
        },
        {
            pattern: /bg-(primary|secondary|tertiary|tertiary-light)/,
        },
        {
            pattern: /border-(primary|secondary|tertiary|tertiary-light)/,
        },
        {
            pattern: /grid-cols-/,
            variants: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
        },
    ],
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/container-queries'),
    ],
}
