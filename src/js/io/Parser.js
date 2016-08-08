/**
 * Parses the passed data object into settings which are usable by the viewer
 * @param   {Object} data       The JSON data received from the server
 * @param   {Object} [defaults] The default settings as passed from the gameViewer
 * @returns {Object}            The settings object
 */
function parseSettings(matchData, defaults = {}) {

    const { settings } = matchData;
    const { field } = settings;
    const canvas = defaults.canvas;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const fieldWidth = field.width;
    const fieldHeight = field.height;

    const cellHeight = canvasHeight / fieldHeight;
    const cellWidth = canvasWidth / fieldWidth;
    const cells = { height: cellHeight, width: cellWidth };

    return {
        ...defaults,
        ...settings,
        cells,
    };
}

function parsePlayerNames(playerData, settings) {

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
        ...settings,
        players,
    };
}

/**
 * Parses the passed data and settings into states which can be rendered by the viewer
 * @param   {Object} data     The JSON data received from the server
 * @param   {Object} settings The parsed settings
 * @returns {Array}           List of states
 */
function parseStates(data, settings) {

    let states = data.matchData.states;

    const firstState = states[0];

    const initialState = {
        ...firstState,
        field: firstState.field.replace(/4|8/g, '0'),
        player: -1,
        move: -1,
    };

    states.unshift(initialState);

    return states.map(parseState);
}

function parseState(states, settings) {

    return states.map((state) => {

        const { move, column, field, winner, illegalMove, player } = state;
        const fieldWidth = settings.field.width;
        const {cell} = settings.field;
        const cellWidth = cell.width;
        const cellHeight = cell.height;
        const marginLeft = 20;
        let winnerName;
        let prevX = 0;
        let prevY = 0;

        if (winner && winner !== 'none') {
            winnerName = settings.players.names[parseInt(winner.replace('player', '')) - 1];
        }

        const lines = field.map((value, index) => {

            let row = Math.floor(index / fieldWidth);
            let column = index % fieldWidth;
            let x1 = column * cellWidth + marginLeft;
            let x2 = column * cellWidth + marginLeft + cellWidth;
            let y1 = row * cellHeight + marginTop;
            let y2 = row * cellHeight + marginTop;

            /* 1. Copy previous state lines */
            /* 2. Find position of light cycle relative to previous position (prevX, prevY) */
            /* 3. Draw a line */
            /* 4. Make this not suck */
            if (value == 17) {
                const row = Math.floor(index / fieldWidth);
                const column = index % fieldWidth;

                x1 = column * cellWidth + marginLeft;
                x2 = column * cellWidth + marginLeft;

                y1 = row * cellHeight + marginTop;
                y2 = row * cellHeight + marginTop;

                if (column > prevX) {
                    x2 = column * cellWidth + marginLeft - cellWidth;
                }
                if (column < prevX) {
                    x2 = column * cellWidth + marginLeft + cellWidth;
                }
                if (row > prevY) {
                    y2 = row * cellHeight + marginTop-height;
                }
                if (row < prevY) {
                    y2 = row * cellHeight + marginTop+height;
                }
            }

            if (value == 33) {
                prevX = column;
                prevY = row;
            }

            return {
                column,
                row,
                value,
                x1,
                x2,
                y1,
                y2,
            };
        });

        const cells = field.map((value, index) => {

            const row     = Math.floor(index / fieldWidth);
            const column  = index % fieldWidth;
            const x       = column * cellWidth + marginLeft;
            const y       = row * cellHeight + marginTop;

            return {
                column,
                row,
                value,
                x,
                y,
                height: cellHeight,
                width: cellWidth,
            };
        });

        return {
            cells,
            column,
            illegalMove,
            lines,
            move,
            player,
            winner: winnerName,
        };
    });
}

export {
    parseSettings,
    parseStates,
    parseState,
    parsePlayerNames,
}
