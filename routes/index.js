const express = require('express');
const app = express();

app.use(require('../abm/usuarios'));
app.use(require('../js/login'));

module.exports = app;