'use strict';

const express = require('express');
const router  = express.Router();

const Controller = require('../controllers/applicant.controller');

router
    .get('/:id', (req, res) => { Controller.read(req, res); })
    .post('/reset-password/:id', (req, res) => { Controller.resetPassword(req, res); })
    .post('/reset-passcode/:id', (req, res) => { Controller.resetPassCode(req, res); })
    .post('/avatar/upload/:id', (req, res) => { Controller.photo(req, res); })
    .get('/photo/:image', (req, res) => { Controller.viewPhoto(req, res); })
    .put('/:id', (req, res) => { Controller.update(req, res) });

module.exports = router;
