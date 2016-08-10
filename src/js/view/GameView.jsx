import React from 'react';
import createView from 'omniscient';
import Row from './Row.jsx';

const GameView = createView('GameView', function ({ state, settings }) {

    console.log(settings);
    console.log(state);
    const { field, winner } = state;
    const { canvas, players } = settings;
    const { width, height } = canvas;

    return (
        <div className="LightRiders-wrapper">
            <svg
                className="LightRiders"
                viewBox={ `0 0 ${width} ${height}` }
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <pattern
                        id="New_Pattern_Swatch_5"
                        width="1"
                        height="2"
                        patternTransform="translate(6.79 0.55) scale(0.56 0.83)"
                        patternUnits="userSpaceOnUse"
                        viewBox="0 0 1 2"
                    >
                        <rect className="Avatar-1" width="1" height="2"/>
                        <rect className="Avatar-2" width="1" height="1"/>
                        <rect y="1" width="1" height="1"/>
                    </pattern>
                    <symbol id="AvatarShape" viewBox="0 0 100 100">
                        <rect style={{ opacity: 0.2, fill: 'url(#New_Pattern_Swatch_5)' }} x="0.5" y="0.5" width="99" height="99" rx="9.5" ry="9.5"/>
                        <path d="M90,1a9,9,0,0,1,9,9V90a9,9,0,0,1-9,9H10a9,9,0,0,1-9-9V10a9,9,0,0,1,9-9H90m0-1H10A10,10,0,0,0,0,10V90a10,10,0,0,0,10,10H90a10,10,0,0,0,10-10V10A10,10,0,0,0,90,0h0Z"/>
                    </symbol>
                </defs>
                <g>
                    { field.map(getRowRenderer(settings)) }
                </g>
            </svg>
            <div className="Players">
                { players.map(renderPlayerInfo) }
            </div>
        </div>
    );
});

function isOdd(num) {
    return num % 2;
}

function renderPlayerInfo(player, index) {

    const className = `Player${index + 1}`;
    const transform = `translate(${player.avatar.x}, ${player.avatar.y})`;
    const textAnchor = isOdd(index) ? 'end' : 'start';

    return (
        <div key={ `Player--${index}` } className={ className }>
            <use
                xlinkHref="#AvatarShape"
                className="AvatarStroke"
                width="60"
                height="60"
                transform={ transform }
            />
            <text
                textAnchor={ textAnchor }
                className="PlayerName"
                x={ player.text.x }
                y={ player.text.y }
            >
                { player.name }
            </text>
        </div>
    );
}

function getRowRenderer(settings) {

    return function renderRow(row, index) {

        return (
            <Row
                key={ `LightRiders-Row-${index}` }
                cells={ row }
                index={ index }
                settings={ settings }
            />
        );
    };
}

export default GameView;

export {
    isOdd,
    getRowRenderer,
    renderPlayerInfo,
};
