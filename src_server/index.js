// Import packages
const express = require('express');
const morgan = require('morgan');
// App
const app = express();
// Morgan
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(require('./routes/index.routes'));

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
const port = 8000;

const devServerEnabled = true;

if (devServerEnabled) {
    //reload=true:Enable auto reloading when changing JS files or content
    config.entry.app.unshift('webpack-hot-middleware/client?reload=false');

    //Add HMR plugin
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);

    //Enable "webpack-dev-middleware"
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));

    //Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));
}

app.use(express.static('./public'));

// Starting server
app.listen(port);