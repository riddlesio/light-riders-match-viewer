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

function parseStates(matchData, settings) {

    const { errors, states, players } = matchData;
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

    stateCount = Math.ceil(stateCount);

    const parsedErrors = parseErrors({ errors, parsedStates, stateCount });

    const tweenStates = parsedStates.map((playerState) => {

        const array = Array.from({ length: stateCount });

        return array.map((item, index) => {

            return playerState.map((player) => {
                const { lines } = player;
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
                    ...player,
                    lines: newLines,
                }
            });
        });
    });

    return {
        winner: players.winner,
        errors: parsedErrors,
        states: tweenStates.reduce((a, b) => a.concat(b), []),
    };
}

function parseState({ settings, state }) {

    const playerNames = settings.players.map(p => p.name);
    const splitStates = state.split(';');

    return playerNames.map((name) => {
        let crashed = false;

        const playerState = splitStates
            .find(player => player.includes(name))
            .replace(`${name}`, '')
            .split(':')
            .map(line => line.split(','))
            .map((line) => {
                // FIXME: set crashed when in the last tween state only
                if (line[4] === 'X') {
                    crashed = true;
                }
                return {
                    x1: parseInt(line[0]),
                    y1: parseInt(line[1]),
                    x2: parseInt(line[2]),
                    y2: parseInt(line[3]),
                }
            });

        return {
            name,
            crashed,
            lines: playerState,
        };
    });
}

function parseErrors({ errors, parsedStates, stateCount }) {

    return errors
        .map((error) => {
            const coordinates = error.split(',');
            return {
                x: parseInt(coordinates[0]),
                y: parseInt(coordinates[1]),
            };
        })
        .map((error) => {
            const index = parsedStates.find((state, index) => {
                const foundError = state.find((playerState) => {
                    const { lines } = playerState;
                    const finalLine = lines[lines.length - 1];
                    return error.x === finalLine.x2 && error.y === finalLine.y2;
                });
                if (!!foundError) return index;
            });

            return {
                error,
                index: parsedStates.indexOf(index),
            }
        })
        .map((error) => ({
            ...error,
            index: (error.index + 1) * stateCount,
        }));
}

export {
    parseSettings,
    parseStates,
    parseState,
    parsePlayerNames,
};
