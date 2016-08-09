import React from 'react';
import createView from 'omniscient';
import Cell from './Cell.jsx';

const Row = createView('Row', function ({ cells, index, settings }) {

    const { canvas, grid, field } = settings;
    const cellSettings = settings.cells;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const gridWidth = grid.width;
    const gridHeight = grid.height;

    const cellHeight = cellSettings.height;
    const cellWidth = cellSettings.width;

    const transformX = (canvasWidth - gridWidth) / 2;
    const marginTop = (canvasHeight - gridHeight) / 3;
    const transformY = index * cellHeight + marginTop;

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
