'use strict';

const Model      = db.applicants;
const crypto2    = require('crypto2');
const _          = require('underscore');
const config     = require('../config/config'),
      jwt        = require('jwt-simple'),
      fs         = require('fs'),
      path       = require('path'),
      Handlebars = require('handlebars');
const Mail       = require('../helpers/mail');
const SMSHelpers = require('../helpers/sms');

const ApiHelpers = require('../helpers/api.helpers');

function returnUserDetails(_user, res) {
    Model.findOne({where:{id:_user.id}}).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

module.exports = {
    register           :async function(req, res) {
        if(!req.body.name || !req.body.gender || !req.body.email || !req.body.password) {
            return ApiHelpers.error(res, true, 'Parameters missing!');
        }
        let basic = {
            name            :req.body.name,
            email           :req.body.email,
            gender          :req.body.gender,
            designation     :req.body.designation,
            qualification   :req.body.qualification,
            institution     :req.body.institution,
            company         :req.body.company,
            current_salary  :req.body.current_salary,
            expected_salary :req.body.expected_salary,
            exp_month       :req.body.exp_month,
            exp_year        :req.body.exp_year,
            institution_city:req.body.institution_city,
            current_city    :req.body.current_city,
            home_city       :req.body.home_city,
            relocation      :req.body.relocation,
            dob             :req.body.dob
        };
        if(req.body.mobile) {
            basic.mobile = req.body.mobile;
        }
        if(req.body.mobile_code) {
            basic.mobile_code = req.body.mobile_code;
        }
        if(req.body.photo) {
            basic.photo = req.body.photo;
        }
        if(req.body.photo_type) {
            basic.photo_type = req.body.photo_type;
        }
        if(req.body.age) {
            basic.age = req.body.age;
        }
        if(req.body.password) {
            basic.password = await crypto2.encrypt(req.body.password, config.hashSalt2, config.hashIV);
        }
        Model.create(basic).then((user) => {
            let token = jwt.encode({email:user.email}, config.TOKENSECRET);
            Model.update({
                email_token:token,
                token      :token
            }, {where:{email:req.body.email}}).then((_emp_updated) => {

                let welcome_url = config.domain_name + '/login';
                Mail.sendWelcomeMail(req, req.body.email, welcome_url);

                let verify_url = config.domain_name + '/applicant/email/verify/' + token;
                Mail.sendEmailVerifyMail(req, req.body.email, verify_url);

                Model.findOne({where:{id:user.id}}).then((_data) => {
                    ApiHelpers.success(res, _data,
                        'An email has been sent to the email address provided. Please verify your email by clicking the link send by us.');
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
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
    authenticate       :function(req, res) {
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
    checkToken         :function(req, res) {
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
    },
    verifyEmailToken   :function(req, res) {
        if(!req.body.email_token) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{email_token:req.body.email_token}}).then((_user) => {
            if(!_user) {
                return ApiHelpers.error(res, true, 'Invalid token');
            } else {
                Model.update({is_email_verified:true, email_token:null}, {where:{id:_user.id}}).then(_up_data => {
                    returnUserDetails(_user, res);
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    verifyEmail        :function(req, res) {
        if(!req.body.email) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{email:req.body.email}}).then((_user) => {
            if(!_user) {
                return ApiHelpers.error(res, true, 'Invalid token');
            } else {
                let token = jwt.encode({email:_user.email}, config.TOKENSECRET);
                Model.update({
                    email_token:token
                }, {where:{email:req.body.email}}).then((_emp_updated) => {

                    let verify_url = config.domain_name + '/applicant/email/verify/' + token;
                    Mail.sendEmailVerifyMail(req, req.body.email, verify_url);
                    ApiHelpers.success(res, _user,
                        'An email has been sent to the email address provided. Please verify your email by clicking the link send by us.');
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    forgotPassword     :function(req, res) {
        if(!req.body.email) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{email:req.body.email}}).then((_user) => {
            if(!_user) {
                return ApiHelpers.error(res, true, 'Invalid credentials');
            } else {
                let token = jwt.encode({email:_user.email}, config.TOKENSECRET);
                Model.update({
                    reset_token:token
                }, {where:{email:req.body.email}}).then((_emp_updated) => {

                    let verify_url = config.domain_name + '/applicant/forgot/password/' + token;
                    Mail.sendForgotPasswordMail(req, req.body.email, verify_url);
                    return res.json({
                        error  :false,
                        message:'A reset password link has been sent to the email address provided.'
                    });
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    forgotPasswordToken:function(req, res) {
        if(!req.body.reset_token) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{reset_token:req.body.reset_token}}).then((_user) => {
            if(!_user) {
                return ApiHelpers.error(res, true, 'Invalid token');
            } else {
                returnUserDetails(_user, res);
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    getOTP             :function(req, res) {
        let _newOtp    = Math.floor(1000 + Math.random() * 9000);
        _newOtp        = _newOtp.toString();
        let _otpNormal = _newOtp;
        Model.findOne({where:{mobile:req.body.mobile}}).then(async(_user) => {
            if(_user) {
                _newOtp = await crypto2.encrypt(_newOtp, config.hashSalt2, config.hashIV);
                Model.update({mobile_otp:_newOtp}, {where:{id:_user.id}}).then((_us) => {
                    SMSHelpers.sendSms({
                        'message'    :'Use ' + _otpNormal +
                            ' as your verification OTP. OTP is confidential. Medinin never calls you asking for OTP. DO NOT share it with anyone, Medinin will never call to confirm it.',
                        'type'       :'Transactional',
                        'phoneNumber':'+91' + req.body.mobile
                    }, function() {
                        returnUserDetails(_user, res);
                    });
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            } else {
                ApiHelpers.error(res, 'true', 'Mobile number not found');
            }
        }).catch((_err) => {
            ApiHelpers.error(res, _err);
        });
    },
    checkOTP           :function(req, res) {
        Model.findOne({where:{mobile:req.body.mobile}}).then(async(_user) => {
            if(_user) {
                let _status = await _user.validOTP(req.body.otp);
                let _body   = {is_mobile_verified:true};
                if(_status) {
                    Model.update(_body, {where:{id:_user.id}}).then((_d) => {
                        let token = jwt.encode({email:_user.email}, config.TOKENSECRET);
                        Model.update({
                            last_login:new Date(),
                            token     :token,
                            token_time:new Date()
                        }, {where:{id:_user.id}}).then((_update) => {
                            returnUserDetails(_user, res);
                        }).catch(_err => {
                            ApiHelpers.error(res, _err)
                        });
                    }).catch(_err => {
                        ApiHelpers.error(res, _err)
                    });
                } else {
                    ApiHelpers.error(res, true, 'Not matching');
                }
            } else {
                ApiHelpers.error(res, true, 'Mobile number not found');
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};