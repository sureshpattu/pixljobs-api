'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/admin.controller');

router
    .get('/:id', (req, res) => { Controller.read(req, res); })
    .post('/qa-jobs/search', (req, res) => { Controller.search(req, res); })
    .post('/verify/job/:id', (req, res) => { Controller.verifyJob(req, res); });

module.exports = router;
