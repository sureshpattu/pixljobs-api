'use strict';

const express = require('express');
const router  = express.Router();

const AuthController = require('../controllers/recruiter_auth.controller');

router
    .post('/login', (req, res) => { AuthController.authenticate(req, res); })
    .post('/register', (req, res) => { AuthController.register(req, res); })
    .post('/login/check', (req, res) => { AuthController.checkToken(req, res); })
    .post('/verify/email', (req, res) => { AuthController.verifyEmail(req, res); });

module.exports = router;
