/**
 * Parses the passed data object into settings which are usable by the viewer
 * @param   {Object} data       The JSON data received from the server
 * @param   {Object} [defaults] The default settings as passed from the gameViewer
 * @returns {Object}            The settings object
 */
function parseSettings(data, defaults = {}) {

    const { matchData, playerData } = data;
    const { settings } = matchData;
    const { field } = settings;
    const canvas = defaults.canvas;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const fieldWidth = field.width;
    const fieldHeight = field.height;

    const gridWidth = canvasWidth - canvas.marginLeft - canvas.marginRight;
    const gridHeight = canvasHeight - canvas.marginTop - canvas.marginBottom;

    const cellHeight = gridHeight / fieldHeight;
    const cellWidth = gridWidth / fieldWidth;
    const cellDimensions = cellWidth > cellHeight ? cellHeight : cellWidth;
    const cells = { height: cellDimensions, width: cellDimensions };

    const grid = { width: cellDimensions * fieldWidth, height: cellDimensions * fieldHeight };
    const minimalistic = cellDimensions < 15;

    let parsedSettings = {
        ...defaults,
        ...settings,
        cells,
        grid,
        minimalistic,
    };

    // TODO: Remove player array
    const players = [
        {
            name: 'Ron',
        },
        {
            name: 'JackieChan',
        },
        {
            name: 'PeterPetrelli',
        },
        {
            name: 'JohnLegend',
        },
    ];

    // TODO: Map on playerData
    parsedSettings.players = players.map(getPlayerPositionsCalculator(parsedSettings));

    return parsedSettings;
}

function getPlayerPositionsCalculator(settings) {

    return function calculatePlayerPosition(player, index) {

        const controlsHeight = 40;
        const avatarDimension = 60;

        const gridWidth = settings.grid.width;
        const halfGridWidth = gridWidth / 2;
        const halfCanvasWidth = settings.canvas.width / 2;
        const horizontalMargin = halfCanvasWidth - halfGridWidth;

        const gridHeight = settings.grid.height;
        const halfGridHeight = gridHeight / 2;
        const halfCanvasHeight = (settings.canvas.height - controlsHeight) / 2;
        const verticalMargin = halfCanvasHeight - halfGridHeight;

        let avatarX;
        let avatarY;
        let textX;
        let textY;

        if (index === 0) {
            avatarX = horizontalMargin - avatarDimension - 10;
            avatarY = verticalMargin - 30;
            textX = avatarX + avatarDimension + 10;
            textY = avatarY + 20;
        }
        if (index === 1) {
            avatarX = gridWidth + horizontalMargin + 10;
            avatarY = verticalMargin - 30;
            textX = avatarX - 10;
            textY = avatarY + 20;
        }
        if (index === 2) {
            avatarX = horizontalMargin - avatarDimension - 10;
            avatarY = gridHeight + verticalMargin - (avatarDimension / 2);
            textX = avatarX + avatarDimension + 10;
            textY = avatarY + avatarDimension - 5;
        }
        if (index === 3) {
            avatarX = gridWidth + horizontalMargin + 10;
            avatarY = gridHeight + verticalMargin - (avatarDimension / 2);
            textX = avatarX - 10;
            textY = avatarY + avatarDimension - 5;
        }

        return {
            ...player,
            avatar: {
                x: avatarX,
                y: avatarY,
            },
            text: {
                x: textX,
                y: textY,
            },
        };
    }
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

    let states = matchData.states;
    const rowCount = parseInt(settings.field.height);
    const rowLength = parseInt(settings.field.width);
    const firstState = states[0];
    const arrayField = Array.from({ length: rowCount });

    const initialState = {
        ...firstState,
        // field: firstState.field.replace(/4|8/g, '0'),
        move: -1,
    };

    states.unshift(initialState);

    return states.map((state, index) => (
        parseState({ arrayField, index, rowLength, settings, state })
    ));
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
function parseState({ arrayField, index, rowLength, settings, state }) {

    const winner = 'TODO';
    const splitField = state.field.split(',');
    const field = parseField({ arrayField, rowLength, splitField });

    return {
        field,
        winner,
    };
}

function parseField({ arrayField, rowLength, splitField }) {

    return arrayField.map((cell, index) => {
        const sliceStart = index * rowLength;
        const sliceEnd = sliceStart + rowLength;

        return splitField.slice(sliceStart, sliceEnd);
    });
}

    // END OF MY STUFF

    // const fieldWidth = settings.field.width;
    // const cell = settings.cells;
    // const cellWidth = cell.width;
    // const cellHeight = cell.height;
    //
    // const marginLeft = 20;
    // let winnerName;
    // let prevX = 0;
    // let prevY = 0;
    //
    // if (winner && winner !== 'none') {
    //     winnerName = settings.players.names[parseInt(winner.replace('player', '')) - 1];
    // }
    //
    // const lines = field.map((value, index) => {
    //
    //     let row = Math.floor(index / fieldWidth);
    //     let column = index % fieldWidth;
    //     let x1 = column * cellWidth + marginLeft;
    //     let x2 = column * cellWidth + marginLeft + cellWidth;
    //     let y1 = row * cellHeight + marginTop;
    //     let y2 = row * cellHeight + marginTop;
    //
    //     /* 1. Copy previous state lines */
    //     /* 2. Find position of light cycle relative to previous position (prevX, prevY) */
    //     /* 3. Draw a line */
    //     /* 4. Make this not suck */
    //     if (value == 17) {
    //         const row = Math.floor(index / fieldWidth);
    //         const column = index % fieldWidth;
    //
    //         x1 = column * cellWidth + marginLeft;
    //         x2 = column * cellWidth + marginLeft;
    //
    //         y1 = row * cellHeight + marginTop;
    //         y2 = row * cellHeight + marginTop;
    //
    //         if (column > prevX) {
    //             x2 = column * cellWidth + marginLeft - cellWidth;
    //         }
    //         if (column < prevX) {
    //             x2 = column * cellWidth + marginLeft + cellWidth;
    //         }
    //         if (row > prevY) {
    //             y2 = row * cellHeight + marginTop-height;
    //         }
    //         if (row < prevY) {
    //             y2 = row * cellHeight + marginTop+height;
    //         }
    //     }
    //
    //     if (value == 33) {
    //         prevX = column;
    //         prevY = row;
    //     }
    //
    //     return {
    //         column,
    //         row,
    //         value,
    //         x1,
    //         x2,
    //         y1,
    //         y2,
    //     };
    // });
    //
    // const cells = field.map((value, index) => {
    //
    //     const row     = Math.floor(index / fieldWidth);
    //     const column  = index % fieldWidth;
    //     const x       = column * cellWidth + marginLeft;
    //     const y       = row * cellHeight + marginTop;
    //
    //     return {
    //         column,
    //         row,
    //         value,
    //         x,
    //         y,
    //         height: cellHeight,
    //         width: cellWidth,
    //     };
    // });
    //
    // return {
    //     cells,
    //     column,
    //     illegalMove,
    //     lines,
    //     move,
    //     player,
    //     winner: winnerName,
    // };

export {
    parseSettings,
    parseStates,
    parseState,
    parsePlayerNames,
};
