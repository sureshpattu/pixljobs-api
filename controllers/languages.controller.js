'use strict';

const Model      = db.languages;
const waterfall  = require('async-waterfall');
const _          = require('underscore');
const ApiHelpers = require('../helpers/api.helpers');
const BulkData   = require('../data/languages');
const sequelize  = require('sequelize');
const Op         = sequelize.Op;

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

    create    :(req, res) => {
        if(!req.body.name) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.create(req.body).then((_data) => {
            fetchSingle(_data.id, res);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    createBulk:(req, res) => {
        waterfall(BulkData.map(function(_obj) {
            return function(lastItemResult, CB) {
                if(!CB) {
                    CB             = lastItemResult;
                    lastItemResult = null;
                }
                Model.create({
                    name:_obj
                }).then((user) => {
                    CB(null, []);
                }).catch(_er => {
                    console.log(_er.message);
                    CB(null, []);
                });
            };
        }), function() {
            return res.status(200).json({message:'All done'});
        });
    },
    update    :(req, res) => {
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

        let _query = {};
        if(req.body.query) {
            _query[Op.or] = [];
        }

        if(req.body.query) {
            let lookupValue = req.body.query.toLowerCase();
            _query[Op.or].push({
                name:sequelize.where(sequelize.fn('LOWER', db.sequelize.col('name')), 'LIKE',
                    '%' + lookupValue + '%')
            });
        }

        Model.findAndCountAll({where:_query}).then((data) => {
            let pages = Math.ceil(data.count / limit);
            offset    = limit * page;
            Model.findAll({
                where :_query,
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