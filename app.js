'use strict';

const express      = require('express');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const models       = require('./models');
const routes       = require('./routes');
const env          = process.env.NODE_ENV || 'development';
const config       = require(__dirname + '/config/config.json')[env];
const app          = express();

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

const mysql = require('mysql2');

let mysqlCon = mysql.createConnection({
    host    :config.host,
    user    :config.username,
    password:config.password
});

mysqlCon.connect(function(err, _res) {

    if(err) {
        console.log(err.message);
    } else {

        //Check Database
        mysqlCon.query('SHOW DATABASES LIKE \'' + config.database + '\'', function(err, result) {
            if(!err && result && !result.length) {

                //Create new Database
                mysqlCon.query('CREATE DATABASE ' + config.database, function(err, result) {
                    if(!err) {

                        //Sync sequelize js model files
                        models.sequelize.sync().then(() => {
                            require('./config/seed_data').index(function() {
                                console.log('Database created and model files are synced successfully!');
                            });
                        }).catch((err) => {
                            console.log(err, 'Something went wrong with the Database!');
                        });

                    }
                });
            } else if(!err && result && result.length) {
                models.sequelize.sync().then(() => {
                    console.log('Database connected and model files are synced successfully!');
                }).catch((err) => {
                    console.log(err, 'Something went wrong with the Database!');
                });
            } else {
                console.log(err.message);
            }
        });
    }

});

app.use((err, res) => {
    res.status(err.status || 500);
    res.json({message:err.message});
});

module.exports = app;
