const express = require('express');
const route = express.Router();

const musicController = require('../app/controllers/MusicController');


route.get('/search', musicController.search);
route.get('/create', musicController.create);
route.post('/store', musicController.store);
route.get('/:id/edit', musicController.edit);
route.post('/handle-form-action', musicController.handleFormAction);
route.put('/:id', musicController.update);
route.patch('/:id/restore', musicController.restore);
route.delete('/:id', musicController.delete);
route.delete('/:id/hard', musicController.deleteHard);
route.get('/:slug', musicController.show);

module.exports = route;
