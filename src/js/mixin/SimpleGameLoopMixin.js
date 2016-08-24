import _ from 'lodash';
import { event } from '@riddles/match-viewer';

const { PlaybackEvent } = event;

const SimpleGameLoopMixin = {

    applyTo: function (context) {

        const mixin = {

            /**
             * Moves the game forward by one step
             */
            moveForward: function () {

                const { currentState } = this.getState();

                if (currentState !== this.states.length - 1) {

                    this.triggerStateChange(currentState + 1);
                } else {

                    this.pause();
                }
            },

            /**
             * Moves the game forward by one round
             */
            roundForward: function () {

                const state                 = this.getState();
                const states                = this.states;
                const currentStateNumber    = state.currentState;
                const currentState          = states[currentStateNumber];
                let nextStateNumber         = currentStateNumber + 1;
                let nextState               = states[nextStateNumber];

                const targetRound = currentState.isSubState
                    ? currentState.round
                    : currentState.round + 1;

                while (nextState &&
                    (nextState.isSubState || nextState.round < targetRound)) {
                    nextStateNumber++;
                    nextState = states[nextStateNumber];
                }

                if (nextStateNumber >= states.length) return;

                this.triggerStateChange(nextStateNumber);
            },

            /**
             * Moves the game forward to the last state
             */
            fastForward: function () {

                const nextState = this.states.length - 1;

                this.triggerStateChange(nextState);
            },

            /**
             * Moves the game backward by one round
             */
            roundBackward: function () {

                const state                 = this.getState();
                const states                = this.states;
                const currentStateNumber    = state.currentState;
                const currentState          = states[currentStateNumber];
                let previousStateNumber     = currentStateNumber - 1;
                let previousState           = states[previousStateNumber];

                while (previousState && previousState.round >= currentState.round) {
                    previousStateNumber--;
                    previousState = states[previousStateNumber];
                }

                if (previousStateNumber < 0) return;

                this.triggerStateChange(previousStateNumber);
            },

            /**
             * Moves the game backward to the first state
             */
            fastBackward: function () {

                const nextState = 0;

                this.triggerStateChange(nextState);
            },

            /**
             * Starts the game loop
             */
            play: function () {

                PlaybackEvent.trigger(PlaybackEvent.PLAYING);
            },

            /**
             * Stops the game loop
             */
            pause: function () {

                PlaybackEvent.trigger(PlaybackEvent.PAUSED);
            },

            triggerStateChange: function (nextState) {

                PlaybackEvent.trigger(PlaybackEvent.GOTO, { state: nextState });
            },

            setMove: function ({ state }) {

                if (-1 < state && state < this.states.length) {

                    this.setState({ currentState: state });
                    return;
                }

                throw new Error(`State ${state} is out of bounds`);
            },
        };

        _.extend(context, mixin);
    },
};

const handleTimer = function () {

};

export default SimpleGameLoopMixin;
