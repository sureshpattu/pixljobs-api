'use strict';

const CategoryModel        = db.categories;
const IndustryModel        = db.industries;
const TechnologiesModel    = db.technologies;
const waterfall            = require('async-waterfall');
const async                = require('async');
const _                    = require('underscore');
const CategoryBulkData     = require('../data/category');
const TechnologiesBulkData = require('../data/technologies');
const IndustryBulkData     = require('../data/industry');

module.exports = {
    index:function(_cb) {
        async.parallel([
            function(callback) {
                waterfall(CategoryBulkData.map(function(_obj) {
                    return function(lastItemResult, CB) {
                        if(!CB) {
                            CB             = lastItemResult;
                            lastItemResult = null;
                        }
                        CategoryModel.create({
                            name:_obj
                        }).then((user) => {
                            CB(null, []);
                        }).catch(_er => {
                            console.log(_er.message);
                            CB(null, []);
                        });
                    };
                }), function() {
                    callback(null, null);
                });
            },
            function(callback) {
                waterfall(TechnologiesBulkData.map(function(_obj) {
                    return function(lastItemResult, CB) {
                        if(!CB) {
                            CB             = lastItemResult;
                            lastItemResult = null;
                        }
                        TechnologiesModel.create({
                            name:_obj
                        }).then((user) => {
                            CB(null, []);
                        }).catch(_er => {
                            console.log(_er.message);
                            CB(null, []);
                        });
                    };
                }), function() {
                    callback(null, null);
                });
            },
            function(callback) {
                waterfall(IndustryBulkData.map(function(_obj) {
                    return function(lastItemResult, CB) {
                        if(!CB) {
                            CB             = lastItemResult;
                            lastItemResult = null;
                        }
                        IndustryModel.create({
                            name:_obj
                        }).then((user) => {
                            CB(null, []);
                        }).catch(_er => {
                            console.log(_er.message);
                            CB(null, []);
                        });
                    };
                }), function() {
                    callback(null, null);
                });
            }
        ], function(err, results) {
            if(_cb) {
                _cb();
            }
        });
    }
};



