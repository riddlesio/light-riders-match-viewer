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
var width = 1, height = 1, cellmargin = 1;
var margintop = 100, marginleft = 10;
    // create initial empty board state
    initialState = _.cloneDeep(data.matchData.states[0]);
    initialState.field = initialState.field.replace(/4|8/g, '0');
    initialState.player = -1;
    initialState.move = -1;
    data.matchData.states.unshift(initialState);

    return _.map(data.matchData.states, function (state) {
        var { move, column, winner, field, illegalMove, player} = state;

        if (winner) {
            if (winner != "none") {
                winner = settings.players.names[parseInt(winner.replace("player", "")) - 1];
            }
        }

        var fieldwidth = settings.field.width;
        return {
            move,
            column,
            winner,
            illegalMove,
            player,
            cells: _.chain(field)
                .thru((string) => string.split(/,|;/))
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

    return states;
}

function parsePlayerNames(data, settings) {
    return data.playerData;
}

export {
    parseSettings,
    parseStates,
    parsePlayerNames,
}