import React from 'react';
import createView from 'omniscient';
import Cell from './GridCell.jsx';

const Row = createView('Row', function ({ cells, index, grid, settings, sizes }) {

    const cellDimension = sizes.cells.width;
    const width = grid.width * cellDimension;
    const transformY = index * cellDimension;
    const transform = `translate(0,${transformY})`;

    return (
        <g className="Row"
            transform={ transform }
            width={ width }
            height={ sizes.cells.height } >
            { cells.map(getCellRenderer({ cellSize: sizes.cells, settings })) }
        </g>
    );
});

function getCellRenderer({ cellSize, settings }) {

    return function renderCell(cell, index) {

        return <Cell
            key={ `LightRidersCell-${index}` }
            index={ index }
            cellSize={ cellSize }
            settings={ settings }
        />;
    };
}

export default Row;
