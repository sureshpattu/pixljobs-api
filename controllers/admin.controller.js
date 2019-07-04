'use strict';

const Model             = db.admins;
const QAJobs            = db.qa_jobs;
const QAJobCategories   = db.qa_job_categories;
const QAJobTechnologies = db.qa_job_technologies;
const QAJobRequirements = db.qa_job_requirements;

const Jobs            = db.jobs;
const JobCategories   = db.job_categories;
const JobTechnologies = db.job_technologies;
const JobRequirements = db.job_requirements;

const Technologies    = db.technologies;
const Companies       = db.companies;
const Categories      = db.categories;
const Industry        = db.industries;
const CompanyBenefits = db.company_benefits;
const Benefits        = db.benefits;

const waterfall   = require('async-waterfall');
const async       = require('async');
const _           = require('underscore');
const ApiHelpers  = require('../helpers/api.helpers');
const sequelize   = require('sequelize');
const Op          = sequelize.Op;
const companyAttr = [
    'id',
    'name',
    'logo',
    'website',
    'about',
    'size',
    'url',
    'street',
    'area',
    'locality',
    'city',
    'state',
    'pin',
    'country'
];

function fetchSingle(req, res) {
    Model.findOne({
        where:{id:req.params.id}
    }).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

function updateJobOtherDetails(req, res, _qaJobObj, _newJobObj) {
    async.parallel([
        function(callback) {
            JobRequirements.destroy({where:{qa_job_id:_qaJobObj.id}}).then((_data) => {
                callback(null, []);
            }).catch(_err => {
                callback(null, []);
            });
        },
        function(callback) {
            JobTechnologies.destroy({where:{qa_job_id:_qaJobObj.id}}).then((_data) => {
                callback(null, []);
            }).catch(_err => {
                callback(null, []);
            });
        },
        function(callback) {
            JobCategories.destroy({where:{qa_job_id:_qaJobObj.id}}).then((_data) => {
                callback(null, []);
            }).catch(_err => {
                callback(null, []);
            });
        }
    ], function(err, results) {
        createJobOtherDetails(req, res, _qaJobObj, _newJobObj);
    });
}

function createJobOtherDetails(req, res, _qaJobObj, _newJobObj) {
    async.parallel([
        function(mainCallBack) {
            QAJobRequirements.findAll({where:{qa_job_id:req.params.id}}).then((_qaReqdata) => {
                if(_qaReqdata) {
                    let qaReq = JSON.parse(
                        JSON.stringify(_qaReqdata));

                    waterfall(qaReq.map(function(_obj) {
                        return function(lastItemResult, CB) {
                            if(!CB) {
                                CB             = lastItemResult;
                                lastItemResult = null;
                            }
                            var _tempObj = {
                                job_id        :_newJobObj.id,
                                requirement_id:_obj.requirement_id
                            };
                            async.parallel([
                                function(callback) {
                                    JobRequirements.create(_tempObj).then((_cat) => {
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
                        mainCallBack(null, [])
                    });
                }
            }).catch(_err => {
                mainCallBack(null, [])
            });
        },
        function(mainCallBack) {
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
                        mainCallBack(null, [])
                    });
                }
            }).catch(_err => {
                mainCallBack(null, [])
            });
        },
        function(mainCallBack) {
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
                        mainCallBack(null, [])
                    });
                }
            }).catch(_err => {
                mainCallBack(null, [])
            });
        }
    ], function(err, results) {
        QAJobs.update({status:'published'}, {where:{id:_newJobObj.qa_job_id}}).then((_data) => {
            Jobs.update({status:'published'}, {where:{id:_newJobObj.id}}).then((_data) => {
                ApiHelpers.success(res, _newJobObj);
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    });
}

module.exports = {
    read        :(req, res) => {
        fetchSingle(req, res);
    },
    publishJob  :(req, res) => {
        if(!req.params.id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        QAJobs.findOne({where:{id:req.params.id}}).then((_data) => {
            if(_data) {
                let _qaJobObj = JSON.parse(JSON.stringify(_data));

                _qaJobObj.qa_job_id = _qaJobObj.id;
                _qaJobObj.is_active = true;
                delete _qaJobObj.id;
                delete _qaJobObj.created_at;
                delete _qaJobObj.updated_at;

                Jobs.findOne({where:{qa_job_id:_qaJobObj.id}}).then((_JobData) => {
                    if(!_JobData) {
                        Jobs.create(_qaJobObj).then((_new_job) => {
                            let _newJobObj = JSON.parse(JSON.stringify(_new_job));
                            createJobOtherDetails(req, res, _qaJobObj, _newJobObj);
                        }).catch(_err => {
                            ApiHelpers.error(res, _err);
                        });
                    } else {
                        let _newJobObj = JSON.parse(JSON.stringify(_JobData));
                        Jobs.update(_qaJobObj, {where:{qa_job_id:_qaJobObj.id}}).then((_jobUpdateRes) => {
                            updateJobOtherDetails(req, res, _qaJobObj, _newJobObj);
                        }).catch(_err => {
                            ApiHelpers.error(res, _err);
                        });
                    }
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            } else {
                ApiHelpers.error(res, '', 'No data found!');
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    search      :(req, res) => {
        if(!req.body.status) {
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
        let _query = {};
        if(req.body.query) {
            _query[Op.or] = [];
        }
        if(req.body.status) {
            _query.status = req.body.status;
        }
        QAJobs.findAndCountAll({where:_query}).then((data) => {
            let pages = Math.ceil(data.count / limit);
            offset    = limit * page;
            QAJobs.findAll({
                where  :_query,
                include:[
                    {
                        model     :Companies,
                        attributes:companyAttr,
                        include   :[
                            {
                                model:Industry
                            },
                            {
                                model     :CompanyBenefits,
                                attributes:['company_id'],
                                include   :[
                                    {
                                        model     :Benefits,
                                        attributes:['id', 'name']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model     :QAJobTechnologies,
                        attributes:['id', 'qa_job_id'],
                        include   :[
                            {
                                model     :Technologies,
                                attributes:['id', 'name']
                            }
                        ]
                    },
                    {
                        model     :QAJobCategories,
                        attributes:['id', 'qa_job_id'],
                        include   :[
                            {
                                model     :Categories,
                                attributes:['id', 'name']
                            }
                        ]
                    }
                ],
                limit  :limit,
                offset :offset
            }).then((_data) => {
                ApiHelpers.success(res, {total:_data.length, pages:pages, page:page, result:_data});
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    unPublishJob:(req, res) => {
        if(!req.params.id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        var _obj = {
            is_active:false
        };
        QAJobs.update(_obj, {where:{id:req.params.id}}).then((_qaJobRes) => {
            if(_qaJobRes) {
                Jobs.update(_obj, {where:{qa_job_id:req.params.id}}).then((_jobRes) => {
                    if(_qaJobRes) {
                        ApiHelpers.success(res, _qaJobRes);
                    } else {
                        ApiHelpers.error(res, '', 'No data found!');
                    }
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