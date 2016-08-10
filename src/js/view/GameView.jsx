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
                </defs>
                <g>
                    { field.map(getRowRenderer(settings)) }
                </g>
            </svg>
            <div className="Players-wrapper">
                <div
                    className="Players"
                    style={{
                        width: `83%`,
                        height: `83%`
                    }}
                >
                    { players.map(renderPlayerInfo) }
                </div>
            </div>
        </div>
    );
});

// style={{
//     width: `${settings.grid.widthPercentage}%`,
//     height: `${settings.grid.heightPercentage}%`
// }}

function isOdd(num) {
    return num % 2;
}

function getPlayerCords(index) {
    if (index === 0) {
        return {
            top: "-30px",
            left: "-10px",
        }
    }
    if (index === 1) {
        return {
            top: "-30px",
            right: "-10px",
        }
    }
    if (index === 2) {
        return {
            bottom: "0px",
            left: "-10px",
        }
    }
    if (index === 3) {
        return {
            bottom: "0px",
            right: "-10px",
        }
    }
}

function renderPlayerInfo(player, index) {

    const className = `Player Player${index + 1}`;
    const odd = isOdd(index);
    const playerCords = getPlayerCords(index);
    const { top, bottom, left, right } = playerCords;

    const info = [
        <div className="AvatarWrapper"></div>,
        <p className="Player-name">
            { player.name }
        </p>
    ];

    return (
        <div key={ `Player--${index}` } className={ className } style={{ top, bottom, left, right }}>
            { info[odd ? 1 : 0] }
            { info[odd ? 0 : 1] }
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
