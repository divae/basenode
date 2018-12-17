
const express = require('express');
const app = express();

require('../routes/baseRoutes')(app);

module.exports = app;