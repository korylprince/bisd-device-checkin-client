import path from "path";
import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import FaviconsWebpackPlugin from "favicons-webpack-plugin";

var cssExtractPlugin = new ExtractTextPlugin("style/[name].css");

var root = path.resolve(__dirname, "../");

var API_BASE = process.env.API_BASE ? process.env.API_BASE : "http://localhost/api/1.0";
var CHARGE_BASE = process.env.CHARGE_BASE ? process.env.CHARGE_BASE : "/charges/edit?type=id&search=";

export default {
    entry: {
        app: path.resolve(root, "src/app.js")
    },
    output: {
        path: path.resolve(root, "dist/"),
        filename: "js/[name].js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        css: cssExtractPlugin.extract({
                            fallback: {loader: "style-loader", options: {sourceMap: true}},
                            use: [
                                {loader: "css-loader", options: {importLoaders: 1, sourceMap: true}},
                                {loader: "postcss-loader", options: {sourceMap: true}}
                            ]
                        }),
                        stylus: cssExtractPlugin.extract({
                            fallback: {loader: "style-loader", options: {sourceMap: true}},
                            use: [
                                {loader: "css-loader", options: {importLoaders: 2, sourceMap: true}},
                                {loader: "postcss-loader", options: {sourceMap: true}},
                                {loader: "stylus-loader", options: {sourceMap: true}}
                            ]
                        })
                    }
                }
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [
                        ["es2015", {modules: false}]
                    ]
                }
            },
            {
                test: /\.css$/,
                use: cssExtractPlugin.extract({
                    fallback: {loader: "style-loader", options: {sourceMap: true}},
                    use: [
                        {loader: "css-loader", options: {importLoaders: 1, sourceMap: true}},
                        {loader: "postcss-loader", options: {sourceMap: true}}
                    ]
                })
            },
            {
                test: /\.styl$/,
                use: cssExtractPlugin.extract({
                    fallback: {loader: "style-loader", options: {sourceMap: true}},
                    use: [
                        {loader: "css-loader", options: {importLoaders: 2, sourceMap: true}},
                        {loader: "postcss-loader", options: {sourceMap: true}},
                        {loader: "stylus-loader", options: {sourceMap: true}}
                    ]
                })
            }
        ]
    },
    resolve: {
        alias: {
            "vue$": path.resolve(root, "node_modules", "vue/dist/vue.esm.js")
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            API_BASE: JSON.stringify(API_BASE),
            CHARGE_BASE: JSON.stringify(process.env.CHARGE_BASE)
        }),
        new HtmlWebpackPlugin({
            title: "BISD Chromebook Check-in",
            template: path.resolve(root, "src/index.html")
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(root, "src/img/favicon.png"),
            prefix: "icons/",
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: false,
                opengraph: false,
                twitter: false,
                yandex: false,
                windows: false
            }
        }),
        cssExtractPlugin
    ]
};
