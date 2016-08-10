import React from 'react';
import createView from 'omniscient';
import Cell from './Cell.jsx';

const Row = createView('Row', function ({ cells, index, settings, sizes }) {

    const { field } = settings;
    const cellHeight = sizes.cells.height;
    const cellWidth = sizes.cells.width;

    const width = field.width * cellWidth;
    const transformY = index * cellHeight;
    const transform = `translate(0,${transformY})`;

    return (
        <g
            className="Row"
            transform={ transform }
            width={ width }
            height={ cellHeight }
        >
            { cells.map(getCellRenderer(sizes.cells)) }
        </g>
    );
});

function getCellRenderer(cellSize) {

    return function renderCell(cell, index) {

        return <Cell
            key={ `LightRidersCell-${index}` }
            cell={ cell }
            index={ index }
            cellSize={ cellSize }
        />;
    };
}

export default Row;
