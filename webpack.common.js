const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: './src/index.js',        
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new cleanWebpackPlugin(),  // 清除掉 /dist 檔案的資料，在每次包版的時候
        new HtmlWebpackPlugin({
            title: '9 x 9 乘法表',
            filename: 'index.html',  // 輸出後的路徑
            template: 'src/index.html'  // 被編譯的模板
        })
    ],
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    }
}