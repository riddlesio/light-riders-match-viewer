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

                const states = this.states;
                const { currentState } = this.getState();
                const currentRound = states[currentState].round;

                let nextState = _.findIndex(states, { round: currentRound + 1 });

                if (-1 === nextState) {

                    nextState = states.length - 1;
                }

                this.triggerStateChange(nextState);
            },

            /**
             * Moves the game forward to the last state
             */
            fastForward: function () {

                const nextState = this.states.length - 1;

                this.triggerStateChange(nextState);
            },

            /**
             * Moves the game backward by one step
             */
            moveBackward: function () {

                const { currentState } = this.getState();

                if (0 < currentState) {

                    this.triggerStateChange(currentState - 1);
                }
            },

            /**
             * Moves the game backward by one round
             */
            roundBackward: function () {

                const states = this.states;
                const { currentState } = this.getState();
                const currentRound  = states[currentState].round;

                let nextState = _.findIndex(states, { round: currentRound - 1 });

                if (-1 === nextState) {
                    nextState = 0;
                }

                this.triggerStateChange(nextState);
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

export default SimpleGameLoopMixin;
