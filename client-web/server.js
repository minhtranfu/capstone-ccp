'use strict';

const config = require('./config/config');
const NodeService = require('./src/services/common/node-service');
const path = require('path');

const { example } = config;
if (!example) throw new Error('configuration cannot be null/undefined');

const PORT = example.port;

if (NodeService.isProduction()) {
    const express = require('express');

    const app = express();

    // Configure static resources
    app.use(
        express.static(
            path.join(__dirname, '/dist')
        )
    );

    // Configure server-side routing
    app.get('*', (req, res) => {
        const dist = path.join(
            __dirname, '/dist/index.html'
        );
        res.sendFile(dist);
    });
    app.use('/public', express.static('public'));

    // Open socket
    app.listen(PORT, () => {
        console.log(`Started Express server on port ${PORT}`);
    });
} else {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const config = require('./webpack.config.js');

    new WebpackDevServer(webpack(config), {
        hot               : true,
        historyApiFallback: true,
        // contentBase       : path.join(__dirname, "/public"),
        open: true,
    }).listen(PORT, 'localhost', error => {
        console.log(error || `Started WebpackDevServer on port ${PORT}`);
    });
}
