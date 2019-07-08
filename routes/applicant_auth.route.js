'use strict';

const express = require('express');
const router  = express.Router();

const AuthController = require('../controllers/applicant_auth.controller');

router
    .post('/login', (req, res) => { AuthController.authenticate(req, res); })
    .post('/register', (req, res) => { AuthController.register(req, res); })
    .post('/login/check', (req, res) => { AuthController.checkToken(req, res); })
    .post('/verify/email/token', (req, res) => { AuthController.verifyEmailToken(req, res); })
    .post('/verify/email', (req, res) => { AuthController.verifyEmail(req, res); })
    .post('/get-otp', (req, res) => { AuthController.getOTP(req, res); })
    .post('/check-otp', (req, res) => { AuthController.checkOTP(req, res); })
    .post('/forgot/password', (req, res) => { AuthController.forgotPassword(req, res); })
    .post('/forgot/password/token', (req, res) => { AuthController.forgotPasswordToken(req, res); });

module.exports = router;
