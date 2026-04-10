/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Stitch Design System: "Living Laboratory" - Earthy Neon
                // Primary: Deep forest green / olive
                primary: {
                    50:  "#f7fbe7",
                    100: "#f2f6e2",
                    200: "#ecf0dc",
                    300: "#e6ead6",
                    400: "#e0e5d1",
                    500: "#bed108", // primary_fixed_dim
                    600: "#5a6400", // primary (dark olive)
                    700: "#434b00",
                    800: "#1a1e00",
                    900: "#0d1000",
                    lime: "#eafe45", // primary_container / CTA lime
                },
                // Secondary: Muted forest green
                secondary: {
                    50:  "#f0f8f2",
                    100: "#caebcc", // secondary_container
                    200: "#aecfb1", // secondary_fixed_dim
                    300: "#7aac80",
                    400: "#48654d", // secondary
                    500: "#314d37",
                    600: "#2b4731", // override secondary
                    700: "#05210e",
                    800: "#031508",
                    900: "#010a04",
                },
                // Surface / Background tokens
                surface: {
                    DEFAULT: "#f7fbe7",   // surface
                    low:     "#f2f6e2",   // surface_container_low
                    mid:     "#ecf0dc",   // surface_container
                    high:    "#e6ead6",   // surface_container_high
                    highest: "#e0e5d1",   // surface_container_highest
                    white:   "#ffffff",   // surface_container_lowest
                    dim:     "#d8dcc9",   // surface_dim
                    dark:    "#191d11",   // on_surface (dark text)
                },
                // Outline tokens
                outline: {
                    DEFAULT: "#777961",   // outline
                    variant: "#c7c8ad",   // outline_variant
                },
                // Status colors
                success: {
                    50:  "#f0fdf4",
                    100: "#dcfce7",
                    200: "#bbf7d0",
                    300: "#86efac",
                    400: "#4ade80",
                    500: "#22c55e",
                    600: "#16a34a",
                    700: "#15803d",
                    800: "#166534",
                    900: "#14532d",
                },
                warning: {
                    50:  "#fffbeb",
                    100: "#fef3c7",
                    500: "#f59e0b",
                    600: "#d97706",
                    700: "#b45309",
                },
                error: {
                    50:  "#fff1f2",
                    100: "#ffe4e6",
                    300: "#fca5a5",
                    500: "#ef4444",
                    600: "#ba1a1a",
                    700: "#93000a",
                    900: "#7f1d1d",
                },
                // Legacy neutral - keep for backward compat
                neutral: {
                    0:   "#ffffff",
                    50:  "#f7fbe7",
                    100: "#f2f6e2",
                    150: "#ecf0dc",
                    200: "#e6ead6",
                    300: "#c7c8ad",
                    400: "#777961",
                    500: "#464834",
                    600: "#2e3225",
                    700: "#191d11",
                    800: "#0d1000",
                    900: "#080a00",
                },
                accent: {
                    50:  "#f3fdf6",
                    100: "#defadf", // tertiary_container
                    200: "#ceeacf", // tertiary_fixed
                    300: "#b2ceb4",
                    400: "#4c644f", // tertiary
                    500: "#354c39",
                    600: "#1e3523", // override_tertiary
                    700: "#092010",
                },
            },
            fontFamily: {
                display: ["Manrope", "Inter", "sans-serif"],
                sans:    ["Inter", "Manrope", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
                mono:    ["JetBrains Mono", "Fira Code", "monospace"],
            },
            fontSize: {
                xs:   ["0.75rem",  { lineHeight: "1rem" }],
                sm:   ["0.875rem", { lineHeight: "1.4rem" }],
                base: ["1rem",     { lineHeight: "1.6rem" }],
                lg:   ["1.125rem", { lineHeight: "1.75rem" }],
                xl:   ["1.25rem",  { lineHeight: "1.75rem" }],
                "2xl":["1.5rem",   { lineHeight: "2rem" }],
                "3xl":["1.875rem", { lineHeight: "2.25rem" }],
                "4xl":["2.25rem",  { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
                "5xl":["3rem",     { lineHeight: "1.1",   letterSpacing: "-0.02em" }],
                "6xl":["3.75rem",  { lineHeight: "1",     letterSpacing: "-0.02em" }],
                "7xl":["4.5rem",   { lineHeight: "1",     letterSpacing: "-0.02em" }],
            },
            borderRadius: {
                none:  "0",
                sm:    "0.375rem",
                DEFAULT:"0.5rem",
                md:    "0.75rem",
                lg:    "1rem",
                xl:    "1.5rem",
                "2xl": "2rem",
                "3xl": "3rem",
                full:  "9999px",
            },
            boxShadow: {
                none:   "none",
                sm:     "0 1px 2px 0 rgba(25, 29, 17, 0.05)",
                DEFAULT:"0 1px 3px 0 rgba(25, 29, 17, 0.08)",
                md:     "0 4px 12px -2px rgba(25, 29, 17, 0.06)",
                lg:     "0 10px 24px -4px rgba(25, 29, 17, 0.06)",
                xl:     "0 20px 40px -8px rgba(25, 29, 17, 0.06)",
                "2xl":  "0 40px 60px -12px rgba(25, 29, 17, 0.08)",
                glass:  "0 8px 32px rgba(25, 29, 17, 0.08)",
                inner:  "inset 0 2px 4px 0 rgba(25, 29, 17, 0.04)",
            },
            spacing: {
                0: "0", 1: "0.25rem", 2: "0.5rem", 3: "0.75rem",
                4: "1rem", 5: "1.25rem", 6: "1.5rem", 7: "1.75rem",
                8: "2rem", 9: "2.25rem", 10: "2.5rem", 11: "2.75rem",
                12: "3rem", 14: "3.5rem", 16: "4rem", 18: "4.5rem",
                20: "5rem", 24: "6rem", 28: "7rem", 32: "8rem",
                36: "9rem", 40: "10rem", 44: "11rem", 48: "12rem",
                56: "14rem", 64: "16rem", 72: "18rem", 80: "20rem",
            },
            backdropBlur: {
                xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px",
            },
            keyframes: {
                breathing: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.6" },
                },
                slideUp: {
                    from: { opacity: "0", transform: "translateY(16px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                slideDown: {
                    from: { opacity: "0", transform: "translateY(-16px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                pulse: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                shimmer: {
                    from: { backgroundPosition: "-200% 0" },
                    to: { backgroundPosition: "200% 0" },
                },
            },
            animation: {
                breathing:  "breathing 4s ease-in-out infinite",
                slideUp:    "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                slideDown:  "slideDown 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                fadeIn:     "fadeIn 400ms ease-out",
                float:      "float 4s ease-in-out infinite",
                shimmer:    "shimmer 2s linear infinite",
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms")({
            strategy: "class",
        }),
    ],
}