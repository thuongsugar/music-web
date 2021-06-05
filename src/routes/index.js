const siteRoute  = require('./site');
const musicRoute  = require('./music');
const meRoute  = require('./me');
const apiRoute  = require('./api');

const middlewareAuth = require('../app/middleware/authLogin');
const middlewareGetUser = require('../app/middleware/valuelocals');

function route(app){

    app.use(middlewareGetUser.valueLocal);
    app.use('/music', middlewareAuth.authLogin, musicRoute);
    app.use('/me' , middlewareAuth.authLogin , meRoute);

      
    //   app.get('/news', (req, res) => {
    //     console.log(req.query);
    //     res.render('contact');
    //   })
    app.use('/api', apiRoute);
     app.use('/', siteRoute);
}
module.exports = route;
