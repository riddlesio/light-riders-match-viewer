import React from 'react';
import createView from 'omniscient';
import GameField from './GameField.jsx';

const GameView = createView('GameView', function ({ state, settings }) {

    const { field, winner } = state;
    const { players, cell } = settings;
    const cellWidth = cell.width;
    const cellHeight = cell.height;
    const cellViewBox = `0 0 ${cellWidth} ${cellHeight}`;

    return (
        <svg className="GoGame" viewBox="0 0 1200 705" preserveAspectRatio="xMidYMid meet">
            <defs>
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
                <symbol id="cell" viewBox={ cellViewBox }>
                    <rect width={ cellWidth } height={ cellHeight } />
                </symbol>
            </defs>
            { GameField(state) }
            <use x="70" y="60" xlinkHref="#Avatar-1" />
            <use x="1010" y="60" xlinkHref="#Avatar-2" />
            <text x={ '130' } y={ '215' } className="PlayerName PlayerName--player1" >
                { players.names[0] }
            </text>
            <text x={ '1070' } y={ '215' } className="PlayerName PlayerName--player2" >
                { players.names[1] }
            </text>
            <Overlay winner={ winner } />
        </svg>
    );
});

export default GameView;
