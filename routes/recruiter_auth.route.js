'use strict';

const express = require('express');
const router  = express.Router();

const AuthController = require('../controllers/recruiter_auth.controller');

router
    .post('/login', (req, res) => { AuthController.authenticate(req, res); })
    .post('/register', (req, res) => { AuthController.register(req, res); })
    .post('/login/check', (req, res) => { AuthController.checkToken(req, res); })
    .post('/verify/email/token', (req, res) => { AuthController.verifyEmail(req, res); })
    .post('/reset/password', (req, res) => { AuthController.resetPassword(req, res); })
    .post('/reset/password/token', (req, res) => { AuthController.ResetPasswordToken(req, res); })
    .post('/get-otp', (req, res) => { AuthController.getOTP(req, res); })
    .post('/check-otp', (req, res) => { AuthController.checkOTP(req, res); });

module.exports = router;
