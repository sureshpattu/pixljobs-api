'use strict';

const Model      = db.qa_job_categories;
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
        if(!req.body.qa_job_id || !req.body.category_id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{qa_job_id:req.body.qa_job_id}}).then((_data_found) => {
            if(!_data_found) {
                Model.create(req.body).then((_data) => {
                    fetchSingle(_data.id, res);
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            } else {
                Model.destroy({where:{qa_job_id:req.body.qa_job_id}}).then((_dataDel) => {
                    Model.create(req.body).then((_data) => {
                        fetchSingle(_data.id, res);
                    }).catch(_err => {
                        ApiHelpers.error(res, _err);
                    });
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