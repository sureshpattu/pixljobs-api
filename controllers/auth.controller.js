'use strict';

const Applicants    = db.applicants;
const Recruiters    = db.recruiters;
const Notifications = db.notifications;
const async         = require('async');
const ApiHelpers    = require('../helpers/api.helpers');
let _attributes     = ['id', 'name', 'gender', 'email', 'mobile', 'designation', 'photo'];

module.exports = {
    checkUser:function(req, res) {
        if(!req.body.user_id || !req.body.token) {
            return ApiHelpers.error(res, true, 'Parameters missing');
        }

        async.parallel([
            function(callback) {
                Applicants.findOne({
                    where     :{id:req.body.user_id, token:req.body.token},
                    attributes:_attributes
                }).then((_user) => {
                    if(!_user) {
                        // return ApiHelpers.error(res, true, 'Invalid credentials');
                        callback(null, null);
                    } else {
                        callback(null, _user);
                    }
                }).catch(_err => {
                    callback(null, null);
                });
            },
            function(callback) {
                Recruiters.findOne({
                    where     :{id:req.body.user_id, token:req.body.token},
                    attributes:_attributes
                }).then((_user) => {
                    if(!_user) {
                        callback(null, null);
                    } else {
                        callback(null, _user);
                    }
                }).catch(_err => {
                    callback(null, null);
                });
            }
        ], function(err, results) {
            let _data = null;
            if(results[0]) {
                _data              = JSON.parse(JSON.stringify(results[0]));
                _data.is_recruiter = false;
                ApiHelpers.success(res, _data);
            } else if(results[1]) {
                _data              = JSON.parse(JSON.stringify(results[1]));
                _data.is_recruiter = true;
                Notifications.findAndCountAll({where:{status:'unread', recruiter_id:_data.id}}).then((_notif) => {
                    _data.total_notifications = _notif.count;
                    ApiHelpers.success(res, _data);
                }).catch(_err => {
                    ApiHelpers.error(res, true, 'Invalid credentials');
                });
            } else {
                ApiHelpers.error(res, true, 'Invalid credentials');
            }
        });
    }
};