import React from 'react';
import createView from 'omniscient';
import Row from './Row.jsx';

const lifeCycle = {

    getInitialState() {
        return {
            sizes: {
                cells: {
                    width: 0,
                    height: 0,
                },
                grid: {
                    width: 0,
                    height: 0,
                },
                svg: {
                    width: 0,
                    height: 0,
                    heightPercentage: 100,
                    widthPercentage: 100,
                },
            }
        }
    },

    componentDidMount() {

        this.recalculateSizes();

        const resize = this.recalculateSizes;
        let resizeTimer;

        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                resize();
            }, 50);
        });
    },

    recalculateSizes() {

        // Get available grid size from dom
        const GridSpace = this.refs.GridSpace;
        const svgWidth = GridSpace.clientWidth;
        const svgHeight = GridSpace.clientHeight;

        // Get square cell size
        const { field } = this.props.settings;
        const cellHeight = svgHeight / field.height;
        const cellWidth = svgWidth / field.width;
        const cellDimensions = cellWidth > cellHeight ? cellHeight : cellWidth;

        // Get grid size
        const gridWidth = field.width * cellDimensions;
        const gridHeight = field.height * cellDimensions;

        this.setState({
            sizes: {
                cells: {
                    height: cellDimensions,
                    width: cellDimensions,
                },
                grid: {
                    width: gridWidth,
                    height: gridHeight,
                    heightPercentage: gridHeight / svgHeight * 100,
                    widthPercentage: gridWidth / svgWidth * 100,
                },
                svg: {
                    width: svgWidth,
                    height: svgHeight,
                },
            }
        });
    },
};

const GameView = createView('GameView', lifeCycle, function ({ state, settings }) {

    console.log(settings);
    console.log(state);

    const { sizes } = this.state;
    const { grid, svg } = sizes;
    const { field } = state;
    const { canvas, players } = settings;
    const { marginRight, marginTop, marginBottom, marginLeft } = canvas;

    const wrapperStyle = {
        padding: `${marginTop}px ${marginLeft}px ${marginBottom}px ${marginRight}px`,
    };

    return (
        <div className="LightRiders-wrapper" style={ wrapperStyle }>
            <svg
                className="LightRiders"
                viewBox={ `0 0 ${grid.width} ${grid.height}` }
                preserveAspectRatio="xMidYMid meet"
                ref="GridSpace"
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
                    { field.map(getRowRenderer(settings, sizes)) }
                </g>
            </svg>
            <div className="Players-wrapper" style={ wrapperStyle }>
                <div
                    className="Players"
                    style={{
                        width: `${grid.widthPercentage}%`,
                        height: `${grid.heightPercentage}%`
                    }}
                >
                    { players.map(renderPlayerInfo) }
                </div>
            </div>
        </div>
    );
});

function isOdd(num) {
    return num % 2;
}

function getPlayerCords(index) {
    if (index === 0) {
        return {
            top: "-30px",
            left: "-70px",
        }
    }
    if (index === 1) {
        return {
            top: "-30px",
            right: "-70px",
        }
    }
    if (index === 2) {
        return {
            bottom: "-30px",
            left: "-70px",
        }
    }
    if (index === 3) {
        return {
            bottom: "-30px",
            right: "-70px",
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

function getRowRenderer(settings, sizes) {

    return function renderRow(row, index) {

        return (
            <Row
                key={ `LightRiders-Row-${index}` }
                cells={ row }
                index={ index }
                sizes={ sizes }
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
