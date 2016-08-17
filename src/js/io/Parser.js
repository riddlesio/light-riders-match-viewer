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

    const subbedStates = states.map(state => createSubStates({ settings, state }));

    console.log(subbedStates);

    return subbedStates;
}

function createSubStates({ settings, state }) {

    const lines = state.state.split(':');
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
    parsePlayerNames,
};
