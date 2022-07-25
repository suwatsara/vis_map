const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const url = require('url');



module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        publicPath: "/",
        filename: 'bundle.js'
    },
    devServer: {
        port: 8000,
        hot: true
    },
    resolve: {
        fallback: {
            assert: require.resolve('assert'),
            url: require.resolve('url'),
            querystring: require.resolve('querystring'),
        },

    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }

                }

            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(csv|tsv)$/,
                loader: 'csv-loader',
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            },

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/index.html')
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                MapboxAccessToken: JSON.stringify(process.env.MapboxAccessToken)
            }
        }),

    ]


};