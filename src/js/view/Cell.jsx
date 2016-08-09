import React from 'react';
import createView from 'omniscient';

const Cell = createView('Cell', function ({ cell, settings, index }) {

    let className = 'Cell';
    const { height, width } = settings.cells;
    const transformX = index * width;

    if (cell === 1) {
        className += 'player1';
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
