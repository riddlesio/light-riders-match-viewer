(function (undefined) {

    const
        React      = require('react'),
        createView = require('omniscient'),
        classNames = require('classnames');

    var Line;

    Line = createView(function (data) {
        var { row, column, x1, y1, x2, y2, value } = data;

        
        var color = "black";
        if (value == 17) { color = "yellow"; }
        if (value == 18) { color = "cyan"; }

        //var xlinkHref = "GoGame-cell-player1";
        if (value == 5) xlinkHref = "white";
        //if (value == 0) xlinkHref = "GoGame-cell-empty";

        var d = `M${x1},${y1} L${x2},${y2}`;


        return (
            <g>
                <path d={ d } stroke= { color } strokeWidth="5"/>
            </g>
         );
    });

    // Private functions
    module.exports = Line;
}());
