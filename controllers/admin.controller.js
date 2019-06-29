'use strict';

const QAJobs            = db.qa_jobs;
const QAJobCategories   = db.qa_job_categories;
const QAJobTechnologies = db.qa_job_technologies;

const Jobs            = db.jobs;
const JobCategories   = db.job_categories;
const JobTechnologies = db.job_technologies;

const waterfall  = require('async-waterfall');
const async      = require('async');
const _          = require('underscore');
const ApiHelpers = require('../helpers/api.helpers');

module.exports = {
    verifyJob:(req, res) => {
        if(!req.params.id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        QAJobs.findOne({where:{id:req.params.id}}).then((_data) => {
            if(_data) {
                let _qaJobObj = JSON.parse(JSON.stringify(_data));

                _qaJobObj.qa_job_id = _qaJobObj.id;
                delete _qaJobObj.id;
                delete _qaJobObj.created_at;
                delete _qaJobObj.updated_at;

                Jobs.create(_qaJobObj).then((_new_job) => {
                    let _newJobObj = JSON.parse(JSON.stringify(_new_job));

                    QAJobCategories.findAll({where:{qa_job_id:req.params.id}}).then((_qaCatdata) => {
                        if(_qaCatdata) {
                            let qaCat = JSON.parse(JSON.stringify(_qaCatdata));

                            waterfall(qaCat.map(function(_obj) {
                                return function(lastItemResult, CB) {
                                    if(!CB) {
                                        CB             = lastItemResult;
                                        lastItemResult = null;
                                    }
                                    var _tempObj = {
                                        job_id     :_newJobObj.id,
                                        category_id:_obj.category_id
                                    };
                                    async.parallel([
                                        function(callback) {
                                            JobCategories.create(_tempObj).then((_cat) => {
                                                callback(null, []);
                                            }).catch(_err => {
                                                callback(null, []);
                                            });
                                        }
                                    ], function(err, results) {
                                        CB(null, []);
                                    });
                                };
                            }), function() {
                                QAJobTechnologies.findAll({where:{qa_job_id:req.params.id}}).then((_qaTechdata) => {
                                    if(_qaTechdata) {
                                        let qaTech = JSON.parse(JSON.stringify(_qaTechdata));

                                        waterfall(qaTech.map(function(_obj) {
                                            return function(lastItemResult, CB) {
                                                if(!CB) {
                                                    CB             = lastItemResult;
                                                    lastItemResult = null;
                                                }
                                                var _tempObj = {
                                                    job_id       :_newJobObj.id,
                                                    technology_id:_obj.technology_id
                                                };
                                                async.parallel([
                                                    function(callback) {
                                                        JobTechnologies.create(_tempObj).then((_cat) => {
                                                            callback(null, []);
                                                        }).catch(_err => {
                                                            callback(null, []);
                                                        });
                                                    }
                                                ], function(err, results) {
                                                    CB(null, []);
                                                });
                                            };
                                        }), function() {
                                            ApiHelpers.success(res, _new_job);
                                        });
                                    }
                                }).catch(_err => {
                                    ApiHelpers.error(res, _err);
                                });
                            });
                        }
                    }).catch(_err => {
                        ApiHelpers.error(res, _err);
                    });

                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            } else {
                ApiHelpers.error(res, '', 'No data found!');
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};