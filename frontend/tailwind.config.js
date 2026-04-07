/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Healthcare aesthetic - low-arousal palette
                primary: {
                    50: "#f0faf8",
                    100: "#dff5f1",
                    200: "#bfe9e4",
                    300: "#9ad5d0",
                    400: "#6ab5ac",
                    500: "#4a9b8e", // Primary teal
                    600: "#3a8076",
                    700: "#2f6961",
                    800: "#275550",
                    900: "#214343",
                },
                secondary: {
                    50: "#f3f6fb",
                    100: "#e5eef6",
                    200: "#c5daef",
                    300: "#9fbce3",
                    400: "#6b94d4",
                    500: "#5b8dbe", // Calm blue
                    600: "#4a78ab",
                    700: "#3d6299",
                    800: "#344f7f",
                    900: "#2d4169",
                },
                accent: {
                    50: "#f4f8f5",
                    100: "#e5f0e9",
                    200: "#cbd4c9",
                    300: "#a8b9a8",
                    400: "#85988f",
                    500: "#7ba98e", // Sage green
                    600: "#6a9478",
                    700: "#577c64",
                    800: "#476553",
                    900: "#3c5345",
                },
                // Neutral palette
                neutral: {
                    0: "#ffffff",
                    50: "#faf9f7",
                    100: "#f9f9f7", // Off-white background
                    150: "#f0ede9",
                    200: "#e8e8e5", // Light gray
                    300: "#d8d6d2",
                    400: "#c4bfb8",
                    500: "#9e9993",
                    600: "#7a7470",
                    700: "#5a5450",
                    800: "#3a3330",
                    900: "#1a1310",
                },
                // Status colors - muted variants
                success: {
                    50: "#faf9f4",
                    100: "#f3f1e6",
                    500: "#6b8e23", // Muted success
                    600: "#5a771d",
                    700: "#496017",
                },
                warning: {
                    50: "#faf7f2",
                    100: "#f5ede3",
                    500: "#c9844e", // Muted alert
                    600: "#b4704a",
                    700: "#985d42",
                },
                error: {
                    50: "#faf7f6",
                    100: "#f5e9e6",
                    500: "#a96b5a",
                    600: "#8f574b",
                    700: "#75453d",
                },
            },
            fontSize: {
                xs: ["0.75rem", { lineHeight: "1rem" }],
                sm: ["0.875rem", { lineHeight: "1.25rem" }],
                base: ["1rem", { lineHeight: "1.5rem" }],
                lg: ["1.125rem", { lineHeight: "1.75rem" }],
                xl: ["1.25rem", { lineHeight: "1.75rem" }],
                "2xl": ["1.5rem", { lineHeight: "2rem" }],
                "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
                "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
                "5xl": ["3rem", { lineHeight: "1" }],
            },
            fontFamily: {
                sans: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "Roboto",
                    '"Helvetica Neue"',
                    "Arial",
                    '"Noto Sans"',
                    "sans-serif",
                ],
            },
            spacing: {
                0: "0",
                1: "0.25rem",
                2: "0.5rem",
                3: "0.75rem",
                4: "1rem",
                5: "1.25rem",
                6: "1.5rem",
                7: "1.75rem",
                8: "2rem",
                9: "2.25rem",
                10: "2.5rem",
                12: "3rem",
                14: "3.5rem",
                16: "4rem",
                20: "5rem",
                24: "6rem",
                28: "7rem",
                32: "8rem",
                36: "9rem",
                40: "10rem",
                44: "11rem",
                48: "12rem",
            },
            borderRadius: {
                none: "0",
                sm: "0.375rem",
                DEFAULT: "0.5rem",
                md: "0.625rem",
                lg: "0.75rem",
                xl: "1rem",
                "2xl": "1.25rem",
                "3xl": "1.5rem",
                full: "9999px",
            },
            boxShadow: {
                none: "none",
                sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
            },
            transition: {
                DEFAULT: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
                fast: "all 75ms cubic-bezier(0.4, 0, 0.2, 1)",
                slow: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            },
            keyframes: {
                breathing: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.7" },
                },
                slideUp: {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                slideDown: {
                    from: { opacity: "0", transform: "translateY(-10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
            },
            animation: {
                breathing: "breathing 3s ease-in-out infinite",
                slideUp: "slideUp 300ms ease-out",
                slideDown: "slideDown 300ms ease-out",
                fadeIn: "fadeIn 300ms ease-out",
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms")({
            strategy: "class",
        }),
    ],
}