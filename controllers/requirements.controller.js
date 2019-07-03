'use strict';

const Model             = db.requirements;
const QAJobRequirements = db.qa_job_requirements;
const waterfall         = require('async-waterfall');
const _                 = require('underscore');
const ApiHelpers        = require('../helpers/api.helpers');
const sequelize         = require('sequelize');
const Op                = sequelize.Op;

function fetchSingle(_id, res) {
    Model.findOne({where:{id:_id}}).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

function createRequirements(req, res, _qa_job_id) {
    waterfall(req.body.requirements.map(function(_obj) {
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
                desc:sequelize.where(sequelize.fn('LOWER', db.sequelize.col('desc')), 'LIKE',
                    '%' + lookupValue + '%')
            });
            Model.findOne({where:_query}).then((_data) => {
                if(!_data) {
                    Model.create({desc:_obj}).then((_data) => {
                        QAJobRequirements.create({qa_job_id:_qa_job_id, requirement_id:_data.id}).then((_data) => {
                            CB(null, []);
                        }).catch(_err => {
                            ApiHelpers.error(res, _err);
                        });
                    }).catch(_err => {
                        ApiHelpers.error(res, _err);
                    });
                } else {
                    QAJobRequirements.create({qa_job_id:_qa_job_id, requirement_id:_data.id}).then((_data) => {
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
        if(!req.body.requirements && !req.body.qa_job_id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }

        let _qa_job_id = req.body.qa_job_id;

        QAJobRequirements.findOne({
            where:{qa_job_id:_qa_job_id}
        }).then((_compBen) => {
            if(!_compBen) {
                createRequirements(req, res, _qa_job_id);
            } else {
                QAJobRequirements.destroy({where:{qa_job_id:_qa_job_id}}).then((_data) => {
                    createRequirements(req, res, _qa_job_id);
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