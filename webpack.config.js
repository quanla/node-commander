var path = require("path");
// var webpack = require("webpack");

module.exports = {
    cache: true,
    // devtool: "eval",
    entry: {
        "main": "./src/client/app-loader.jsx"
    },
    output: {
        path: path.join( __dirname, "dist/js" ),
        filename: "[name].js",
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [path.join(__dirname, "react")],
                query: {
                    cacheDirectory: true,
                    presets: ["latest", "stage-0", "react"]
                }
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    },
    resolve: {
        // root: __dirname + "/src/js",
        extensions: ['.js', '.jsx']
    },
    plugins: [
    ]
};