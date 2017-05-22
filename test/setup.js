require('babel-register')({
    // This will override `node_modules` ignoring - you can alternatively pass
    // an array of strings to be explicitly matched or a regex / glob
    ignore: /node_modules\/(?!(@?riddles|koa-compose|co))/,
    presets: ['es2015-loose', 'react', 'stage-0'],
});
require('babel-polyfill');
const sinon = require('sinon');
const jsdom = require('jsdom').jsdom;

let exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};
