'use strict';

const Model                 = db.applicants;
const Technologies          = db.technologies;
const ApplicantTechnologies = db.applicant_technologies;
const Languages             = db.languages;
const ApplicantLanguages    = db.applicant_languages;
const Cities                = db.cities;
const ApplicantCities       = db.applicant_cities;
const ImgHelpers            = require('./../helpers/image.upload.helpers');
const ApiHelpers            = require('./../helpers/api.helpers');
const _                     = require('underscore');
const path                  = require('path');
const sequelize             = require('sequelize');
const crypto2               = require('crypto2');
const config                = require('../config/config');
const fs                    = require('fs');
const jwt                   = require('jwt-simple');
const Mail                  = require('../helpers/mail');
const SMSHelpers            = require('../helpers/sms');

function fetchSingle(req, res) {
    Model.findOne({
        where  :{id:req.params.id},
        include:[
            {
                model     :ApplicantTechnologies,
                attributes:['id', 'level'],
                include   :[
                    {
                        model     :Technologies,
                        attributes:['id', 'name']
                    }
                ]
            },
            {
                model     :ApplicantLanguages,
                attributes:['id', 'level'],
                include   :[
                    {
                        model     :Languages,
                        attributes:['id', 'name']
                    }
                ]
            },
            {
                model     :ApplicantCities,
                attributes:['id'],
                include   :[
                    {
                        model     :Cities,
                        attributes:['id', 'city']
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
    read         :(req, res) => {
        fetchSingle(req, res);
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
            let token = jwt.encode({email:req.body.email}, config.TOKENSECRET);
            Model.update({
                email            :req.body.email,
                email_token      :token,
                is_email_verified:false
            }, {where:{id:req.params.id}}).then((_emp_updated) => {
                let mailOptions = {
                    from   :'connect@trebound.com',
                    to     :req.body.email,
                    subject:'Verify Your Email Address',
                    body   :'Hi, ' + req.body.name + ' Click here to activate your account : http://' +
                        'localhost:3035' + '/applicant/email/verify/' + token
                };
                Mail.sendMail(req, mailOptions);
                ApiHelpers.success(res, user,
                    'An email has been sent to the email address provided. Please verify your email by clicking the link send by us.');
            }).catch(_err => {
                ApiHelpers.error(res, _err);
            });
        })

    },

    update          :(req, res) => {
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
    photo           :(req, res) => {
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
    viewPhoto       :(req, res) => {
        return res.sendFile(`${path.resolve(__dirname, '../', 'uploads/applicant/photo/', req.params.image)}`);
    },
    removePhoto     :(req, res) => {
        let data = {
            photo     :null,
            photo_type:null
        };

        let filePath = `${path.resolve(__dirname, '../', 'uploads/applicant/photo/', req.params.image)}`;
        fs.unlinkSync(filePath);

        Model.update(data, {where:{photo:req.params.image}}).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    resumeFile      :(req, res) => {
        if(req.file) {
            let data = {
                resume     :req.file.filename,
                resume_type:req.file.mimetype
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
    viewResumeFile  :(req, res) => {
        return res.sendFile(`${path.resolve(__dirname, '../', 'uploads/applicant/doc/', req.params.file)}`);
    },
    removeResumeFile:(req, res) => {
        let data = {
            resume     :null,
            resume_type:null
        };

        let filePath = `${path.resolve(__dirname, '../', 'uploads/applicant/doc/', req.params.file)}`;
        fs.unlinkSync(filePath);

        Model.update(data, {where:{resume:req.params.file}}).then((_data) => {
            ApiHelpers.success(res, _data);
        }).catch(_err => {
            ApiHelpers.error(res, _err);
        });
    },
    delete          :(req, res) => {
        if(!req.params.id) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }
        Model.findOne({where:{id:req.params.id}}).then((_data) => {
            if(_data && _data.file) {
                let filePath = `${path.resolve(__dirname, '../', 'uploads/applicant/photo/', _data.file)}`;
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
