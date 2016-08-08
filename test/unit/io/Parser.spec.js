import chai from 'chai';
import {
    parsePlayerNames,
    parseSettings,
    parseStates,
} from '../../../src/js/io/Parser';
import data from '../../../src/js/data/dummyData.json';
import defaults from '../../../src/js/data/gameDefaults.json';

const { matchData, playerData } = data;
const { expect } = chai;

describe('parseSettings', function () {

    it('should return an object with cells, field and canvas settings', function () {
        const parsedSettings = parseSettings(matchData, defaults);

        expect(parsedSettings).to.contain.all.keys(['cells', 'field', 'canvas']);
    });
});

describe('parsePlayerNames', function () {

    it('should return settings with an array of playerNames and an array of emailHashes', function () {
        const settings = parseSettings(matchData, defaults);
        const parsedSettings = parsePlayerNames(playerData, settings);

        console.log(parsedSettings);

        expect(parsedSettings.players).to.contain.all.keys(['names', 'emailHash']);
    });
});

// describe('parseStates', function () {
//
//     it('should return', function () {
//
//     });
// });
