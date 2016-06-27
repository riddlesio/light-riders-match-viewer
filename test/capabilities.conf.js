'use strict';

// Browsers for all os
const browserBase = [
    { browserName: 'Firefox', browser_version: '44' },
    { browserName: 'Firefox', browser_version: '45' },
    { browserName: 'Firefox', browser_version: '46' },
    { browserName: 'Chrome', browser_version: '47' },
    { browserName: 'Chrome', browser_version: '48' },
    { browserName: 'Chrome', browser_version: '49' },
];

// Specific browsers for os
const win10Special = [
    { browserName: 'IE', browser_version: '11' },
    { browserName: 'Edge', browser_version: '12' },
    { browserName: 'Edge', browser_version: '13' },
];
const win8Special = [
    { browserName: 'IE', browser_version: '11' },
];
const osxElSpecial = [{ browserName: 'Safari', browser_version: '9' }];
const osxYosSpecial = [{ browserName: 'Safari', browser_version: '8' }];
const osxMavSpecial = [{ browserName: 'Safari', browser_version: '7' }];

// List of browsers per os
const win10Browsers = browserBase.concat(win10Special);
const win8Browsers = browserBase.concat(win8Special);
const win7Browsers = browserBase.concat(win8Special);
const osxElBrowsers = browserBase.concat(osxElSpecial);
const osxYosBrowsers = browserBase.concat(osxYosSpecial);
const osxMavBrowsers = browserBase.concat(osxMavSpecial);

// Conf per os
const win10 = win10Browsers.map((browser) =>
    Object.assign({ os: 'WINDOWS', os_version: '10' }, browser));
const win8 = win8Browsers.map((browser) =>
    Object.assign({ os: 'WINDOWS', os_version: '8.1' }, browser));
const win7 = win7Browsers.map((browser) =>
    Object.assign({ os: 'WINDOWS', os_version: '7' }, browser));
const osxEl = osxElBrowsers.map((browser) =>
    Object.assign({ os: 'OS X', os_version: 'El Captain' }, browser));
const osxYos = osxYosBrowsers.map((browser) =>
    Object.assign({ os: 'OS X', os_version: 'Yosemite' }, browser));
const osxMav = osxMavBrowsers.map((browser) =>
    Object.assign({ os: 'OS X', os_version: 'Mavericks' }, browser));

// All browser configs for all OS
const allBrowsers = [].concat(win10, win8, win7, osxEl, osxYos, osxMav);

// Assign base to each browser config
const capabilities = allBrowsers.map((brows) => {
    return {
        'browserstack.user': 'joeywisse1',
        'browserstack.key': 'PA5oJ217D9Gy7qbJax8s',
        'browserstack.local': true,
        'browserstack.debug': true,
        resolution: '1280x1024',
        browserName: brows.browserName,
        browser_version: brows.browser_version,
        os: brows.os,
        os_version: brows.os_version,
    };
});

console.log(capabilities.length);

module.exports = capabilities;
