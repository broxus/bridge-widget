import HtmlWebpackPlugin from 'html-webpack-plugin'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { getCommonConfig } from './webpack.config.common.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default (env, argv) => {
    const isProduction = argv.mode === 'production'

    return {
        ...getCommonConfig(isProduction),

        entry: {
            'main': './src/index.tsx',
        },

        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },

        mode: isProduction ? 'production' : 'development',

        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: process.env.PORT ?? 3000,
            hot: false,
            client: false,
            historyApiFallback: true,
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                minify: true,
                chunks: ['main'],
                filename: 'index.html',
            }),
        ],

        devtool: 'source-map',
    }
}
