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

    const states = matchData.states;
    const parsedStates = states.map(state => parseState({ settings, state }));
    const { width, height } = settings.field;
    const fieldSize = width > height ? width : height;
    let stateCount;

    if (fieldSize <= 25) {
        stateCount = 25 / fieldSize * 8;
    } else if (fieldSize > 25 && fieldSize <= 50) {
        stateCount = 50 / fieldSize * 4;
    } else if (fieldSize > 100 && fieldSize <= 100) {
        stateCount = 100 / fieldSize * 2;
    } else if (fieldSize > 200 && fieldSize <= 200) {
        stateCount = 200 / fieldSize;
    } else {
        stateCount = 1;
    }

    const tweenStates = parsedStates.map((state) => {

        const array = Array.from({ length: stateCount });

        return array.map((item, index) => {

            return state.map((player) => {
                const { name, lines } = player;
                const latestLine = lines[lines.length - 1];
                let { x1, x2, y1, y2 } = latestLine;
                let increment;

                if (x1 < x2) {
                    increment = 1 / stateCount;
                    x2 = x2 - 1 + (index * increment);
                }
                if (x2 < x1) {
                    increment = 1 / stateCount;
                    x2 = x2 + 1 - (index * increment);
                }
                if (y1 < y2) {
                    increment = 1 / stateCount;
                    y2 = y2 - 1 + (index * increment);
                }
                if (y1 > y2) {
                    increment = 1 / stateCount;
                    y2 = y2 + 1 - (index * increment);
                }

                const newLine = [{ x1, x2, y1, y2 }];
                const otherLines = lines.slice(0,-1);
                const newLines = otherLines.concat(newLine);

                return {
                    name,
                    lines: newLines,
                }
            });
        });
    });

    return tweenStates.reduce((a, b) => a.concat(b), []);
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
                y1: parseInt(line[1]),
                x2: parseInt(line[2]),
                y2: parseInt(line[3]),
            }));

        return {
            name,
            lines: playerState,
        };
    });
}

export {
    parseSettings,
    parseStates,
    parseState,
    parsePlayerNames,
};
