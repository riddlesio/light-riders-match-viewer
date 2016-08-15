import React from 'react';
import createView from 'omniscient';
import GridRow from './Row.jsx';

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
        // TODO: if breakpoint toggle css class

        // Get grid size
        const gridWidth = field.width * cellDimensions;
        const gridHeight = field.height * cellDimensions;

        this.setState({
            minimalistic: cellDimensions < 5,
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
    const { cells, grid, svg } = sizes;
    const { field } = state;
    const { canvas, players } = settings;
    const { marginRight, marginTop, marginBottom, marginLeft } = canvas;
    const cellDimension = cells.width;
    const halfCellDimension = cellDimension / 2;
    console.log(cellDimension);
    const wrapperStyle = {
        padding: `${marginTop}px ${marginLeft}px ${marginBottom}px ${marginRight}px`,
    };

    return (
        <div key="GAME" className="LightRiders-wrapper" style={ wrapperStyle }>
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
                    <filter id="luminosity-noclip" x="2" y="2.41" width="21" height="21" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodColor="#fff" result="bg"/>
                        <feBlend in="SourceGraphic" in2="bg"/>
                    </filter>
                    <mask
                        id="mask"
                        x="2"
                        y="2.41"
                        width="21"
                        height="21"
                        maskUnits="userSpaceOnUse">
                        <g className="SpaceShip-7">
                            <image
                                width="21"
                                height="21"
                                transform="translate(2 2.41)"
                                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAIAAAAmdTLBAAAACXBIWXMAAAsSAAALEgHS3X78AAABXklEQVQ4T82SP6uCUBiH/RLuQn4JbQyyIYjATbBFIeyPNDWEIgQO7UFU9gX6AHcRQWpusGwQmxojrGhrsJfCS9bxHu5w4T7D4fC+v0dfzjkE8a+haRoXyaZYLLbb7XK5jAtmoOv6fD43DAMXRCFJ0nK53O/3i8VClmVc/IPxeHw8HuM4PhwOsMfF0yiKsl6v44TtdquqKk56wbKs8/n87V+v19lshpMSGo2G7/txms1mA0Ph1AfT6fT150+iKIKhcCpB1Ot1z/NiFDBUq9XC+MPh8Hnsn8AIo9HoJ1kQBNd1L5fL7XYLw/DrQRAEp9MJfChCVxTFTL/X6zmOAzdn23a3230Wm83mZDJZrVa73Q5elKZpaLlQKPT7fXgqpmnWarW3LpzLYDCAD8HKcRzCL5VKcEPVahXRS+B5vtPpVCqV9wZFUSzLMgyDslJALJ/P53K5VJUkyYw8mt/m/4w7Gnf2Z9sghWIAAAAASUVORK5CYII="
                            />
                        </g>
                    </mask>
                    <symbol id="SpaceShip" viewBox="0 0 25 25">
                        <g isolation="isolate">
                            <image
                                style={{ opacity: 0.7 }}
                                mixBlendMode="screen"
                                width="29"
                                height="29"
                                transform="translate(-2 -1.59)"
                                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAACXBIWXMAAAsSAAALEgHS3X78AAAEgUlEQVRIS71WW2gdRRg+pqlt4i2pJ9ndOTFNa6zUtCAtlNYb4oOiFV+EghcqoiiKgtRW34oVRCx4AaFCvdQHQQ0oUvAKJVTfanxQUYRjepKzs5ucFqOY5OzOnofx+2ZOks3lnD0q9OFndma+///2m/nnn8lprXMX2jIBKyynL1phWT7/mXSRpA22ZiSn29nW+/+KPBOQImTw9uJgcZ3fpztCoTvZsq/tD7S1SpwJmCcc3anXkmSsW18BwvyUo3vZss9xzrdKnEn6Ql1hKEIq2xCKqD8Q8bUTrhpiy74dDzuJM/j/RWpVrikN6PUT/bp70o0GQpHskE50W+jV7jAt+hznPHHa7nNTtVmkVLn2fF5fJgvVvnExt0O68d6yGz2M9ol6u9eMY5444nWG2kyV3K9Jd6Yn9NTWUMS3h17ymC/UkcCtHWXLvh1XW4kjXmeozVT5xwZ9ORKmH0r2+J560HfVESnUe4GbfMSWfY5znjjis9S2oFL3MGm4jLBnAy8+Hnjqy8BLTts2Ps5xzhNHfJbaTJVnvWhjIKo3SDd5KHDVKyD6DPY91P3C1vQxbuaBIz5LbWsqnfhu340PYTlPQOF3UsRF6Skf/aLtqxNmHrhW1LasEklzVLrqJAh+ggUgO8+WfSTVSTvfmtomKmegcmbIHpH4IBLnXe4jiKEyqUDptPTicyD9HePfYhzJFR9c3NvGmdxQJSuNLNT2SDfaj317GSSfgOyM78VjvohDEFbwPYm5syAdRfupwbnJfvrRv5HaZiqvwz7dieDPoOocA+kXsDOwn2G/wn6jBfb7ByTWV/ipt4inH/0bqV2hklUF+3KV7ya7yqJ6H87hYSYKgn0uRXIKSXQKwb8B2df8tkfHHh/g3kcmH7Z+yS7GWa1KLagcNjW2tJ7F2++Lr5EFU1cfhYqXEPQd7NmHCPwBlvRtKHkTxG+A9BiJMMdC8TH3lXjjB3/GYTzGHU6pTS9tO+/ISu+s4zuz2xH4LtbXAKUOBK9B6av2Oz6A/uM+AiO5nkTWPk8ijL1uTKgX6Ud/xmE8xtX2zl1KOoolONejLy3n54QszF5Pp0Akj0ivdgBZeQjJ8xTq6wPMTt+Nbg1F7SbeMrje7mHyAPs0fuA5U7XgZ34acRiPcUftEi8hNfvJSeyBxz80y+Ope0Oh7sey7ZtkUiEry87MtoqjN5dwnVV69dVTjtqOvbvRrozaRzz9jD/iMB7jpvd1xfKaatITD054czvLXnQz7s1bpFPdXXbUNt6bfDGUunQXj8NE/1/dXL5xJ9pkf7S6m3j60Z9xGK/h8up6Ik3j+TGen/MQfJMsxFuYDKGnN0KVM22fKp16SF+s8TwpDup17JcG/uziPHE2CeMt9Gcc+jCubpBI5lni9/kdRaiwTxCdl4W/rxzbvEg2svgIMzZSf6z96ExdQhzx9KO/jeN36GUPt+XFIfXi8zt4sM0ThMrSjvMHff677kcc8fQzP9/gpbha7W2rn6m0NX/bLiVf8BtO+6bwzQIsWK4R2TLLreK7nHB10gtg/wAZdCPGuYbJrAAAAABJRU5ErkJggg=="
                            />
                            <polygon
                                className="SpaceShipColor"
                                points="12.5 4.5 20.5 20.5 12.42 15.5 4.5 20.5 12.5 4.5"
                            />
                            <g style={{ mask: 'url(#mask)' }}>
                                <g style={{ opacity: 0.75 }} mixBlendMode="screen">
                                    <polygon
                                        className="SpaceShip-6"
                                        fill="#fff"
                                        points="12.5 4.5 20.5 20.5 12.42 15.5 4.5 20.5 12.5 4.5"
                                    />
                                </g>
                            </g>
                        </g>
                    </symbol>
                    <symbol id="StraightLine" viewBox={ `0 0 ${cellDimension} ${cellDimension}` }>
                        <path className="line" d={ `M${halfCellDimension} 0 L${halfCellDimension} ${cellDimension}` } />
                    </symbol>
                    <symbol id="CornerLine" viewBox={ `0 0 ${cellDimension} ${cellDimension}` }>
                        <path className="line" d={ `M${halfCellDimension} 0 L${halfCellDimension} ${halfCellDimension}` } />
                    </symbol>
                </defs>
                <g>
                    { field.map(getRowRenderer({ isGrid: true, settings, sizes })) }
                </g>
                <g>
                    { field.map(getRowRenderer({ isGrid: false, settings, sizes })) }
                </g>
                <path className="line" d="M15 0 L15 30" />
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
        <div className="AvatarWrapper">
            <div className="AvatarBackground"></div>
        </div>,
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

function getRowRenderer({ isGrid, settings, sizes }) {

    return function renderRow(row, index) {

        return (
            <GridRow
                key={ `LightRiders-Row-${index}` }
                cells={ row }
                index={ index }
                isGrid={ isGrid }
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

// <svg key="BACKGROUND" className="BackgroundSvg" width="100%" height="100%" viewBox="0 0 960 540">
//     <defs>
//         <radialGradient
//             id="radial-gradient"
//             cx="600"
//             cy="352.97"
//             r="492.07"
//             gradientUnits="userSpaceOnUse">
//             <stop offset="0" stopColor="#fff"/>
//             <stop offset="0.08" stopColor="#ebebeb"/>
//             <stop offset="0.42" stopColor="#9a9c9e"/>
//             <stop offset="0.69" stopColor="#5f6265"/>
//             <stop offset="0.89" stopColor="#3a3e42"/>
//             <stop offset="1" stopColor="#2c3035"/>
//         </radialGradient>
//     </defs>
//     <rect style={{ opacity: 0.2 }} fill="url(#radial-gradient)" y="0.47" width="960" height="540"/>
// </svg>
