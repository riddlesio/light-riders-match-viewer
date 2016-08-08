import React from 'react';
import createView from 'omniscient';

const GameView = createView('GameView', function ({ state, settings }) {

    const { winner, illegalMove, player } = state;
    const { players } = settings;
    const illegalMoveClass = player === 1 ? 'u-color-player1': 'u-color-player2';
    const player1class = `PlayerName PlayerName--player1 ${player === 1 ? 'is-active' : ''}`;
    const player2class = `PlayerName PlayerName--player2 ${player === 2 ? 'is-active' : ''}`;

    return (
        <svg className="GoGame" viewBox="0 0 1200 705" preserveAspectRatio="xMidYMid meet">
            <defs>
                <symbol id="LightRiders-vehicle-player1" viewBox="0 0 37 37">
                    <rect className="LightRiders-vehicle LightRiders-vehicle--player1" />
                </symbol>
                <symbol id="LightRiders-vehicle-player2" viewBox="0 0 37 37">
                    <rect className="LightRiders-vehicle LightRiders-vehicle--player2" />
                </symbol>
                <symbol id="Avatar-1" viewBox="0 0 37 37"></symbol>
                <symbol id="Avatar-2" viewBox="0 0 37 37"></symbol>
                <symbol id="" viewBox="0 0 37 37"></symbol>
            </defs>
            { FieldView(state) }
            <use x="70" y="60" xlinkHref="#Avatar-1" />
            <use x="1010" y="60" xlinkHref="#Avatar-2" />
            <text x={ '130' } y={ '215' } className={ player1class }>
                { players.names[0] }
            </text>
            <text x={ '1070' } y={ '215' } className={ player2class }>
                { players.names[1] }
            </text>
            <text x="50%" y="60" className={'GoGame-illegalMove' + illegalMoveClass }>
                { illegalMove }
            </text>
            <Overlay winner={ winner } />
        </svg>
    );
});

export default GameView;
