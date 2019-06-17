'use strict';

const Model      = db.applicants;
const ImgHelpers = require('./../helpers/image.upload.helpers');
const ApiHelpers = require('./../helpers/api.helpers');
const _          = require('underscore');
const path       = require('path');
const sequelize  = require('sequelize');
const crypto2    = require('crypto2');
const config     = require('../config/config');

function fetchSingle(req, res) {
    Model.findOne({
        where  :{id:req.params.id}
    }).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

module.exports = {
    read:(req, res) => {
        fetchSingle(req, res);
    },
    resetPassword:async(req, res) => {
        let _body = {
            password:req.body.password
        };
        if(req.body.password) {
            _body.password = await crypto2.encrypt(req.body.password, config.hashSalt2, config.hashIV);
        }
        Model.update(_body, {where:{id:req.params.id}, individualHooks:true}).then((_data) => {
            fetchSingle(req, res);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },

    update:(req, res) => {
        let data = req.body;
        if(data.password) {
            delete data.password;
        }
        if(data.passcode) {
            delete data.passcode;
        }
        if(data.first_name || data.last_name) {
            data.name = data.first_name + ' ' + data.last_name;
        }
        Model.update(data, {where:{id:req.params.id}}).then((_data) => {
            fetchSingle(req, res);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    photo:(req, res) => {
        ImgHelpers.uploadImage(req.body.src, '/applicant/photo', function(_image_path) {
            res.json({
                error:false,
                data :{path:_image_path ? _image_path : null},
                msg  :'success'
            });
        });
    },
    viewPhoto:(req, res) => {
        let _url = path.resolve(__dirname, '../uploads/applicant/photo/');
        return res.sendFile(_url + '/' + req.params.image);
    }
};
