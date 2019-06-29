'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/auth.controller');

router
    .post('/user', (req, res) => { Controller.checkUser(req, res); });

module.exports = router;
