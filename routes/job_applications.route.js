'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/job_applications.controller');

router
    .get('/', (req, res) => { Controller.index(req, res); })
    .post('/', (req, res) => { Controller.create(req, res); })
    .post('/search', (req, res) => { Controller.search(req, res); })
    .post('/check', (req, res) => { Controller.check(req, res); })
    .post('/status/:id', (req, res) => { Controller.status(req, res); })
    .get('/:id', (req, res) => { Controller.read(req, res); })
    .delete('/:id', (req, res) => { Controller.delete(req, res); })
    .put('/:id', (req, res) => { Controller.update(req, res);});

module.exports = router;
