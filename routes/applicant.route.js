'use strict';

const express      = require('express');
const router       = express.Router();
const crypto       = require('crypto');
const path         = require('path');
const multer       = require('multer');
const photoStorage = multer.diskStorage({
    destination:'uploads/applicant/photo',
    filename   :function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if(err) return cb(err);
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});
const photoUpload  = multer({
    storage   :photoStorage,
    fileFilter:function(req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});

const fileStorage = multer.diskStorage({
    destination:'uploads/applicant/doc',
    filename   :function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if(err) return cb(err);
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});
const fileUpload  = multer({
    storage   :fileStorage,
    fileFilter:function(req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.doc' && ext !== '.docx' && ext !== '.pdf') {
            return callback(new Error('Only doc and pdf files are allowed'))
        }
        callback(null, true)
    }
});

const Controller = require('../controllers/applicant.controller');

router
    .get('/:id', (req, res) => { Controller.read(req, res); })
    .post('/reset-password/:id', (req, res) => { Controller.resetPassword(req, res); })
    .post('/change-email/:id', (req, res) => { Controller.changeEmail(req, res); })
    .post('/photo/upload/:id', photoUpload.single('photo'), (req, res) => { Controller.photo(req, res); })
    .get('/photo/:image', (req, res) => { Controller.viewPhoto(req, res); })
    .delete('/photo/:image', (req, res) => { Controller.removePhoto(req, res); })
    .post('/resume/upload/:id', fileUpload.single('photo'), (req, res) => { Controller.resumeFile(req, res); })
    .get('/resume/:file', (req, res) => { Controller.viewResumeFile(req, res); })
    .delete('/resume/:file', (req, res) => { Controller.removeResumeFile(req, res); })
    .put('/:id', (req, res) => { Controller.update(req, res) });

module.exports = router;
