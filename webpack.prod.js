const path = require('path');
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    output: {
        path: path.resolve(__dirname, './dist/prod'),
        filename: 'bundle.js',
    }
});