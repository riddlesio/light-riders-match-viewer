(function () {

    const
        _           = require('lodash'),
        React       = require('react'),
        createView  = require('omniscient'),
        classNames  = require('classnames');

    var Overlay;

    Overlay = createView('Overlay', function (props) {

        var cx,
            message,
            { winner } = props;

        cx = classNames({
            'GoGame-overlay': true,
            'u-hidden': !winner
        });

        if ('none' === winner) {
            message = 'The game is a draw';
        }
        else {
            message = `${winner} won the game!`;
        }

        return (
            <g className={ cx }>
                <rect x="0" y="0" width="100%" height="100%" className="GoGame-overlayBackground"/>
                <text x="50%" y="50%" className="GoGame-overlayMessage">{ message }</text>
            </g>
        );
    });

    module.exports = Overlay;
}());
