const path = require('path');

module.exports = (env, args) => {
    const isProduction = args.mode === 'production';

    console.log(`--- WEBPACK ---  Mode: ${args.mode}`);

    return {
        mode: isProduction ? 'production' : 'development',
        entry: "./src/app.ts",
        cache: true,
        target: "node",
        output: {
            filename: "bundle.js",
            path: path.join(__dirname, 'dist'),
            clean: true
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/i,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                    type: "asset",
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        devtool: isProduction ? false : 'eval-cheap-module-source-map',
    }
};
