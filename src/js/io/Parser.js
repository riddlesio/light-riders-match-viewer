/**
 * Parses the passed data object into settings which are usable by the viewer
 * @param   {Object} data       The JSON data received from the server
 * @param   {Object} [defaults] The default settings as passed from the gameViewer
 * @returns {Object}            The settings object
 */
function parseSettings(data, defaults = {}) {
    return {
        ...defaults,
        ...data.matchData.settings
    };
}

/**
 * Parses the passed data and settings into states which can be rendered by the viewer
 * @param   {Object} data     The JSON data received from the server
 * @param   {Object} settings The parsed settings
 * @returns {Array}           List of states
 */
function parseStates(data, settings) {

    var initialState,
        states,
        field                           = settings.field;
        //{ width, height, cellmargin }   = field.cell,
        //{ margintop, marginleft }       = field.margins;
        var width = 20, height = 20, cellmargin = 0;
        var margintop = 100, marginleft = 10;
    // create initial empty board state
    initialState = _.cloneDeep(data.matchData.states[0]);
    initialState.field = initialState.field.replace(/4|8/g, '0');
    initialState.player = -1;
    initialState.move = -1;
    data.matchData.states.unshift(initialState);

    var parsedStates = [];

    var l = data.matchData.states.length;
        console.log(l);

    for (var i = 0; i < l; i++) {
        var state = data.matchData.states[i];
        var parsedState = parseState(state, settings);
        parsedStates.push(parsedState);

    }

    
    

    return states;
}

function parseState(state, settings) {
    return _.map(state, function (state) {
        var { move, column, winner, field, illegalMove, player} = state;

        if (winner) {
            if (winner != "none") {
                winner = settings.players.names[parseInt(winner.replace("player", "")) - 1];
            }
        }

        var fieldwidth = settings.field.width;

        var lines = [
           [1, 3, 2, 3, 1],
           [2, 5, 2, 3, 1],
           [3, 2, 2, 3, 1],
           [4, 16, 2, 3, 1],
           [18, 5, 2, 3, 1]
        ];

        var prevx = 0;
        var prevy = 0;

        console.log("state");

        return {
            move,
            column,
            winner,
            illegalMove,
            player,
            lines: _.chain(field)
                .map(function (cellType, index) {
                    var value = cellType;
                    var row     = Math.floor(index / fieldwidth),
                        column  = index % fieldwidth,
                        x1       = column * width + marginleft,
                        y1       = row * height + margintop,
                        x2       = column * width + marginleft+width,
                        y2       = row * height + margintop;


                    /* 1. Copy previous state lines */
                    /* 2. Find position of light cycle relative to previous position (prevx, prevy) */
                    /* 3. Draw a line */
                    /* 4. Make this not suck */ 
                    if (value == 17) {
                        var row     = Math.floor(index / fieldwidth),
                        column  = index % fieldwidth;
                        console.log(prevx + " " + column + " " + prevy + " " + row);


                        var x1       = column * width + marginleft;
                        var x2       = column * width + marginleft;

                        var y1       = row * height + margintop;
                        var y2       = row * height + margintop;

                        if (column > prevx) {
                            x2       = column * width + marginleft-width;
                        } 
                        if (column < prevx) {
                            x2       = column * width + marginleft+width;
                        } 
                        if (row > prevy) {
                            y2       = row * height + margintop-height;                              
                        } 
                        if (row < prevy) {
                            y2       = row * height + margintop+height;                              
                        }
                    }
                    if (value == 33) {
                        console.log("Lightcycle " + column + " " + row);
                        prevx = column;
                        prevy = row;
                    }
                    return { row, column, x1, y1, x2, y2, value};
                })
                .value(),
            cells: _.chain(field)
                .map(function (cellType, index) {
                    var value = cellType;
                    var row     = Math.floor(index / fieldwidth),
                        column  = index % fieldwidth,
                        x       = column * width + marginleft,
                        y       = row * height + margintop;
                    return { row, column, x, y, width, height, value};
                })
                .value()
        };
    });
    return parsedState;
}

function parsePlayerNames(data, settings) {
    return data.playerData;
}

export {
    parseSettings,
    parseStates,
    parsePlayerNames,
}