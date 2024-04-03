import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default (env, argv) => {
    const isProduction = argv.mode === 'production'

    return {
        entry: './src/index.tsx',

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: isProduction,
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(sa|sc|c)ss$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: isProduction
                                        ? '[hash:base64:15]'
                                        : '[path][name]__[local]--[hash:base64:5]',
                                },
                            },
                        },
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|webp|woff2|svg?)$/,
                    type: 'asset/resource',
                },
            ],
        },

        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },

        output: {
            filename: 'main.js',
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
            }),
        ],

        devtool: 'source-map',
    }
}
