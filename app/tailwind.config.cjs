/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                evergreen: {
                    100: "#00783E",
                    80: "#4DB89E",
                    60: "#D4EEE2",
                },
                fuschia: {
                    100: "#EF5DA8",
                    80: "#F178B6",
                    60: "#FCDDEC",
                },
                iris: {
                    100: "#5D5FEF",
                    80: "#7879F1",
                    60: "#A5A6F6",
                },
                dorian: "#ECF1F4",
            },
        },
    },
    plugins: [],
};
