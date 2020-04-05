const { resolve } = require('path')

module.exports = function (env, args) {

    const mode = args.mode || 'production'
    return {
        mode: mode,
        devtool: 'source-map',
        target: 'web',
        entry: './src/index.tsx',
        output: {
            filename: 'index.js',
            path: resolve('./dist')
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                plugins: [
                                    '@babel/plugin-proposal-class-properties'
                                ],
                                presets: [
                                    '@babel/preset-react'
                                ]
                            }
                        },
                        'ts-loader'
                    ]
                },
                // {
                //     test: /\.json$/,
                //     loader: 'json-loader'
                // }
            ],
        },
        resolve: {
            extensions: [
                '.js', '.jsx', '.ts', '.tsx'
            ]
        },
        devServer: {
            port: 3300,
            contentBase: './dist'
        },
        externals: [
            'translate'
        ]
    }
}