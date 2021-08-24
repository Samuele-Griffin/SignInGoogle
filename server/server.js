require('../config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const hbs = require('hbs');
const colors = require('colors');
let bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../public')));

app.use(require('../routes/index'));

mongoose.connect(process.env.URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (err, conexion) => {
    if (err) {
        console.log(err.red);
    }
    console.log("Conectado a la base de datos en el puerto 27017".green);
});

app.listen(process.env.PORT, () => {
    console.log("Puerto Escuchado : ".green + process.env.PORT);
});