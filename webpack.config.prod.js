const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: 'production',    
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',  // 透過 import 圖片進 entry point ，（為了將圖片複製到部署的資料夾，這邊目前沒設定壓縮
                        options: {
                            name: './images/[name].[ext]'
                        }
                    }                    
                ]
            },
            {
                test: /\.html$/,            
                use: [
                    // 'file-loader',
                    // 'extract-loader',
                    {
                        loader: 'html-loader',  // 這邊使用 html-loader 去處理.html檔的img路徑
                        options: {
                            attrs: ['img:src'],   // 可以設定 tag name : atrribute                                                      
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader/url',  // creates style nodes from JS strings (link style)
                        // loader: 'style-loader'   // creates style nodes from JS strings (inline style)
                    },                                        
                    {
                        loader: 'file-loader',
                        options: {
                            name: './css/[name].css'
                        }
                    },
                    // 'css-loader',  // translates CSS into CommonJS
                    'sass-loader'  // 將 sass 解譯成 css，預設使用 node-sass
                    // 順序是有關係的，越下面的越先開始執行
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                }
            }                        
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true    // uglify 會把source map 拿掉，要source map 的話，要再設定
            })
        ],
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})