const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const terserJSPlugin = require('terser-webpack-plugin');
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const htmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

var config = {
    entry: './app-src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /.\/node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: miniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/css/'
                        }
                    },
                    'css-loader'
                ]
            },
            { 
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
            },
            { 
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            { 
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'file-loader' 
            },
            { 
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml' 
            }
        ]
    },
    plugins: [
        new htmlWebPackPlugin({
            hash: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                removeComments: true
            },
            filename: 'index.html',
            template: __dirname + '/main.html'
        }),
        new miniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new webpack.ProvidePlugin({
            '$': 'jquery/dist/jquery.js',
            'jQuery': 'jquery/dist/jquery.js'
        })
    ],
    optimization: {
        minimizer: [],
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/](jquery|bootstrap|reflect-metadata)[\\/](.(?!.*\.css$))*$/,
                    name: 'vendors',
                    chunks: 'all',
                    filename: 'vendors.bundle.js'
                }
            }
        }
    },
}

module.exports = (env, argv) => {

    config.mode = argv.mode;

    let SERVICE_URL = JSON.stringify('http://localhost:3000');

    if (argv.mode === 'development') {
        
    }
    
    if (argv.mode === 'production') {
        config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
        
        SERVICE_URL = jSON.stringify('http://your-api-address');

        config.optimization.minimizer.push(new terserJSPlugin({}));
        config.optimization.minimizer.push(new optimizeCSSAssetsPlugin({}));
    }

    config.plugins.push(new webpack.DefinePlugin({ SERVICE_URL }));

    return config;
}