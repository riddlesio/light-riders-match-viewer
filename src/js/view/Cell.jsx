import React from 'react';
import createView from 'omniscient';
import classNames from 'classnames';

const MinimalisticCell = createView('MinimalisticCell', function ({ cell, settings, index }) {

    const { height, width } = settings.cells;
    const transformX = index * width;

    /**
     *  Description of cell values
     *  In case of 4 players
     *
     *  PLAYER POSITIONS:
     *  Player 1: 33
     *  Player 2: 34
     *  Player 3: 36
     *  Player 4: 40
     *
     *  PLAYER CREATED WALLS:
     *  Player 1: 17
     *  Player 2: 18
     *  Player 3: 20
     *  Player 4: 24
     *
     *  Player illegal move: n
     */

    const className = classNames({
        'Cell': true,
        'Position': cell === '33' || cell === '34' || cell === '36' || cell === '40',
        'Position--p1': cell === '33',
        'Position--p2': cell === '34',
        'Position--p3': cell === '36',
        'Position--p4': cell === '40',
        'Wall': cell === '17' || cell === '18' || cell === '20' || cell === '24',
        'Wall--p1': cell === '17',
        'Wall--p2': cell === '18',
        'Wall--p3': cell === '20',
        'Wall--p4': cell === '24',
    });

    return (
        <rect
            className={ className }
            width={ width }
            height={ height }
            x={ transformX }
        />
    );
});

const DetailedCell = createView('DetailedCell', function ({ cell, settings, index }) {});

const Cell = createView('Cell', function ({ cell, settings, index }) {

    if (settings.minimalistic) {
        return <MinimalisticCell cell={ cell } settings={ settings } index={ index } />;
    }

    return <MinimalisticCell cell={ cell } settings={ settings } index={ index } />;
});

export default Cell;
