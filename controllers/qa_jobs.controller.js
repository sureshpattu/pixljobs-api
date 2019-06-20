'use strict';

const Model           = db.qa_jobs;
const JobTechnologies = db.qa_job_technologies;
const Technologies    = db.technologies;
const Companies       = db.companies;
const QAJobCategories = db.qa_job_categories;
const Categories      = db.categories;
const waterfall       = require('async-waterfall');
const _               = require('underscore');
const ApiHelpers      = require('../helpers/api.helpers');

function fetchSingle(_id, res) {
    Model.findOne({
        where  :{id:_id},
        include:[
            {
                model     :JobTechnologies,
                attributes:['qa_job_id'],
                include   :[
                    {
                        model     :Technologies,
                        attributes:['id', 'name']
                    }
                ]
            }
        ]
    }).then((_data) => {
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
    },
    search:(req, res) => {
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
        let _query    = {};
        let _outQuery = {};
        if(req.body.query) {
            _query[Op.or] = [];
        }
        if(req.body.company_id) {
            _outQuery.company_id = req.body.company_id;
        }
        if(req.body.query) {
            let lookupValue = req.body.query.toLowerCase();
            _query[Op.or].push({
                name:sequelize.where(sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE',
                    '%' + lookupValue + '%')
            });
        }
        Model.findAndCountAll({where:_outQuery}).then((data) => {
            let pages = Math.ceil(data.count / limit);
            offset    = limit * page;
            Model.findAll({
                where  :_outQuery,
                include:[
                    {
                        model     :Companies,
                        attributes:[
                            'id',
                            'name',
                            'logo',
                            'website',
                            'street',
                            'area',
                            'locality',
                            'city',
                            'state',
                            'pin',
                            'country'
                        ]
                    },
                    {
                        model     :JobTechnologies,
                        attributes:['qa_job_id'],
                        include   :[
                            {
                                model     :Technologies,
                                attributes:['id', 'name']
                            }
                        ]
                    },
                    {
                        model     :QAJobCategories,
                        attributes:['qa_job_id'],
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
                ApiHelpers.success(res, {total:data.count, pages:pages, page:page, result:_data});
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};