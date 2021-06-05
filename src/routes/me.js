const express = require('express');
const route = express.Router();

const meController = require('../app/controllers/MeController');


route.get('/stored/music', meController.storedMusic);
route.get('/trash/music', meController.trashMusic);


module.exports = route;
