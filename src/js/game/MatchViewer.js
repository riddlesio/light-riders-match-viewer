import React                    from 'react';
import ReactDOM                 from 'react-dom';
import { createGame, event }    from '@riddles/match-viewer';
import StateMixin               from '../mixin/StateMixin';
import GameLoopMixin            from '../mixin/SimpleGameLoopMixin';
import GameView                 from '../view/GameView.jsx';
import defaults                 from '../data/gameDefaults.json';
import { parseSettings, parseStates, parsePlayerNames } from '../io/Parser';

const { PlaybackEvent } = event;

/**
 * MatchViewer class
 * @constructor
 */
const MatchViewer = createGame({

    /**
     * MatchViewer construct function
     * Automatically executed when instantiating the HelloWorldGame class
     * @param  {Object} options
     */
    construct: function (options) {

        window.viewer = this;
        registerEventListeners(this);
    },

    /**
     * Cleans up anything which might cause memory leaks
     */
    destroy: function () {

        releaseEventListeners(this);
        delete window.viewer;
    },

    getDefaults: function () {
        return defaults;
    },

    /**
     * Parses the received data and starts the game loop
     * @param  {Object} data
     */
    handleData: function (data) {
        const { matchData, playerData } = data;
        const currentState = 0;
        const settings = parseSettings(data, defaults);
        const parsedStates = parseStates(matchData, settings);
        const playerNames = parsePlayerNames(playerData);
        const { states } = parsedStates;

        this.settings = settings;
        this.states = states;
        this.parsedStates = parsedStates;
        this.playerNames = playerNames;

        this.triggerStateChange(currentState);
        this.play();
    },

    /**
     * Renders the game
     * @param {Object} state
     * @param {Object} prevState
     */
    render: function (state, prevState) {

        const { currentState } = state;
        const { parsedStates, settings } = this;
        const { errors, states, winner } = parsedStates;

        const props = {
            currentState,
            settings,
            winner,
            errors,
            state: states[currentState],
            statesLength: states.length,
        };

        ReactDOM.render(<GameView { ...props }/>, this.getDOMNode());
    },
}, [StateMixin, GameLoopMixin]);

/**
 * Register the event listeners
 * @param {AbstractGame} context
 */
function registerEventListeners(context) {

    PlaybackEvent.on(PlaybackEvent.PLAY, context.play, context);
    PlaybackEvent.on(PlaybackEvent.PAUSE, context.pause, context);
    PlaybackEvent.on(PlaybackEvent.FORWARD, context.moveForward, context);
    PlaybackEvent.on(PlaybackEvent.ROUNDFORWARD, context.roundForward, context);
    PlaybackEvent.on(PlaybackEvent.GOTO, context.setMove, context);
    PlaybackEvent.on(PlaybackEvent.FAST_FORWARD, context.fastForward, context);
    PlaybackEvent.on(PlaybackEvent.BACKWARD, context.roundBackward, context);
    PlaybackEvent.on(PlaybackEvent.FAST_BACKWARD, context.fastBackward, context);
}

/**
 * Release the event listeners
 * @param {AbstractGame} context
 */
function releaseEventListeners(context) {

    PlaybackEvent.off(PlaybackEvent.PLAY, context.play, context);
    PlaybackEvent.off(PlaybackEvent.PAUSE, context.pause, context);
    PlaybackEvent.off(PlaybackEvent.FORWARD, context.moveForward, context);
    PlaybackEvent.off(PlaybackEvent.ROUNDFORWARD, context.roundForward, context);
    PlaybackEvent.off(PlaybackEvent.GOTO, context.setMove, context);
    PlaybackEvent.off(PlaybackEvent.FAST_FORWARD, context.fastForward, context);
    PlaybackEvent.off(PlaybackEvent.BACKWARD, context.roundBackward, context);
    PlaybackEvent.off(PlaybackEvent.FAST_BACKWARD, context.fastBackward, context);
}

export default MatchViewer;
