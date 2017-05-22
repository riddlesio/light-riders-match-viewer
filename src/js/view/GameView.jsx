import React from 'react';
import createView from 'omniscient';
import Row from './Row.jsx';
import { event } from '@riddles/match-viewer';

const { PlaybackEvent } = event;

const lifeCycle = {

    getInitialState() {
        return {
            showPlayerInfo: true,
            paused: false,
            sizes: {
                cells: {
                    width: 0,
                    height: 0,
                },
                grid: {
                    width: 960,
                    height: 540,
                    heightPercentage: 100,
                    widthPercentage: 100,
                },
                svg: {
                    width: 960,
                    height: 540,
                },
            },
        };
    },

    componentWillMount() {

        PlaybackEvent.on(PlaybackEvent.PLAY, this.hidePlayerInfo);
        PlaybackEvent.on(PlaybackEvent.PAUSE, this.showPlayerInfo);
    },

    componentDidMount() {

        this.recalculateSizes();

        const resize = this.recalculateSizes;
        let resizeTimer;

        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                resize();
            }, 50);
        });

        // setTimeout(this.maybeHidePlayerInfo, 3000);
    },

    setPlayerInfo(bool) {
        // Hiding player info off for now
        // this.setState({ showPlayerInfo: true, paused: bool });
        this.setState({ showPlayerInfo: true, paused: bool });
    },

    showPlayerInfo() {
        this.setPlayerInfo(true);
    },

    hidePlayerInfo() {
        this.setPlayerInfo(false);
    },

    maybeHidePlayerInfo() {
        if (!this.state.paused) this.setPlayerInfo(false);
    },

    recalculateSizes() {

        const gameSpace = this.refs.gameSpace;
        const availableWidth = gameSpace.clientWidth;
        const availableHeight = gameSpace.clientHeight;

        const { field } = this.props.settings;
        const cellWidth = availableWidth / field.width;
        const cellHeight = availableHeight / field.height;
        const cellDimension = Math.min(cellWidth, cellHeight);

        const gridWidth = field.width * cellDimension;
        const gridHeight = field.height * cellDimension;

        this.setState({
            minimalistic: cellDimension < 5,
            sizes: {
                cells: {
                    height: cellDimension,
                    width: cellDimension,
                },
                grid: {
                    width: gridWidth,
                    height: gridHeight,
                    heightPercentage: gridHeight / availableHeight * 100,
                    widthPercentage: gridWidth / availableWidth * 100,
                },
                svg: {
                    width: 960,
                    height: 540,
                },
            },
        });
    },
};

const GameView = createView('GameView', lifeCycle, function (props) {

    const { currentState, state, errors, statesLength, settings, winner } = props;
    const { sizes }             = this.state;
    const { grid, svg }  = sizes;
    const { canvas, players }   = settings;

    const { marginRight, marginTop, marginBottom, marginLeft } = canvas;

    const wrapperStyle = {
        padding: `${marginTop}px ${marginLeft}px ${marginBottom}px ${marginRight}px`,
    };

    let winnerData;
    if (winner) {
        winnerData = {
            id: winner.id,
            message: `${ winner.name } won!`,
            avatar: <img
                className="Avatar"
                src={ `https://www.gravatar.com/avatar/${winner.emailHash}?s=44&d=mm` }
                alt="avatar"
            />,
        };
    } else {
        winnerData = {
            id: 'draw',
            message: 'It\'s a draw',
            avatar: null,
        };
    }

    const finished = currentState + 1 >= statesLength;

    return (
        <div key="GAME" className="LightRiders-wrapper">
            <div className="PlayerInformation-wrapper" style={ wrapperStyle }>
                <div ref="gameSpace" style={{ width: '100%', height: '100%' }}>
                    <div className="Players"
                         style={{
                             width: `calc(${grid.widthPercentage}% + 2px)`,
                             height: `calc(${grid.heightPercentage}% + 2px)`,
                         }} >
                        <svg className="GridBackground-wrapper">
                            { renderGrid({ settings, sizes }) }
                        </svg>
                        <div className="round-wrapper">
                            <span className="round">Round { state.round }</span>
                        </div>
                        { renderPlayerInfo({ players, isVisible: this.state.showPlayerInfo }) }
                    </div>
                </div>
            </div>
            <div className="GameState-wrapper" style={ wrapperStyle }>
                <svg
                    className="GameState"
                    viewBox={ `0 0 ${grid.width} ${grid.height}` }
                    preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <filter id="spaceship-glow" x="-2" y="-2" width="22" height="22">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                        </filter>
                        <filter id="glow" filterUnits="userSpaceOnUse">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                        <symbol id="Spaceship" viewBox="0 0 21 22">
                            <path
                                d="M10.5 4.5 L16.5 16.5 L10.44 12.75 L4.5 16.5 L10.5 4.5 Z"
                            />
                            <path
                                style={{ filter: 'url(#spaceship-glow)' }}
                                fill="white"
                                d="M10.5 4.5 L16.5 16.5 L10.44 12.75 L4.5 16.5 L10.5 4.5 Z"
                            />
                        </symbol>
                    </defs>
                    {
                        state.playerStates.map(
                            getPlayerStateRenderer({
                                settings, sizes, isVisible: this.state.showPlayerInfo,
                            })
                        )
                    }
                    { renderCrashes({ state, sizes }) }
                    { renderErrors({ state, errors, sizes }) }
                </svg>
            </div>
            <div className="VictoryScreen-wrapper" style={{ opacity: finished ? 1 : 0 }}>
                <div className="VictoryScreen-background" />
                <div className={ `VictoryScreen Player--${winnerData.id}` }>
                    <div className="VictoryScreen-component" style={{ marginTop: (grid.height + 20)  / 1.5 }}>
                        <div className="VictoryScreen-avatarWrapper">
                            { winnerData.avatar }
                        </div>
                        <p className="VictoryScreen-textMessage">{ winnerData.message }</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

function renderErrors({ state, errors, sizes }) {

    const cellDimension = sizes.cells.width;
    const halfCellDimension = cellDimension / 2;
    const toPixels = (n) => parseInt(n) * cellDimension;

    const errorCircles = [];
    errors.every(function (error) {
        if (error.round > state.round) return false;
        if (error.round === state.round && state.isSubState) return false;

        const cx = toPixels(error.x) + halfCellDimension;
        const cy = toPixels(error.y) + halfCellDimension;

        errorCircles.push(
            <circle
                className="ErrorCircle"
                key={ `error-${cx}-${cy}` }
                style={{ filter: 'url(#glow)' }}
                cx={ cx }
                cy={ cy }
                r="10"
            />
        );

        return true;
    });

    return errorCircles;
}

function renderCrashes({ state, sizes }) {

    const cellDimension = sizes.cells.width;
    const halfCellDimension = cellDimension / 2;
    const toPixels = (n) => n * cellDimension;

    return state.playerStates.map((state) => {
        const { isCrashed, name, lines } = state;
        const currentLine = lines[lines.length - 1];
        const x = currentLine.x2 + 1;
        const y = currentLine.y2;

        const cx = toPixels(x) - halfCellDimension;
        const cy = toPixels(y) + halfCellDimension;

        return isCrashed ? (
            <circle
                className="CrashCircle"
                key={ `crash-${name}` }
                style={{ filter: 'url(#glow)' }}
                cx={ cx }
                cy={ cy }
                r="10"
            />
        ) : null;
    });
}

function renderGrid({ settings, sizes }) {
    const grid = settings.field;

    const rowArray = Array.from({ length: grid.height });
    const arrayField = Array.from({ length: grid.width }).map(() => rowArray);

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

        const { isCrashed, lines, name } = props;
        const width = settings.field.width;
        const playerNo = index;
        const currentLine = lines[lines.length - 1];
        const { x1, x2, y1, y2 } = currentLine;
        let direction;

        if (x1 > x2) {
            direction = 'left';
        } else if (x2 > x1) {
            direction = 'right';
        } else if (y2 > y1) {
            direction = 'down';
        } else if (y1 > y2) {
            direction = 'up';
        } else if (x1 < width / 2) {
            direction = 'right'
        } else {
            direction = 'left';
        }

        const currentPosition = {
            direction,
            x: currentLine.x2,
            y: currentLine.y2,
        };

        return (
            <g key={ name } className={ `Player Player--${playerNo}` }>
                { lines.map(getPlayerLineRenderer({ name, settings, sizes })) }
                { renderSpaceShip({ isCrashed, currentPosition, sizes, playerNo }) }
            </g>
        );
    };
}

function renderSpaceShip({ isCrashed, currentPosition, sizes, playerNo }) {

    const { direction, x, y } = currentPosition;
    const cellDimension = sizes.cells.width;
    let rotation = 0;
    let transformXCorrection = 0;
    let transformYCorrection = 0;

    switch (direction) {
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
    const transformX = ((x + 1) * cellDimension) + transformXCorrection;
    const transformY = (y * cellDimension) + transformYCorrection;

    let fill = 'white';
    switch (playerNo) {
        case 0:
            fill = '#6aa0fc';
            break;
        case 1:
            fill = '#E419F9';
            break;
    }

    return (
        <use
            className="SpaceShip"
            xlinkHref="#Spaceship"
            transform={ `translate(${transformX}, ${transformY}) rotate(${rotation})`}
            style={{ opacity: isCrashed ? 0 : 1, fill }}
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

        x1 = (x1 * cellDimension) + halfCellDimension;
        y1 = (y1 * cellDimension) + halfCellDimension;
        x2 = (x2 * cellDimension) + halfCellDimension;
        y2 = (y2 * cellDimension) + halfCellDimension;

        return (
            <g key={ `line-${name}-${index}` }>
                <line
                    key={ `${name}-backgroundLine-${index}` }
                    className={ `line line--${modifierClass}` }
                    x1={ x1 }
                    y1={ y1 }
                    x2={ x2 }
                    y2={ y2 }
                />
                <line
                    key={ `${name}-line-${index}` }
                    className={ `line line--${modifierClass}` }
                    x1={ x1 }
                    y1={ y1 }
                    x2={ x2 }
                    y2={ y2 }
                    filter="url(#glow)"
                />
            </g>
        );
    };
}

function isOdd(num) {
    return num % 2;
}

function renderPlayerInfo({ players, isVisible }) {

    return players.map((player, index) => {
        const className = `Player Player--${index}`;
        const odd = isOdd(index);
        const playerCords = getPlayerInfoCords(index);
        const { top, bottom, left, right } = playerCords;

        const info = [
            <div className="AvatarWrapper">
                <img
                    className="Avatar"
                    src={ `https://www.gravatar.com/avatar/${player.emailHash}?s=45&d=mm` }
                    alt="avatar"
                />
            </div>,
            <p className="Player-name">
                { player.name }
            </p>,
        ];

        return (
            <div
                key={ `Player--${index}` }
                className={ className }
                style={{ opacity: isVisible ? 1 : 0, top, bottom, left, right }}
            >
                { info[odd ? 1 : 0] }
                { info[odd ? 0 : 1] }
            </div>
        );
    });
}

function getPlayerInfoCords(index) {
    if (index === 0) {
        return {
            top: '-42px',
            left: '-53px',
        };
    }

    if (index === 1) {
        return {
            top: '-42px',
            right: '-53px',
        };
    }

    if (index === 2) {
        return {
            bottom: '-30px',
            left: '-53px',
        };
    }

    if (index === 3) {
        return {
            bottom: '-30px',
            right: '-53px',
        };
    }
}

export default GameView;

export {
    isOdd,
    getRowRenderer,
    renderPlayerInfo,
};
