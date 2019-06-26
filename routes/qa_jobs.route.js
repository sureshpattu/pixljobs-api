'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/qa_jobs.controller');

router
    .get('/', (req, res) => { Controller.index(req, res); })
    .get('/count/job-type', (req, res) => { Controller.countJobType(req, res); })
    .post('/', (req, res) => { Controller.create(req, res); })
    .post('/search', (req, res) => { Controller.search(req, res); })
    .get('/:id', (req, res) => { Controller.read(req, res); })
    .delete('/:id', (req, res) => { Controller.delete(req, res); })
    .put('/:id', (req, res) => { Controller.update(req, res);});

module.exports = router;
