const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production" || "development",
    entry: {
        background: path.resolve(__dirname, "..", "src", "background.ts"),
        content: path.resolve(__dirname, "..", "src", "content.ts"),
<<<<<<< HEAD
        popup: path.resolve(__dirname, "..", "public", "popup.ts"),
=======
        popup: path.resolve(__dirname, "..", "src", "popup.ts"),
>>>>>>> 4671e0a5896fd6d845973af3332aa68e2c734520
    },
    output: {
        path: path.resolve(__dirname, "..", "dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{from: ".", to: ".", context: "public"}]
        }),
    ],
};
