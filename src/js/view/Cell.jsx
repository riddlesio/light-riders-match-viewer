import React from 'react';
import createView from 'omniscient';
import classNames from 'classnames';

const Cell = createView('Cell', function ({ cell, cellSize, index }) {

    const { height, width } = cellSize;
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

    if (className.includes('Position')) {
        return (
            <g
                className="Cell"
                width={ width }
                height={ height }
            >
                <use
                    className={ className }
                    xlinkHref="#SpaceShip"
                    width={ width }
                    height={ height }
                    x={ transformX }
                />
            </g>
        );
    }

    return (
        <rect
            className={ className }
            width={ width }
            height={ height }
            x={ transformX }
        />
    );
});

export default Cell;
