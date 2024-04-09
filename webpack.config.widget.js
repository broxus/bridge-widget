import path, { dirname } from 'path'
import semver from 'semver'
import { fileURLToPath } from 'url'
import packageJSON from './package.json' assert { type: 'json' }
import { getCommonConfig } from './webpack.config.common.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default (env, argv) => {
    const isProduction = argv.mode === 'production'
    const version = semver.parse(packageJSON.version)

    return {
        ...getCommonConfig(isProduction),

        entry: './src/widget.tsx',

        output: {
            library: 'VenomBridgeWidget',
            libraryTarget: 'umd',
            libraryExport: 'default',
            path: path.resolve(__dirname, 'widget', `${version.major}.${version.minor}.${version.patch}`),
            filename: `widget${isProduction ? '.min' : ''}.js`,
            clean: true,
        },
    }
}
