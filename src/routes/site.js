const express = require('express');
const route = express.Router();

const siteController = require('../app/controllers/SiteController');

const middlewareRedirect = require('../app/middleware/redirectHome');


route.get('/login',middlewareRedirect.redirectHome, siteController.login);
route.post('/login', siteController.loginPost);


route.get('/logout', siteController.logout);

route.get('/register',middlewareRedirect.redirectHome, siteController.getRegister);
route.post('/register',middlewareRedirect.redirectHome, siteController.postRegister);


route.get('/', siteController.index);


module.exports = route;