import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                furniture: {
                    bronze: "#8B6914",
                    cream: "#F5F0E8",
                    dark: "#1A1A1A",
                    muted: "#F9F9F9",
                    border: "#E5E5E5"
                }
            },
        },
    },
    plugins: [],
};
export default config;
