import React from 'react';
import createView from 'omniscient';
import Row from './Row.jsx';

const GameView = createView('GameView', function ({ state, settings }) {

    const { field, winner } = state;
    const { canvas } = settings;
    const { width, height } = canvas;

    console.log(field);

    return (
        <div style={{ height: '100%' }}>
            <svg
                className="LightRiders"
                viewBox={ `0 0 ${width} ${height}` }
                preserveAspectRatio="xMidYMid meet"
            >
                <g>
                    { field.map(getRowRenderer(settings)) }
                </g>
            </svg>
        </div>
    );
});

function getRowRenderer(settings) {

    return function renderRow(row, index) {

        return <Row
            key={ `LightRiders-Row-${index}` }
            cells={ row }
            index={ index }
            settings={ settings }
        />
    };
}

export default GameView;

// DEFS
/*
 <symbol id="LightRiders-vehicle-player1" viewBox="0 0 37 37">
 <rect
 className="LightRiders-vehicle LightRiders-vehicle--player1"
 width={ cellWidth }
 height={ cellHeight }
 />
 </symbol>
 <symbol id="LightRiders-vehicle-player2" viewBox="0 0 37 37">
 <rect
 className="LightRiders-vehicle LightRiders-vehicle--player2"
 width={ cellWidth }
 height={ cellHeight }
 />
 </symbol>
 <symbol id="Avatar-1" viewBox="0 0 37 37"></symbol>
 <symbol id="Avatar-2" viewBox="0 0 37 37"></symbol>
 */
/*
 <use x="70" y="60" xlinkHref="#Avatar-1" />
 <use x="1010" y="60" xlinkHref="#Avatar-2" />
 <text x={ '130' } y={ '215' } className="PlayerName PlayerName--player1" >
 { players.names[0] }
 </text>
 <text x={ '1070' } y={ '215' } className="PlayerName PlayerName--player2" >
 { players.names[1] }
 </text>
 <Overlay winner={ winner } />
 */
