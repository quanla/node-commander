var path = require("path");
var webpack = require("webpack");

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
                include: [path.join(__dirname, "src")],
                query: {
                    // cacheDirectory: true,
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
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "venue-common",
        //     // (the commons chunk name)
        //
        //     filename: "venue-common.js",
        //     // (the filename of the commons chunk)
        //
        //     // minChunks: 3,
        //     // (Modules must be shared between 3 entries)
        //
        //     // chunks: ["pageA", "pageB"],
        //     // (Only use these entries)
        // })
    ]
};
