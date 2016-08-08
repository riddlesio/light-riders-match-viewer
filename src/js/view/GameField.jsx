import React from 'react';
import createView from 'omniscient';

const GameField = createView('GameField', function (state) {

    const { field } = state;

    return (
        <g>
            { field.map(createRow) }
        </g>
    );
});

function createRow(cells) {
    return <Row cells={ cells }/>;
}

function createCell(cell) {
    return <Cell cell={ cell } />;
}

const Row = createView('Row', function (cells) {

    return cells.map(createCell);
});

const Cell = createView('Cell', function (cell) {

    let className = 'Cell';

    if (cell === 1) {
        className += 'player1';
    }

    return (
        <g>
            <use className={ className } xLinkHref="#cell" />
        </g>
    );
});

export default GameField;
