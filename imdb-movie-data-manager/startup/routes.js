const express = require('express');

const index = require('../routes/index');
const imdb = require('../routes/imdb');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/', index);
  app.use('/api/imdb', imdb);
  app.use(error);
};