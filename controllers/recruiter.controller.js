'use strict';

const Model           = db.recruiters;
const Company         = db.companies;
const Industry        = db.industries;
const CompanyBenefits = db.company_benefits;
const Benefits        = db.benefits;
const ImgHelpers      = require('./../helpers/image.upload.helpers');
const ApiHelpers      = require('./../helpers/api.helpers');
const _               = require('underscore');
const path            = require('path');
const sequelize       = require('sequelize');
const crypto2         = require('crypto2');
const config          = require('../config/config');
const fs              = require('fs');
const jwt             = require('jwt-simple');
const Mail            = require('../helpers/mail');
const SMSHelpers      = require('../helpers/sms');

function fetchSingle(req, res) {
    Model.findOne({
        where:{id:req.params.id}
    }).then((_data) => {
        ApiHelpers.success(res, _data);
    }).catch(_err => {
        ApiHelpers.error(res, _err);
    });
}

module.exports = {
    read         :(req, res) => {
        fetchSingle(req, res);
    },
    fetchFull    :(req, res) => {
        Model.findOne({
            where     :{id:req.params.id},
            attributes:[
                'id',
                'name',
                'email',
                'mobile',
                'gender',
                'photo',
                'designation',
                'default_company_id'
            ],
            include   :[
                {
                    model  :Company,
                    include:[
                        {
                            model:Industry
                        },
                        {
                            model     :CompanyBenefits,
                            attributes:['company_id', 'Benefit_id'],
                            include   :[
                                {
                                    model     :Benefits,
                                    attributes:['id', 'name']
                                }
                            ]
                        }
                    ]
                }
            ]
        }).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    resetPassword:async(req, res) => {
        let _body = {
            password:req.body.password
        };
        if(req.body.password) {
            _body.password = await crypto2.encrypt(req.body.password, config.hashSalt2, config.hashIV);
        }
        Model.update(_body, {where:{id:req.params.id}, individualHooks:true}).then((_data) => {
            fetchSingle(req, res);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    changeEmail  :(req, res) => {
        Model.findOne({
            where:{id:req.params.id}
        }).then(async(user) => {
            let token = jwt.encode({email:user.email}, config.TOKENSECRET);
            Model.update({
                email_token      :token,
                is_email_verified:false
            }, {where:{id:req.params.id}}).then((_emp_updated) => {
                let mailOptions = {
                    from   :'connect@trebound.com',
                    to     :req.body.email,
                    subject:'Verify Your Email Address',
                    body   :'Hi, ' + req.body.name + ' Click here to activate your account : http://' +
                        'localhost:3035' + '/recruiter/email/verify/' + token
                };
                Mail.sendMail(req, mailOptions);
                ApiHelpers.success(res, user,
                    'An email has been sent to the email address provided. Please verify your email by clicking the link send by us.');
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
        })

    },
    update       :(req, res) => {
        let data = req.body;
        if(data.password) {
            delete data.password;
        }
        if(data.passcode) {
            delete data.passcode;
        }
        if(data.first_name || data.last_name) {
            data.name = data.first_name + ' ' + data.last_name;
        }
        Model.update(data, {where:{id:req.params.id}}).then((_data) => {
            fetchSingle(req, res);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    photo        :(req, res) => {
        if(req.file) {
            let data = {
                photo     :req.file.filename,
                photo_type:req.file.mimetype
            };
            Model.update(data, {where:{id:req.params.id}}).then((_data) => {
                ApiHelpers.success(res, _data);
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
        } else {
            return ApiHelpers.error(res, true, 'Please select valid file');
        }
    },
    viewPhoto    :(req, res) => {
        return res.sendFile(`${path.resolve(__dirname, '../', 'uploads/recruiter/photo/', req.params.image)}`);
    },
    removePhoto  :(req, res) => {
        let data = {
            photo     :null,
            photo_type:null
        };

        let filePath = `${path.resolve(__dirname, '../', 'uploads/recruiter/photo/', req.params.image)}`;
        fs.unlinkSync(filePath);

        Model.update(data, {where:{photo:req.params.image}}).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    delete       :(req, res) => {
        if(!req.params.id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{id:req.params.id}}).then((_data) => {
            if(_data && _data.file) {
                let filePath = `${path.resolve(__dirname, '../', 'uploads/recruiter/photo/', _data.file)}`;
                fs.unlinkSync(filePath);
                Model.destroy({where:{id:req.params.id}}).then((_data) => {
                    ApiHelpers.success(res, {status:'success', code:200});
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            } else {
                Model.destroy({where:{id:req.params.id}}).then((_data) => {
                    ApiHelpers.success(res, {status:'success', code:200});
                }).catch(_err => {
                    ApiHelpers.error(res, _err);
                });
            }
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    }
};
