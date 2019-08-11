'use strict';

const Model      = db.applicant_cities;
const Cities     = db.cities;
const waterfall  = require('async-waterfall');
const _          = require('underscore');
const ApiHelpers = require('../helpers/api.helpers');
const sequelize  = require('sequelize');
const Op         = sequelize.Op;

function fetchSingle(_id, res) {
    Model.findOne({where:{id:_id}}).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

function createAppCities(req, res, _applicant_id) {

    waterfall(req.body.cities.map(function(_obj) {
        return function(lastItemResult, CB) {
            if(!CB) {
                CB             = lastItemResult;
                lastItemResult = null;
            }
            Cities.findOne({where:{id:_obj.id}}).then((_data) => {
                if(!_data) {
                    Cities.create({city:_obj.city}).then((_data) => {
                        Model.create({applicant_id:_applicant_id, city_id:_data.id, level:_obj.level})
                             .then((_data) => {
                                 CB(null, []);
                             }).catch(_err => {
                            CB(null, []);
                        });
                    }).catch(_err => {
                        CB(null, []);
                    });
                } else {
                    Model.create({applicant_id:_applicant_id, city_id:_data.id, level:_obj.level})
                         .then((_data) => {
                             CB(null, []);
                         }).catch(_err => {
                        CB(null, []);
                    });
                }
            }).catch(_err => {
                CB(null, []);
            });
        };
    }), function() {
        ApiHelpers.success(res, null, 'success');
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
        if(!req.body.applicant_id || !req.body.cities) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        var _applicant_id = req.body.applicant_id;
        Model.findOne({where:{applicant_id:_applicant_id}}).then((_data_found) => {
            if(!_data_found) {
                createAppCities(req, res, _applicant_id);
            } else {
                Model.destroy({where:{applicant_id:_applicant_id}}).then((_dataDel) => {
                    createAppCities(req, res, _applicant_id);
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
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