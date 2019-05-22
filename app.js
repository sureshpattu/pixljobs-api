'use strict';

const express         = require('express');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const bodyParser      = require('body-parser');
const models          = require('./models');
const routes          = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit:'100mb', extended:true}));
app.use(bodyParser.json({limit:'100mb'}));
app.use(cookieParser());

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next()
});

routes(app);

models.sequelize.sync().then(() => {
    console.log('Database connected successfully!');
}).catch((err) => {
    console.log(err, 'Something went wrong with the Database!');
});

app.use((err, res) => {
    res.status(err.status || 500);
    res.json({message:err.message});
});

module.exports = app;
