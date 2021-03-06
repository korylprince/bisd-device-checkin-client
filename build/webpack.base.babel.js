import path from "path"
import webpack from "webpack"
import VueLoaderPlugin from "vue-loader/lib/plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import WebappWebpackPlugin from "webapp-webpack-plugin"
import autoprefixer from "autoprefixer"

const root = path.resolve(__dirname, "../")

const API_BASE = process.env.API_BASE ? process.env.API_BASE : "/checkin/api/2.0"
const CHARGE_BASE = process.env.CHARGE_BASE ? process.env.CHARGE_BASE : "/charges/edit?type=id&search="

const postcssLoader = {
    loader: "postcss-loader",
    options: {
        sourceMap: true,
        plugins: [
            autoprefixer({
                browsers: ["last 2 versions"],
            }),
        ],
    },
}

const baseConfig = {
    entry: {
        app: path.resolve(root, "src/app.js"),
    },
    output: {
        path: path.resolve(root, "dist/"),
        filename: "js/[name].js",
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            "vue$": path.resolve(root, "node_modules", "vue/dist/vue.runtime.esm.js"),
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            API_BASE: JSON.stringify(API_BASE),
            CHARGE_BASE: JSON.stringify(CHARGE_BASE),
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(root, "src/index.html"),
        }),
        new WebappWebpackPlugin({
            logo: path.resolve(root, "src/img/favicon.png"),
            outputPath: "icons/",
            publicPath: "/checkin/icons/",
            prefix: "",
        }),
    ],
}

export {baseConfig, postcssLoader}
