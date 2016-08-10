import React from 'react';
import createView from 'omniscient';
import Cell from './Cell.jsx';

const Row = createView('Row', function ({ cells, index, settings }) {

    // FIXME: Something is fucked up here
    const { canvas, grid, field } = settings;

    const canvasWidth = canvas.width;
    const gridWidth = grid.width;

    const cellHeight = settings.cells.height;
    const cellWidth = settings.cells.width;

    const transformX = (canvasWidth - gridWidth) / 2;
    const transformY = index * cellHeight;

    const transform = `translate(${transformX},${transformY})`;
    const fieldWidth = field.width;
    const width = fieldWidth * cellWidth;

    return (
        <g
            className="Row"
            transform={ transform }
            width={ width }
            height={ cellHeight }
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
