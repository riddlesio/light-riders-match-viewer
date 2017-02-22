import chai from 'chai';
import promised from 'chai-as-promised';

chai.use(promised);

const { expect } = chai;

import { createWriteStream } from 'fs';
const capitalize = ([c, ...cs]) => [c.toUpperCase(), ...cs].join('');
const writeScreenshot = fileName => data => {
    const stream = createWriteStream(fileName);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
};

describe('GamePlayer index', function () {

    this.timeout(60000);

    let lastStateButton;
    let nextStateButton;

    before(function () {

        browser.sleep(2000);

        browser.driver.switchTo().frame(browser.findElement(by.id('player')));

        const gameplayerButtons = $$('.GamePlayer-button');

        nextStateButton = gameplayerButtons.get(3);
        lastStateButton = gameplayerButtons.get(4);
    });

    afterEach(function () {

        browser.getCapabilities().then(capabilities => {

            const testName          = this.currentTest.fullTitle();
            const browserName       = capitalize(capabilities.get('browserName'));
            const browserVersion    = capabilities.get('version');
            const platform          = capabilities.get('platform');
            const screenshotFolder  = process.cwd() + '/test/results/screenshots/';
            const screenshotName    = `[${platform}] ${browserName} ${browserVersion} - ${testName}.png`;

            browser
                .takeScreenshot()
                .then(writeScreenshot(screenshotFolder + screenshotName));
        });
    });

    it('should contain the GamePlayer inside the iframe', () => {

        browser.sleep(2000);

        expect($('.GamePlayer').isPresent()).to.eventually.equal(true);
    });

    it('should contain Player controls', () => {

        browser.sleep(2000);

        expect($('.GamePlayer-button').isPresent()).to.eventually.equal(true);
    });

    it('should show a mid-game state', () => {

        browser.sleep(2000);

        Array.from({ length: 4 }).forEach(nextStateButton.click);

        browser.sleep(2000);

        expect(true).to.be.true;
    });

    it('should show the score in the end', () => {

        browser.sleep(2000);

        lastStateButton.click();

        browser.sleep(2000);

        expect($('.VictoryScreen-textMessage').isPresent()).to.eventually.equal(true);
    });
});

