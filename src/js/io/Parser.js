import _ from 'lodash';

function parseSettings(data, defaults = {}) {

    const { matchData, playerData } = data;
    const { settings } = matchData;

    return {
        ...defaults,
        ...settings,
        players: playerData,
    };
}

function parseStates(matchData, settings) {

    const { states, winner } = matchData;
    const parsedStates = [];

    states.forEach(state => {
        const previousParsedState = parsedStates.length > 0
            ? parsedStates[parsedStates.length - 1]
            : null;
        const parsedState = parseState({ settings, state, previousParsedState });

        addSwitchDeathLimit(parsedState, previousParsedState);

        parsedStates.push(parsedState);
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
    parsedStates.forEach((state, stateIndex) => {
        if (state.round <= 0) {
            tweenStates.push(state);
            return;
        }

        for (let index = 1; index <= substateCount; index++) {
            const subState = { ...state, isSubState: true };

            subState.playerStates = subState.playerStates.map((playerState, pIndex) => {
                const { lines }         = playerState;
                const lastLine          = lines[lines.length - 1];
                const increment         = 1 / (substateCount + 1);
                const limit             = playerState.limit;
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

                const isLimitedSubstate = x2 < limit.minX || x2 > limit.maxX ||
                    y2 < limit.minY || y2 > limit.maxY;
                const isSubStateCrashed = playerState.isCrashed &&
                    (index === substateCount || isLimitedSubstate) &&
                    parsedStates[stateIndex].playerStates[pIndex].isCrashed;

                const subPlayerState = {
                    ...playerState,
                    lines: newLines,
                    isCrashed: isSubStateCrashed
                };

                limitCoordinates(subPlayerState);

                return subPlayerState;
            });

            tweenStates.push(subState);
        }

        state.playerStates.forEach(playerState => limitCoordinates(playerState));

        tweenStates.push(state);
    });

    const lastState = tweenStates[tweenStates.length - 1];
    const finalState = {
        ...lastState,
        round: lastState.round + 1,
        isSubState: true,
    };

    return {
        errors,
        states: tweenStates.concat(new Array(substateCount).fill(finalState)),
        winner: parseWinner(winner, settings.players),
    };
}

function parseState({ settings, state, previousParsedState }) {

    const playerNames = settings.players.map(p => p.name);
    let crashCount = 0;

    const playerStates = playerNames.map((name, index) => {

        const playerState = state.players[index];
        const { isCrashed, error, position } = playerState;
        const { width, height } = settings.field;
        const limit = { minX: -0.5, maxX: width - 0.5, minY: -0.5, maxY: height - 0.5 };

        isCrashed && crashCount++;

        let lines;
        if (!previousParsedState) {
            lines = [{
                x1: position.x,
                y1: position.y,
                x2: position.x,
                y2: position.y,
            }];
        } else {
            const previousLines = previousParsedState.playerStates[index].lines;
            const lastLine = previousLines[previousLines.length - 1];

            lines = previousLines.map(line => ({ ...line }));
            lines.push({
                x1: lastLine.x2,
                y1: lastLine.y2,
                x2: position.x,
                y2: position.y,
            })
        }

        return { name, lines, isCrashed, error, position, limit };
    });

    return { crashCount, playerStates, round: state.round };
}

function addSwitchDeathLimit(state, previousState) {
    if (state.crashCount < 2 || previousState === null) return;

    state.playerStates.forEach((playerState, playerStateIndex) => {
        const position = playerState.position;
        const switched = previousState.playerStates.reduce((switched, ps) =>
        switched || _.isEqual(ps.position, position), false);

        if (!switched) return;

        const previousPlayerState = previousState.playerStates[playerStateIndex];
        const previousPosition = previousPlayerState.position;
        const limX = position.x - ((position.x - previousPosition.x) / 2);
        const limY = position.y - ((position.y - previousPosition.y) / 2);

        playerState.limit = {
            minX: limX <= previousPosition.x ? limX : previousPosition.x,
            minY: limY <= previousPosition.y ? limY : previousPosition.y,
            maxX: limX <= previousPosition.x ? previousPosition.x : limX,
            maxY: limY <= previousPosition.y ? previousPosition.y : limY,
        };
    });
}

function parseErrors(parsedStates) {
    const errors = [];

    parsedStates.forEach((state, stateIndex) => {
        state.playerStates.forEach((playerState, playerStateIndex)  => {
            if (playerState.error) {
                const previousState = parsedStates[stateIndex - 1];
                const previousPlayerState = previousState.playerStates[playerStateIndex];
                const lastLine = previousPlayerState.lines[previousPlayerState.lines.length - 1];

                errors.push({
                    round: state.round - 1,
                    x: lastLine.x2,
                    y: lastLine.y2,
                })
            }
        });
    });

    return errors;
}

function parseWinner(winner, players) {
    if (winner === null) return null;

    return {
        ...players[winner],
        id: winner,
    }
}

function limitCoordinates(playerState) {
    const lastLine = playerState.lines[playerState.lines.length - 1];

    playerState.lines[playerState.lines.length - 1] = {
        ...lastLine,
        x2: limitCoordinate(lastLine.x2, playerState.limit.minX, playerState.limit.maxX),
        y2: limitCoordinate(lastLine.y2, playerState.limit.minY, playerState.limit.maxY),
    };
}

function limitCoordinate(number, min, max) {
    return Math.min(max, Math.max(min, number));
}

export {
    parseSettings,
    parseStates,
};
