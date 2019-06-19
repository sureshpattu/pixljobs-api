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
        where:{id:req.params.id}
    }).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

module.exports = {
    read         :(req, res) => {
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

    update     :(req, res) => {
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
    photo      :(req, res) => {
        if(req.file) {
            let profile = {
                file     :req.file.filename,
                file_type:req.file.mimetype
            };
            ApiHelpers.success(res, profile);
        } else {
            return ApiHelpers.error(res, true, 'Please select valid file');
        }
    },
    viewPhoto  :(req, res) => {
        return res.sendFile(`${path.resolve(__dirname, '../', 'uploads/applicant/photo/', req.params.image)}`);
    },
    removePhoto:(req, res) => {
        let filePath = `${path.resolve(__dirname, '../', 'uploads/clinic/photo/', req.params.image)}`;
        fs.unlinkSync(filePath);
        ApiHelpers.success(res, {status:'success', code:200});
    },
    delete     :(req, res) => {
        if(!req.params.id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{id:req.params.id}}).then((_data) => {
            if(_data && _data.file) {
                let filePath = `${path.resolve(__dirname, '../', 'uploads/applicant/photo/', _data.file)}`;
                fs.unlinkSync(filePath);
                Model.destroy({where:{id:req.params.id}}).then((_data) => {
                    ApiHelpers.success(res, {status:'success', code:200});
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            } else {
                Model.destroy({where:{id:req.params.id}}).then((_data) => {
                    ApiHelpers.success(res, {status:'success', code:200});
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};
