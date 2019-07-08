'use strict';

const Model      = db.companies;
const waterfall  = require('async-waterfall');
const _          = require('underscore');
const ApiHelpers = require('../helpers/api.helpers');
const path       = require('path');

function fetchSingle(_id, res) {
    Model.findOne({where:{id:_id}}).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

module.exports = {
    index:(req, res) => {
        Model.findAll({where:{}}).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },

    read:(req, res) => {
        fetchSingle(req.params.id, res);
    },

    create:(req, res) => {
        if(!req.body.name) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.create(req.body).then((_data) => {
            fetchSingle(_data.id, res);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },

    update     :(req, res) => {
        Model.update(req.body, {where:{id:req.params.id}}).then((_data) => {
            fetchSingle(req.params.id, res);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    photo      :(req, res) => {
        if(req.file) {
            let data = {
                logo:req.file.filename
            };
            Model.update(data, {where:{id:req.params.id}}).then((_data) => {
                ApiHelpers.success(res, _data);
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
        } else {
            return ApiHelpers.error(res, true, 'Please select valid file');
        }
    },
    viewPhoto  :(req, res) => {
        return res.sendFile(`${path.resolve(__dirname, '../', 'uploads/company/photo/', req.params.image)}`);
    },
    removePhoto:(req, res) => {

        let data = {
            logo:null
        };

        let filePath = `${path.resolve(__dirname, '../', 'uploads/company/photo/', req.params.image)}`;
        fs.unlinkSync(filePath);

        Model.update(data, {where:{logo:req.params.image}}).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    delete     :(req, res) => {
        Model.destroy({where:{id:req.params.id}}).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};