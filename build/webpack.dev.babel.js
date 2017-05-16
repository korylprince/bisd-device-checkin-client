import webpack from "webpack";
import merge from "webpack-merge";

import baseConfig from "./webpack.base.babel.js";

var devConfig = {
    stats: {children: false},
    devtool: "#cheap-module-inline-source-map",
    plugins: [
        new webpack.EnvironmentPlugin({
            DEBUG: true
        })
    ]
};

export default merge(baseConfig, devConfig);
