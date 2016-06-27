const fs          = require('fs');
const koa         = require('koa');
const body        = require('koa-body');
const serve       = require('koa-static');
const router      = require('koa-router')();
const publicDir   = './web/';

const app = koa();

app.use(serve('./web'));
app.use(body());

router.get('/data', function *(next) {

    try {
        this.body = fs.readFileSync('./src/js/data/dummyData.json');
        this.contentType = 'application/json';
    } catch (error) {
        this.body = error.message;
        this.status = 500;
    }

    // this.body = JSON.stringify({
    //     settings: {},
    //     states: getStates(10)
    // });

    yield next;
});

// function getStates (amount) {
//
//     return Array.from({ length: amount }, (_, index) => ({
//         data: index,
//         descriptor: {
//             value: `State ${index}`,
//             type: 1 === Math.round(Math.random()) ? 'error' : 'message'
//         }
//     }));
// }

app.use(router.routes());

app.listen(8989);
