import React from 'react';
import createView from 'omniscient';
import Cell from './Cell.jsx';

const Row = createView('Row', function ({ cells, index, settings }) {

    const cellHeight = settings.cells.height;
    const transformY = index * cellHeight;
    const transform = `translate(0,${transformY})`;

    return (
        <g
            className="Row"
            transform={ transform }
            width="100%"
            height={ `${cellHeight}px` }
        >
            { cells.map(getCellRenderer(settings)) }
        </g>
    );
});

function getCellRenderer(settings) {

    return function renderCell(cell, index) {

        return <Cell
            key={ `LightRidersCell-${index}` }
            cell={ cell }
            index={ index }
            settings={ settings }
        />;
    };
}

export default Row;
