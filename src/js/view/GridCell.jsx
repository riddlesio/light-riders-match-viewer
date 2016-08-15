import React from 'react';
import createView from 'omniscient';

const GridCell = createView('GridCell', function ({ cellSize, index }) {

    const { height, width } = cellSize;
    const transformX = index * width;

    return (
        <rect
            className="Cell Cell--grid"
            width={ width }
            height={ height }
            x={ transformX }
        />
    );
});

export default GridCell;
