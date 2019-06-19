'use strict';

const express = require('express');
const router  = express.Router();
const crypto  = require('crypto');
const path    = require('path');
const multer  = require('multer');
const storage = multer.diskStorage({
    destination:'uploads/recruiter/photo',
    filename   :function(req, file, cb) {
        crypto.pseudoRandomBytes(16, function(err, raw) {
            if(err) return cb(err);
            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});
const upload  = multer({storage:storage});

const Controller = require('../controllers/recruiter.controller');

router
    .get('/:id', (req, res) => { Controller.read(req, res); })
    .post('/reset-password/:id', (req, res) => { Controller.resetPassword(req, res); })
    .post('/photo/upload', upload.single('photo'), (req, res) => { Controller.photo(req, res); })
    .get('/photo/:image', (req, res) => { Controller.viewPhoto(req, res); })
    .delete('/photo/:image', (req, res) => { Controller.removePhoto(req, res); })
    .put('/:id', (req, res) => { Controller.update(req, res) });

module.exports = router;
