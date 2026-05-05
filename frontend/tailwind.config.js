const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
    theme: {
        extend: {
            colors: {
                "mainBackground": '#0D1117',
                "columnBackground": '#161C22'
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
});


