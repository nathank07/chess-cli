const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;

const pages = ['game', 'login', 'register']
let js = {}
let html = []
pages.forEach(page => {
    js[`${page}`] = `./src/${page}/main.js`
    html.push(new HtmlWebpackPlugin({
        filename: `${page}.html`,
        template: path.join(__dirname, `./src/${page}/${page}.html`),
        chunks: [`${page}`]
    }))
});

const config = {
    entry: js,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'assets/js/[name].js',
        assetModuleFilename: 'assets/[type][ext]'
    },
    plugins: [
        ...html,
        new HtmlWebpackPlugin({
            filename: `index.html`,
            template: path.join(__dirname, `./src/home/index.html`),
            chunks: [`home/home`]
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].css'
        }),
        new CleanWebpackPlugin(),
        new FaviconsWebpackPlugin('./src/chess/cburnett/wQ.svg')
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[hash][ext]'
                }
            },
            {
                test: /\.(ogg|mp3|wav)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/sounds/[hash][ext]'
                }
            },
            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};
