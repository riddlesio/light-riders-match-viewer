import 'babel-polyfill';
/* @ifdef LOCAL */
import dataProvider  from '@riddles/match-viewer/lib/dataProvider/fixtureDataProvider';
import data from './data/dummyData.json';
/* @endif */
/* @ifdef AI_GAMES **
 import dataProvider  from '@riddles/match-viewer/lib/dataProvider/aiGamesDataProvider';
 /* @endif */
/* @ifdef RIDDLES **
 import dataProvider  from '@riddles/match-viewer/lib/dataProvider/riddlesDataProvider';
 /* @endif */
import MatchViewer from './game/MatchViewer';

let displayChrome = true;

/* @ifdef AI_GAMES */
if (window.frameElement.getAttribute('data-indexgame')) {
    displayChrome = false;
}
/* @endif */

const game = new MatchViewer({
    name: 'hello-world',
    dataProvider: dataProvider(data),
    player: {
        // Determines whether they player's chrome should be displayed
        chrome: displayChrome,

        // Determines whether view selection should be possible
        viewstack: false,

        // A number between 0 and 1
        aspectRatio: 1920 / 1080,

        // Time between each step when playing
        playbackTimeout: {
            min: 16,
            max: 750,
        },
    },
});
