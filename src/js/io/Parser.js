/**
 * Parses the passed data object into settings which are usable by the viewer
 * @param   {Object} data       The JSON data received from the server
 * @param   {Object} [defaults] The default settings as passed from the gameViewer
 * @returns {Object}            The settings object
 */
function parseSettings(data, defaults = {}) {

    const { matchData, playerData } = data;
    const { settings } = matchData;

    return {
        ...defaults,
        ...settings,
        players: playerData,
    };
}

function parsePlayerNames(playerData) {

    let players = {
        names: [],
        emailHash: [],
    };

    playerData.forEach((player) => {
        const name = player.name ? player.name : '';
        const hash = player.emailHash ? player.emailHash : '';

        players.names.push(name);
        players.emailHash.push(hash);
    });

    return {
        players,
    };
}

/**
 * Parses the passed data and settings into states which can be rendered by the viewer
 * @param   {Object} data     The JSON data received from the server
 * @param   {Object} settings The parsed settings
 * @returns {Array}           List of states
 */
function parseStates(matchData, settings) {

    // console.log(matchData);
    let states = matchData.states;

    // const rowCount = parseInt(settings.field.height);
    // const rowLength = parseInt(settings.field.width);
    // const arrayField = Array.from({ length: rowCount });

    // const parsedStates = states
    //     .map(state => parseState({ settings, state }))
    //     .reduce((a, b) => a.concat(b));
    //
    // console.log(parsedStates);
    const parsedStates = states.map(state => parseState({ settings, state }));

    console.log(parsedStates);

    return parsedStates;
}
/**
 *
 * @param arrayField: Array with length of amount of rows
 * @param rowLength: Length of a single row (int)
 * @param settings: The settings object with players data & field, cell and canvas sizes
 * @param state: expects an object with field (comma seperated string) and move (int)
 * @param index: index of state, same as move
 * @returns parsed states
 */
function parseState({ settings, state }) {

    const playerNames = settings.players.map(p => p.name);
    const splitStates = state.split(';');

    return playerNames.map((name) => {

        const playerState = splitStates
            .find(player => player.includes(name))
            .replace(`${name}`, '')
            .split(':')
            .map(line => line.split(','))
            .map((line) => ({
                x1: parseInt(line[0]),
                x2: parseInt(line[1]),
                y1: parseInt(line[2]),
                y2: parseInt(line[3]),
            }));

        return {
            name,
            lines: playerState,
        };
    });
}

// function parseField({ arrayField, rowLength, splitField }) {
//
//     return arrayField.map((cell, index) => {
//         const sliceStart = index * rowLength;
//         const sliceEnd = sliceStart + rowLength;
//
//         return splitField.slice(sliceStart, sliceEnd);
//     });
// }

export {
    parseSettings,
    parseStates,
    parseState,
    parsePlayerNames,
};
