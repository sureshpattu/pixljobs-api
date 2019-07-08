'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/admin.controller');

router
    .get('/:id', (req, res) => { Controller.read(req, res); })
    .get('/qa-jobs/count', (req, res) => { Controller.jobsCount(req, res); })
    .post('/qa-jobs/search', (req, res) => { Controller.search(req, res); })
    .post('/publish/job/:id', (req, res) => { Controller.publishJob(req, res); })
    .post('/un-publish/job/:id', (req, res) => { Controller.unPublishJob(req, res); });

module.exports = router;
