import React from 'react';
import createView from 'omniscient';

const Cell = createView('Cell', function ({ cell, settings }) {

    let className = 'Cell';
    const { height, width } = settings.cells;

    if (cell === 1) {
        className += 'player1';
    }

    return (
        <use
            className={ className }
            xlinkHref="#cell"
            width={ width }
            height={ height }
        />
    );
});

export default Cell;
