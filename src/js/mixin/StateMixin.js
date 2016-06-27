import _ from 'lodash';

const StateMixin = {

    applyTo: function (context) {

        var mixin,
            state;

        mixin = {
            /**
             * Sets the component state
             * @param {Object} diff
             * @return {AbstractUIComponent}
             */
            setState: function (diff) {

                var self = this,
                    currentState,
                    nextState,
                    shouldComponentUpdate = self.shouldComponentUpdate;

                currentState = state;
                nextState    = _.merge({}, state, diff);

                if (state && shouldComponentUpdate && !shouldComponentUpdate(state, nextState)) {
                    return self;
                }

                state = nextState;

                window.requestAnimationFrame(function () {

                    self.render(nextState, currentState);
                });

                return self;
            },

            /**
             * Returns the state
             * @return {Object}
             */
            getState: function () {
                return state;
            }
        };

        _.extend(context, mixin);
    }
};

export default StateMixin;
