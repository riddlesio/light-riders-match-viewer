(function () {

    const
        _           = require('lodash'),
        React       = require('react'),
        createView  = require('omniscient'),
        FieldView  = require('./FieldView.jsx'),
        Overlay     = require('./Overlay.jsx').jsx;

    var GameView;

    GameView = createView('GameView', function (props) {
        var { state, settings } = props,
            { winner, illegalMove, player} = state,
            { players }         = settings,
            player1class        = "", 
            player2class        = "",
            illegalMoveClass    = "";

        console.log(state);
        if (player === 1) {
            player1class = " active";
            illegalMoveClass = " GoGame-player1Color";
        } else if (player === 2) {
            player2class = " active";
            illegalMoveClass = " GoGame-player2Color";
        }

        return (
            <svg className="GoGame" viewBox="0 0 1200 705" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <symbol id="GoGame-cell-player1" viewBox="0 0 37 37">
                      <rect
                         style={{ fill:"#ffff00", "fillOpacity": 1, stroke: "none" }}
                         width="37"
                         height="37"
                         x="0"
                         y="0" />
                    </symbol>
                    <symbol id="GoGame-cell-player2" dangerouslySetInnerHTML={{
                        __html: `<image width="30" height="30" xlink:href="./img/GoGame-cell-player2.svg" />`
                    }} />
                    <symbol id="GoGame-cell-player3" dangerouslySetInnerHTML={{
                        __html: `<image width="30" height="30" xlink:href="./img/GoGame-cell-player3.svg" />`
                    }} />
                    <symbol id="GoGame-cell-player4" dangerouslySetInnerHTML={{
                        __html: `<image width="30" height="30" xlink:href="./img/GoGame-cell-player4.svg" />`
                    }} />
                    <symbol id="GoGame-cell-wall" dangerouslySetInnerHTML={{
                        __html: `<image width="30" height="30" xlink:href="./img/GoGame-cell-wall.svg" />`
                    }} />
                    <symbol id="GoGame-cell-empty" dangerouslySetInnerHTML={{
                        __html: `<image width="30" height="30" xlink:href="./img/GoGame-cell-empty.svg" />`
                    }} />
                    <symbol id="GoGame-board" dangerouslySetInnerHTML={{
                        __html: `<image width="640" height="640" xlink:href="./img/GoGame-board.svg" />`
                    }} />
                    <symbol id="GoGame-avatar1" dangerouslySetInnerHTML={{
                        __html: `
                        <image width="120" height="120" clip-path="url(#roundedclip)" xlink:href="http://gravatar.com/avatar/${ players.emailHash[0] }?s=100&amp;d=mm" />
                        <rect width="120" height="120" rx="10" x="1" y="1" style="stroke:#2ba9fa;stroke-width:2;fill-opacity:0;stroke-opacity:1" />
                        `
                    }} />
                    <symbol id="GoGame-avatar2" dangerouslySetInnerHTML={{
                        __html: `
                        <image width="120" height="120" clip-path="url(#roundedclip)" xlink:href="http://gravatar.com/avatar/${ players.emailHash[1] }?s=100&amp;d=mm" />
                        <rect width="120" height="120" rx="10" x="1" y="1" style="stroke:#fb4f50;stroke-width:2;fill-opacity:0;stroke-opacity:1" />
                        `
                    }} />
                    <clipPath id="roundedclip">
                        <rect x="0" y="0" width="120" height="120" rx="10"/>
                    </clipPath>
                </defs>

                { FieldView(state) }

                <g dangerouslySetInnerHTML={{
                    __html: `<use x="70" y="60" xlink:href="#GoGame-avatar1" />`
                }} />
                <g dangerouslySetInnerHTML={{
                    __html: `<use x="1010" y="60" xlink:href="#GoGame-avatar2" />`
                }} />


                <text
                    x={ "130" }
                    y={ "215" }
                    className={"GoGame-playerName GoGame-player1Color" + player1class }>{ players.names[0] }</text>
                <text
                    x={ "1070" }
                    y={ "215" }
                    className={"GoGame-playerName GoGame-player2Color" + player2class }>{ players.names[1] }</text>


                <text x="50%" y="60" className={"GoGame-illegalMove" + illegalMoveClass }>{ illegalMove }</text>
                <Overlay winner={ winner } />

            </svg>
        );
    });

    module.exports = GameView;
}());

