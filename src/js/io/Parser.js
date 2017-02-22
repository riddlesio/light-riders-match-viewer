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

    players.winner = '1';

    return {
        players,
    };
}

function parseStates(matchData, settings) {

    const { states } = matchData;
    // const { players } = settings;
    const parsedStates = [];
    // const winner = matchData.players.winner;

    states.forEach(function (state) {
        const previousParsedState = parsedStates.length > 0
            ? parsedStates[parsedStates.length - 1]
            : null;

        parsedStates.push(parseState({ settings, state, previousParsedState }));
    });

    const errors = parseErrors(parsedStates);
    const { width, height } = settings.field;
    const fieldSize = width > height ? width : height;
    let substateCount;

    if (fieldSize <= 25) {
        substateCount = 25 / fieldSize * 8;
    } else if (fieldSize > 25 && fieldSize <= 50) {
        substateCount = 50 / fieldSize * 4;
    } else if (fieldSize > 100 && fieldSize <= 100) {
        substateCount = 100 / fieldSize * 2;
    } else if (fieldSize > 200 && fieldSize <= 200) {
        substateCount = 200 / fieldSize;
    } else {
        substateCount = 0;
    }

    substateCount = Math.floor(substateCount);

    const tweenStates = [];

    parsedStates.forEach(function (state, stateIndex) {
        if (state.round <= 0) {
            tweenStates.push(state);
            return;
        }

        for (let index = 1; index <= substateCount; index++) {
            const subState = { ...state, isSubState: true };

            subState.playerStates = subState.playerStates.map(function (playerState, pIndex) {

                const { lines }         = playerState;
                const lastLine          = lines[lines.length - 1];
                const increment         = 1 / (substateCount + 1);
                const isSubStateCrashed = playerState.isCrashed &&
                    parsedStates[stateIndex].playerStates[pIndex].isCrashed;
                let { x1, x2, y1, y2 }  = lastLine;

                if (x1 < x2) {
                    x2 = x2 - 1 + (index * increment);
                }
                else if (x2 < x1) {
                    x2 = x2 + 1 - (index * increment);
                }
                else if (y1 < y2) {
                    y2 = y2 - 1 + (index * increment);
                }
                else if (y1 > y2) {
                    y2 = y2 + 1 - (index * increment);
                }

                const newLines = lines.slice(0, -1);
                newLines.push({ x1, x2, y1, y2 });

                return { ...playerState, lines: newLines, isCrashed: isSubStateCrashed };
            });

            tweenStates.push(subState);
        }

        tweenStates.push(state);
    });

    const lastState = tweenStates[tweenStates.length - 1];
    const finalState = {
        ...lastState,
        round: lastState.round + 1,
        isSubState: true,
    };
    const withAdditionalStates = tweenStates.concat(new Array(substateCount).fill(finalState));
    const limitedStates = limitCoordinates(withAdditionalStates, width, height);
    return {
        errors,
        states: limitedStates,
        winner: matchData.players.winner,
    };
}

function parseState({ settings, state, previousParsedState }) {

    const playerNames = settings.players.map(p => p.name);

    const playerStates = playerNames.map(function (name, index) {

        const playerState = state.players[index];
        const isCrashed = playerState.isCrashed;
        const hasError = playerState.hasError;
        const thisPosition = playerState.position
            .split(',')
            .map(coord => parseInt(coord));

        let lines;
        if (!previousParsedState) {
            lines = [{
                x1: thisPosition[0],
                y1: thisPosition[1],
                x2: thisPosition[0],
                y2: thisPosition[1],
            }];
        } else {
            const previousLines = previousParsedState.playerStates[index].lines;
            const lastLine = previousLines[previousLines.length - 1];

            lines = previousLines.map(function(line) {
                return { ...line };
            });
            lines.push({
                x1: lastLine.x2,
                y1: lastLine.y2,
                x2: thisPosition[0],
                y2: thisPosition[1],
            })
        }

        return { name, lines, isCrashed, hasError };
    });

    return { playerStates, round: state.round };
}

function parseErrors(parsedStates) {

    const errors = [];

    parsedStates.forEach(function (state) {
        state.playerStates.forEach(function (playerState) {
            if (playerState.hasError) {
                const lastLine = playerState.lines[playerState.lines.length - 1];

                errors.push({
                    round: state.round,
                    x: lastLine.x2,
                    y: lastLine.y2,
                })
            }
        });
    });

    return errors;
}

function limitCoordinates(states, width, height) {
    return states.map(function (state) {
        return {
            ...state,
            playerStates: state.playerStates
                .map(function (playerState) {
                    return {
                        ...playerState,
                        lines: playerState.lines
                            .map(function (line) {
                                return {
                                    x1: limitCoordinate(line.x1, width),
                                    x2: limitCoordinate(line.x2, width),
                                    y1: limitCoordinate(line.y1, height),
                                    y2: limitCoordinate(line.y2, height),
                                };
                            })
                    }
                })
        };
    });
}

function limitCoordinate(coordinate, limit) {
    return Math.min(limit - 0.5, Math.max(-0.5, coordinate));
}

export {
    parseSettings,
    parseStates,
    parsePlayerNames,
};
