'use strict';

const Model           = db.benefits;
const CompanyBenefits = db.company_benefits;
const waterfall       = require('async-waterfall');
const async           = require('async');
const _               = require('underscore');
const ApiHelpers      = require('../helpers/api.helpers');
const sequelize       = require('sequelize');
const Op              = sequelize.Op;

function fetchSingle(_id, res) {
    Model.findOne({where:{id:_id}}).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

function createBenefits(req, res, _company_id) {
    waterfall(req.body.benefits.map(function(_obj) {
        return function(lastItemResult, CB) {
            if(!CB) {
                CB             = lastItemResult;
                lastItemResult = null;
            }
            let _query      = {};
            _query[Op.or]   = [];
            let lookupValue = _obj.toLowerCase();
            _query[Op.or].push({
                id:sequelize.where(sequelize.fn('LOWER', db.sequelize.col('id')), 'LIKE',
                    '%' + lookupValue + '%')
            });
            _query[Op.or].push({
                name:sequelize.where(sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE',
                    '%' + lookupValue + '%')
            });
            Model.findOne({where:_query}).then((_data) => {
                if(!_data) {
                    Model.create({name:_obj}).then((_data) => {
                        CompanyBenefits.create({company_id:_company_id, benefit_id:_data.id}).then((_data) => {
                            CB(null, []);
                        }).catch(_err => {
                            ApiHelpers.error(res, _err);
                        });
                    }).catch(_err => {
                        ApiHelpers.error(res, _err);
                    });
                } else {
                    CompanyBenefits.create({company_id:_company_id, benefit_id:_data.id}).then((_data) => {
                        CB(null, []);
                    }).catch(_err => {
                        ApiHelpers.error(res, _err);
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
        if(!req.body.benefits && !req.body.company_id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }

        let _company_id = req.body.company_id;
        CompanyBenefits.findOne({
            where:{company_id:_company_id}
        }).then((_compBen) => {
            if(!_compBen) {
                createBenefits(req, res, _company_id);
            } else {
                CompanyBenefits.destroy({where:{company_id:_company_id}}).then((_data) => {
                    createBenefits(req, res, _company_id);
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