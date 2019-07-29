'use strict';

const Model      = db.notifications;
const QAJobs     = db.qa_jobs;
const Recruiters = db.recruiters;
const waterfall  = require('async-waterfall');
const _          = require('underscore');
const ApiHelpers = require('../helpers/api.helpers');
const Mail       = require('../helpers/mail');

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
        if(!req.body.msg) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.create(req.body).then((_data) => {

            QAJobs.findOne({where:{id:req.body.qa_job_id}}).then((_job) => {
                Recruiters.findOne({where:{id:_job.recruiter_id}}).then((_recruiter) => {
                    let verify_url = 'www.pixljobs.com' + '/recruiter/jobs';
                    Mail.sendJobStatusMail(req, _recruiter.email, _data.subject, _data.msg, verify_url);
                    ApiHelpers.success(res, _data);
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
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

    delete  :(req, res) => {
        Model.destroy({where:{id:req.params.id}}).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    fetchAll:(req, res) => {
        if(!req.body.recruiter_id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        let limit = parseInt(req.body.limit);
        if(!limit) {
            limit = 10
        }
        let offset = parseInt(req.body.offset);
        if(!offset) {
            offset = 0
        }
        let page = parseInt(req.body.page);
        if(!page) {
            page = 0
        }
        let _query = {
            recruiter_id:req.body.recruiter_id
        };
        if(req.body.status) {
            _query.status = req.body.status;
        }
        Model.findAndCountAll({where:_query}).then((data) => {
            let pages = Math.ceil(data.count / limit);
            offset    = limit * page;
            Model.findAll({
                where :_query,
                order :[
                    ['status', 'DESC'],
                    ['created_at', 'DESC']
                ],
                limit :limit,
                offset:offset
            }).then((_data) => {
                ApiHelpers.success(res, {total:_data.length, pages:pages, page:page, result:_data});
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};