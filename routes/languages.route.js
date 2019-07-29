'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/languages.controller');

router
    .get('/', (req, res) => { Controller.index(req, res); })
    .post('/', (req, res) => { Controller.create(req, res); })
    .post('/bulk', (req, res) => { Controller.createBulk(req, res); })
    .post('/search', (req, res) => { Controller.search(req, res); })
    .get('/:id', (req, res) => { Controller.read(req, res); })
    .delete('/:id', (req, res) => { Controller.delete(req, res); })
    .put('/:id', (req, res) => { Controller.update(req, res);});

module.exports = router;
