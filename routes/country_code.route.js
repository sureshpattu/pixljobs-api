'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/country_code.controller');

router
    .get('/', (req, res) => { Controller.index(req, res); });

module.exports = router;
