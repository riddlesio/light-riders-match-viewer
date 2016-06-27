(function (undefined) {

    const
        React      = require('react'),
        createView = require('omniscient'),
        classNames = require('classnames');

    var Cell;

    Cell = createView(function (data) {
        var { row, column, x, y, width, height, value } = data;

        var xlinkHref = "GoGame-cell-player" + value;

        if (value == 17) { xlinkHref = "GoGame-cell-player1"; }
        if (value == 18) { xlinkHref = "GoGame-cell-player2"; }

        if (value > 0) console.log(value);
        //var xlinkHref = "GoGame-cell-player1";
        if (value == 5) xlinkHref = "GoGame-cell-wall";
        //if (value == 0) xlinkHref = "GoGame-cell-empty";

        var id="row" + row + "col" + column;

        return (
            <g
            key="key"
            className="GoGame-cell" >
                 <g id={ id } dangerouslySetInnerHTML={{
                     __html: `<use x="${ x }" y="${ y }" width="${ width }" height="${ height }" xlink:href="#${ xlinkHref }" />`
                 }} />
            </g>
         );
    });

    // Private functions
    module.exports = Cell;
}());
