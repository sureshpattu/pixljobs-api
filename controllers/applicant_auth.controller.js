'use strict';

const Model   = db.applicants;
const crypto2 = require('crypto2');
const _       = require('underscore');
const config  = require('../config/config'),
      jwt     = require('jwt-simple');

const ApiHelpers = require('../helpers/api.helpers');

function returnUserDetails(_user, res) {
    Model.findOne({where:{id:_user.id}}).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

module.exports = {
    register    :async function(req, res) {
        if(!req.body.name || !req.body.gender || !req.body.email || !req.body.password) {
            return ApiHelpers.error(res, true, 'Parameters missing!');
        }
        let basic = {
            name           :req.body.name,
            email          :req.body.email,
            gender         :req.body.gender,
            designation    :req.body.designation,
            qualification  :req.body.qualification,
            institution    :req.body.institution,
            company        :req.body.company,
            current_salary :req.body.current_salary,
            expected_salary:req.body.expected_salary
        };
        if(req.body.mobile) {
            basic.mobile = req.body.mobile;
        }
        if(req.body.password) {
            basic.password = await crypto2.encrypt(req.body.password, config.hashSalt2, config.hashIV);
        }
        Model.create(basic).then((user) => {
            returnUserDetails(user, res);
        }).catch(_err => {
            var _errors = [];
            if(_err.errors && _err.errors.length) {
                _.map(_err.errors, function(_obj) {
                    _errors.push(_obj.message);
                });
                ApiHelpers.error(res, _err, _errors.join(', '));
            } else {
                ApiHelpers.error(res, _err);
            }
        });
    },
    authenticate:function(req, res) {
        if(!req.body.email || !req.body.password) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{email:req.body.email}}).then(async(_user) => {
            if(!_user) {
                ApiHelpers.error(res, true, 'Invalid credentials');
            } else {
                let _status = await _user.validPassword(req.body.password);
                if(!_status) {
                    ApiHelpers.error(res, true, 'Invalid credentials');
                } else {
                    let token = jwt.encode({email:_user.email}, config.TOKENSECRET);
                    Model.update({
                        last_login:new Date(),
                        token     :token,
                        token_time:new Date()
                    }, {where:{email:req.body.email}}).then((_emp_updated) => {
                        returnUserDetails(_user, res);
                    }).catch(_err => {
                        ApiHelpers.error(res, _err);
                    });
                }
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    checkToken  :function(req, res) {
        if(!req.body.id || !req.body.token) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{id:req.body.id, token:req.body.token}}).then((_user) => {
            if(!_user) {
                return ApiHelpers.error(res, true, 'Invalid credentials');
            } else {
                Model.update({last_login:new Date()}, {where:{id:req.body.id}}).then(_up_data => {
                    returnUserDetails(_user, res);
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};