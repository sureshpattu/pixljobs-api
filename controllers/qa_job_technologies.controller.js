'use strict';

const Model      = db.qa_job_technologies;
const waterfall  = require('async-waterfall');
const _          = require('underscore');
const ApiHelpers = require('../helpers/api.helpers');

function fetchSingle(_id, res) {
    Model.findOne({where:{id:_id}}).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

function createQAJobTechnologies(req, res, _qa_job_id) {
    waterfall(req.body.technologies.map(function(technology_id) {
        return function(lastItemResult, CB) {
            if(!CB) {
                CB             = lastItemResult;
                lastItemResult = null;
            }
            Model.create({qa_job_id:_qa_job_id, technology_id:technology_id}).then((_data) => {
                CB(null, []);
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
        if(!req.body.qa_job_id || !req.body.technologies) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        var _qa_job_id = req.body.qa_job_id;
        Model.findOne({where:{qa_job_id:_qa_job_id}}).then((_data_found) => {
            if(!_data_found) {
                createQAJobTechnologies(req, res, _qa_job_id);
            } else {
                Model.destroy({where:{qa_job_id:_qa_job_id}}).then((_dataDel) => {
                    createQAJobTechnologies(req, res, _qa_job_id);
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