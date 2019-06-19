'use strict';

const Model      = db.categories;
const waterfall  = require('async-waterfall');
const _          = require('underscore');
const ApiHelpers = require('../helpers/api.helpers');
const BulkData   = require('../data/category');

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

    createBulk:(req, res) => {
        waterfall(BulkData.map(function(_obj) {
            return function(lastItemResult, CB) {
                if(!CB) {
                    CB             = lastItemResult;
                    lastItemResult = null;
                }
                Model.create({
                    name:_obj
                }).then((user) => {
                    CB(null, []);
                }).catch(_er => {
                    console.log(_er.message);
                    CB(null, []);
                });
            };
        }), function() {
            return res.status(200).json({message:'All done'});
        });
    },

    update:(req, res) => {
        Model.update(req.body, {where:{id:req.params.id}}).then((_data) => {
            fetchSingle(req.params.id, res);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },

    delete:(req, res) => {
        Model.destroy({where:{id:req.params.id}}).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};