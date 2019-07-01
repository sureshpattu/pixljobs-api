'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/admin.controller');

router
    .post('/verify/job/:id', (req, res) => { Controller.verifyJob(req, res); });

module.exports = router;
