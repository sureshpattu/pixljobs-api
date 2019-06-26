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
const sequelize       = require('sequelize');
const Op              = sequelize.Op;
const jobAttr         = [
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
];

function fetchSingle(_id, res) {
    Model.findOne({
        where  :{id:_id},
        include:[
            {
                model     :Companies,
                attributes:jobAttr
            },
            {
                model     :JobTechnologies,
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

    countJobType:(req, res) => {
        Model.findAll({
            group     :['job_type'],
            attributes:['job_type', [sequelize.fn('COUNT', 'job_type'), 'count']]
        }).then((_data) => {
            let _obj = JSON.parse(JSON.stringify(_data));
            _obj     = _.object(_.map(_obj, _.values));
            ApiHelpers.success(res, _obj);
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
        let _query            = {};
        let _outQuery         = {};
        let _categoryQuery    = {};
        let _categoryRequired = false;
        if(req.body.query) {
            _query[Op.or] = [];
        }
        if(req.body.company_id) {
            _query.company_id = req.body.company_id;
        }
        if(req.body.job_type) {
            _query.job_type = req.body.job_type;
        }
        if(req.body.query) {
            let lookupValue = req.body.query.toLowerCase();
            _query[Op.or].push({
                name:sequelize.where(sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE',
                    '%' + lookupValue + '%')
            });
        }
        if(req.body.category_id) {
            _categoryQuery.category_id = req.body.category_id;
            _categoryRequired          = true;
        }
        Model.findAndCountAll({where:_query}).then((data) => {
            let pages = Math.ceil(data.count / limit);
            offset    = limit * page;
            Model.findAll({
                where  :_query,
                include:[
                    {
                        model     :Companies,
                        attributes:jobAttr
                    },
                    {
                        model     :JobTechnologies,
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
                        where     :_categoryQuery,
                        include   :[
                            {
                                model     :Categories,
                                attributes:['id', 'name']
                            }
                        ],
                        required  :_categoryRequired
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
    }
};