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
    console.log(matchData);
    let states = matchData.states;
    // const rowCount = parseInt(settings.field.height);
    // const rowLength = parseInt(settings.field.width);
    // const arrayField = Array.from({ length: rowCount });

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
    const playerStates = playerNames.map((name) => {

        const playerState = splitStates
            .find(player => player.includes(name))
            .replace(`${name}`, '')
            .split(':')
            .map(line => line.split(','));

        const playerLines = playerState.map((line) => {
            const x1 = parseInt(line[0]);
            const y1 = parseInt(line[1]);
            const x2 = parseInt(line[2]);
            const y2 = parseInt(line[3]);

            const horizontal = x2 !== x1;
            const vertical = y2 !== y1;
            let direction;
            let scale;

            if (horizontal) {
                if (x1 < x2) {
                    direction = 'right';
                    scale = x2 - x1;
                }
                if (x1 > x2) {
                    direction = 'left';
                    scale = x1 - x2;
                }
            }

            if (vertical) {
                if (y1 < y2) {
                    direction = 'down';
                    scale = y2 - y1;
                }
                if (y1 > y2) {
                    direction = 'up';
                    scale = y1 - y2;
                }
            }

            return {
                direction,
                scale,
                x: x1,
                y: y1,
            };
        });

        return {
            name,
            lines: playerLines,
        }
    });

    return playerStates;
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
