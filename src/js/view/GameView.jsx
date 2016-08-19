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

const GameView = createView('GameView', lifeCycle, function ({ currentState, errors, state, settings }) {

    console.log(settings);
    console.log(state);
    console.log(errors);

    const playerStates = state;
    const { sizes } = this.state;
    const { cells, grid, svg } = sizes;
    const { canvas, players } = settings;
    const { marginRight, marginTop, marginBottom, marginLeft } = canvas;
    const cellDimension = cells.width;

    // TODO: Get the grid to position correctly
    const gridTransformX = (Math.ceil(marginLeft / cellDimension) * cellDimension) - marginLeft;
    const gridTransformY = (Math.ceil(marginTop / cellDimension) * cellDimension) - marginTop;
    // console.log(cellDimension);
    // console.log(gridTransformX, gridTransformY);

    const wrapperStyle = {
        padding: `${marginTop}px ${marginLeft}px ${marginBottom}px ${marginRight}px`,
    };

    return (
        <div key="GAME" className="LightRiders-wrapper">
            <svg
                className="GridBackground-wrapper"
                viewBox={ `0 0 ${canvas.width} ${canvas.height}` }
                preserveAspectRatio="xMidYMid meet"
            >
                <g transform={ `translate(-${gridTransformX},-${gridTransformY})` }>
                    { renderGrid({ settings, sizes }) }
                </g>
            </svg>
            <svg className="RadialBackgroundGradient-wrapper" viewBox={ `0 0 ${canvas.width} ${canvas.height}` }>
                <defs>
                    <radialGradient
                        id="radial-gradient"
                        cx={ canvas.width / 2 }
                        cy={ canvas.height / 2 }
                        r={ grid.width }
                        gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#fff"/>
                        <stop offset="0.08" stopColor="#ebebeb"/>
                        <stop offset="0.42" stopColor="#9a9c9e"/>
                        <stop offset="0.69" stopColor="#5f6265"/>
                        <stop offset="0.89" stopColor="#3a3e42"/>
                        <stop offset="1" stopColor="#2c3035"/>
                    </radialGradient>
                </defs>
                <rect
                    style={{ opacity: 0.2 }}
                    fill="url(#radial-gradient)"
                    y="0.47"
                    width="960"
                    height="540"
                />
            </svg>
            <div className="GameState-wrapper" style={ wrapperStyle }>
                <svg
                    className="GameState"
                    viewBox={ `0 0 ${grid.width} ${grid.height}` }
                    preserveAspectRatio="xMidYMid meet"
                    ref="GridSpace"
                >
                    <defs>
                        <filter
                            id="luminosityNoClip"
                            x="2"
                            y="2"
                            width="17"
                            height="17"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                        >
                            <feFlood floodColor="#fff" result="bg"/>
                            <feBlend in="SourceGraphic" in2="bg"/>
                        </filter>
                        <mask id="myMask" x="2" y="2" width="17" height="17" maskUnits="userSpaceOnUse">
                            <g
                                filter="url(#luminosityNoClip)"
                                style={{ filter: 'url(#luminosityNoClip)' }}
                            >
                                <image
                                    width="17"
                                    height="17"
                                    transform="translate(2 2)"
                                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAIAAAC0D9CtAAAACXBIWXMAAAsSAAALEgHS3X78AAAA+0lEQVQoU8WSP65EUBTG7QWJxjJGJUShVBAKjQ0IUbEEibABBStQiIQoVCKhVtKIGu9kkpFH5s2tJu9X3Jx85/vufwz7ZwiCQFmuMAxjGAbLsijjLyzLiuPYcRyU8YWqqkVRjOMIo6ZpKPuTIAjmeT6OY5omqFF2DNN1vW3b40XXdXAwRAYmXpblzKzrGobhp4Asy03THFfqulYU5c+M53nDMGzbdgb2fe/73nXd9wF4Dd/38zwvyzJNU7jrJEmqqsqyLIoinuffZERRtG3bNE3Y4SlKkgQirA/FPUBRFMdxj8fj3ngC30IQBJqmLyqO43fpCnRJkvxg+AI/RiKTPeFP/qsAAAAASUVORK5CYII="
                                />
                            </g>
                        </mask>
                        { /* TODO: Apply mask correctly like the design */ }
                        <symbol id="Spaceship2" viewBox="0 0 22 22">
                            <g isolation="isolate">
                                <image
                                    opacity="0.7"
                                    mixBlendMode="screen"
                                    style={{ mixBlendMode: 'screen' }}
                                    width="25"
                                    height="25"
                                    transform="translate(-2 -2)"
                                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsSAAALEgHS3X78AAADWUlEQVRIS7VVS2tTQRRO29RHH0pjYmYmaelCkLYLpRHEx0rwgQXBhSAoFjdKFyLoH0hdSBH9ASLoUs3CpbsSRCgIXYmCEqRJ7iOlpUJtk3vnZjGe797bmjT3JnXRxXD4zvnOOXPOnJmJKKUie706ErZXRHW1rE4+u07yL2g3rZ58REUhfbyrZLtJgGDRwrHCfi2tDppC9UECKy9hd6dEHRMsZlQvgv4aUocpQXw5qY5CAkMPe6dEoUmyfgWmMLHzmCmsEUPYx0tMTkACe3qzDzyX/19JvCp6lkbVgdKIGqowa9QUzqSetC6YvH7ZlYShhx085Z1TYDVhSVBF72pcDeqpWrooqpM6s6fKzLpLcsaXU66e7OCBr0KqCa0C/a6wjYTJ5Zgp7Esmd+5pQs4arP4MEtjTyzHwwA+rJrSKtZg6RAc8Qjs9o3F5W2NyVhfytcGcd5DA0MMOHvhh1bSpQiVwyGgLrcc6d17qXH40uPMJ0sXQkx088MOqaVtFUdTOlpg1bTA5Z3D5gYJ/0YXzFRIYetjBa1dN6FlUmBzXmH1V5/Yjg9uvdObMU3u+UasKriTs6skOHvhhZ9NSBSbFELVhLemc1rh1yxTyCZ3DW2rTZzc4lz8hgaGHHTzw4Rc0aU1VYN711J8j7qUTmxfLNK7U+xe0+xy1aZ7kgua2TC74OAc7eODDD/47701jkuhycrl/JaGYnnJOkMM1GtOHdOmeG8J5ozOJqXq/vQhDDzt44MMP/oijvHetKUnT5SOnUzT/1zVhP6DDzdK4zlGbnupojZBZSGDoXTvxwIdf0OVsSbKWUukSr2YwmhXm3MENJ+f7dNDTZVG7WWK1G5DAnt6e8XlT8IN/2yRU6kAxXuWYFHoAz2vcvgJnQ9Sp3/VzFDRDLTkJCQw97OCBDz/4I05Qkq489RDjt/XiltjGOAKiz0X36bBGy8NVsZTYZJDA0MMOHvhbLzPi5APOZOtz6qX/ol9Lr8cQTEvXUlQ6L9D8/6b/AzZ8WpDA0MMOnsdfj8G2XUVTEj9RDmPnf1LfEysDP+Krg5AunlD7MDH+DqPAQTz458IuY6ThL0egRdrNorej1j+94c9XDdx8w3ccCbzxzc9LF366bENg2kXzowccwt0ZszXJHqy/D17rLqxP/HcAAAAASUVORK5CYII="
                                />
                                <polygon fill="white" points="10.5 4.5 16.5 16.5 10.44 12.75 4.5 16.5 10.5 4.5"/>
                                <g mask="url(#myMask)" style={{ mask: 'url(#myMask)' }}>
                                    <g
                                        opacity="0.75"
                                        mixBlendMode="screen"
                                        style={{ opacity: 0.75, mixBlendMode: 'screen' }}
                                    >
                                        <polygon
                                            fill="#fff"
                                            points="10.5 4.5 16.5 16.5 10.44 12.75 4.5 16.5 10.5 4.5"
                                        />
                                    </g>
                                </g>
                            </g>
                        </symbol>
                    </defs>
                    { /* <use
                        className="SpaceShip"
                        xlinkHref="#Spaceship2"
                        transform="translate(516.76, -50) rotate(90)"
                        width="626.0625"
                        height="626.0625"
                    /> */ }
                    { playerStates.map(getPlayerStateRenderer({ settings, sizes })) }
                    { renderErrors({ currentState, errors, sizes }) }
                </svg>
            </div>
            <div className="PlayerInformation-wrapper" style={ wrapperStyle }>
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

function renderErrors({ currentState, errors, sizes }) {

    const cellDimension = sizes.cells.width;
    const halfCellDimension = cellDimension / 2;
    const toPixels = (n) => parseInt(n) * cellDimension;

    return errors.map((error) => {
        const errorIndex = error.index;
        const isVisible = errorIndex <= currentState;
        const { x, y } = error.error;
        const cx = toPixels(x) - halfCellDimension;
        const cy = toPixels(y) - halfCellDimension;

        return isVisible ? (
            <circle
                cx={ cx }
                cy={ cy }
                r="10"
                className="ErrorCircle"
            />
        ) : null;
    });
}

function renderGrid({ settings, sizes }) {
    const { canvas } = settings;
    const cellDimension = sizes.cells.width;
    const gridWidth = Math.ceil(canvas.width / cellDimension * 1.1);
    const gridHeight = Math.ceil(canvas.height / cellDimension * 1.1);

    const rowCount = parseInt(gridHeight);
    const rowLength = parseInt(gridWidth);
    const rowArray = Array.from({ length: rowLength });
    const arrayField = Array.from({ length: rowCount }).map(() => rowArray);
    const grid = {
        width: gridWidth,
        height: gridHeight,
    };

    return arrayField.map(getRowRenderer({ grid, settings, sizes }));
}

function getRowRenderer({ grid, settings, sizes }) {

    return function renderRow(row, index) {

        return (
            <Row
                cells={ row }
                index={ index }
                key={ `LightRiders-Row-${index}` }
                grid={ grid }
                settings={ settings }
                sizes={ sizes }
            />
        );
    };
}

function getPlayerStateRenderer({ settings, sizes }) {

    return function renderPlayerState(props, index) {

        const { lines, name } = props;
        const playerNo = index + 1;
        const currentLine = lines[lines.length - 1];
        const { x1, x2, y1, y2 } = currentLine;
        let direction;

        if (x1 > x2) {
            direction = 'left';
        } else if (x2 > x1) {
            direction = 'right';
        } else if (y2 > y1) {
            direction = 'down';
        } else {
            direction = 'up';
        }

        const currentPosition = {
            direction,
            x: currentLine.x2,
            y: currentLine.y2
        };

        return (
            <g key={ name } className={ `Player Player--${playerNo}` }>
                { lines.map(getPlayerLineRenderer({ name, settings, sizes })) }
                { renderSpaceShip({ currentPosition, sizes }) }
            </g>
        );
    }
}

function renderSpaceShip({ currentPosition, sizes }) {

    const { direction, x, y } = currentPosition;
    const cellDimension = sizes.cells.width;
    let rotation = 0;
    let transformXCorrection = 0;
    let transformYCorrection = 0;

    switch(direction) {
        case 'left':
            rotation = 270;
            transformXCorrection -= cellDimension;
            transformYCorrection += cellDimension;
            break;
        case 'right':
            rotation = 90;
            break;
        case 'up':
            rotation = 0;
            transformXCorrection -= cellDimension;
            break;
        case 'down':
            rotation = 180;
            transformYCorrection += cellDimension;
            break;
    }
    const transformX = (x * cellDimension) + transformXCorrection;
    const transformY = ((y - 1) * cellDimension) + transformYCorrection;

    return (
        <use
            className="SpaceShip"
            xlinkHref="#Spaceship2"
            transform={ `translate(${transformX}, ${transformY}) rotate(${rotation})`}
            width={ cellDimension }
            height={ cellDimension }
        />
    );
}

function getPlayerLineRenderer({ name, settings, sizes }) {

    const { breakpoint } = settings;
    const modifierClass = sizes.cells.width > breakpoint ? 'normal' : 'small';

    return function renderPlayerLine(props, index) {

        let { x1, x2, y1, y2 } = props;

        const { cells } = sizes;
        const cellDimension = cells.width;
        const halfCellDimension = cellDimension / 2;

        x1 = ((x1 - 1) * cellDimension) + halfCellDimension;
        y1 = ((y1 - 1) * cellDimension) + halfCellDimension;
        x2 = ((x2 - 1) * cellDimension) + halfCellDimension;
        y2 = ((y2 - 1) * cellDimension) + halfCellDimension;

        return (
            <line
                key={ `${name}-line-${index}` }
                className={ `line line--${modifierClass}` }
                x1={ x1 }
                y1={ y1 }
                x2={ x2 }
                y2={ y2 }
            />
        );
    }
}

function isOdd(num) {
    return num % 2;
}

function renderPlayerInfo(player, index) {

    const className = `Player Player${index + 1}`;
    const odd = isOdd(index);
    const playerCords = getPlayerInfoCords(index);
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

function getPlayerInfoCords(index) {
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

export default GameView;

export {
    isOdd,
    getRowRenderer,
    renderPlayerInfo,
};
