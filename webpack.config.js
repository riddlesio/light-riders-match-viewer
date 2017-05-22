const path = require('path');
const webpack = require('webpack');

module.exports = function (config) {

    const environment   = config.environment;
    const target        = environment.target;
    const platform      = environment.platform;
    const debug         = environment.debug;
    const variables     = `?${target}&${platform}${(debug ? '&DEBUG' : '')}`;

    var webpackConfig = {
        resolve: {
            fallback: path.join(__dirname, '../node_modules'),
        },
        resolveLoader: {
            root: path.join(__dirname, '/node_modules'),
        },
        module: {
            preLoaders: [
                {
                    loader: 'preprocess' + variables,
                    exclude: /node_modules\/(?!@?riddles)/,
                },
            ],
            loaders: [
                {
                    test: /.js(x)?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules\/(?!(@?riddles|koa-compose|co))/,
                    query: {
                        cacheDirectory: true,
                        presets: ['react', 'es2015', 'stage-0'],
                    },
                },
                {
                    test: /\.json$/,
                    loader: 'json',
                },
            ],

            // fixes npm install problem (https://github.com/isagalaev/highlight.js/issues/895)
            noParse: [/autoit\.js$/],
        },
        plugins: [

            // Deduplication plugin
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                comments: false,
                compress: {
                    warnings: false,
                },
            }),
        ],
    };

    if (target === 'PROD') {
        webpackConfig.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: "'production'",
                },
            })
        );
    }

    if (debug) {
        // Gives you sourcemaps without slowing down rebundling
        webpackConfig.devtool = 'eval-source-map';
    }

    return webpackConfig;
};
