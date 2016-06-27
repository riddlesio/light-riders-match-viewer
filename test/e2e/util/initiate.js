import chai from 'chai';
import promised from 'chai-as-promised';

chai.use(promised);

const { expect } = chai;

describe('Initiate:', function () {

    this.timeout(60000);

    before(() => {
        browser.get('http://localhost:8989')
            .then(() => browser.wait(element(by.id('player')).isPresent()));
    });

    // Maximize window
    it('Maximizing window', () => {
        browser.driver.manage().window().maximize();
        expect(true).to.be.true;
    });
});
