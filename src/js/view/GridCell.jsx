import React from 'react';
import createView from 'omniscient';

const GridCell = createView('GridCell', function ({ cellSize, index, settings }) {

    const { height, width } = cellSize;
    const transformX = index * width;
    const { breakpoint } = settings;
    const visibilityClass = width > breakpoint ? 'Cell--grid' : '';

    return (
        <rect
            className={ `Cell ${visibilityClass}` }
            width={ width }
            height={ height }
            x={ transformX }
        />
    );
});

export default GridCell;
