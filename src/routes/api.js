const express = require('express');
const route = express.Router();

const apiController = require('../app/controllers/ApiController');


route.get('/musics', apiController.getData);


module.exports = route;
