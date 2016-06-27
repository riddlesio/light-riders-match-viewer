require('babel-core/register');
const capabilities = require('./test/capabilities.conf.js');

exports.config = {
    multiCapabilities: capabilities,
    maxSessions: 1,
    seleniumAddress: 'http://hub.browserstack.com/wd/hub',
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['test/e2e/index.spec.js'],
    baseUrl: 'http://starapple.riddles.io:8080',
    framework: 'mocha',
    getPageTimeout: 10000,
    allScriptsTimeout: 60000,
    onPrepare: function () {
        browser.ignoreSynchronization = true;
    },
};
