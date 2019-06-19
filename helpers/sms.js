const sendMsg   = require('aws-sns-sms');
const awsConfig = require('../config/sms_config');

//Sample sms object
// let msg = {
//     "message": "your OTP is 845214",
//     "type": "Transactional",
//     "phoneNumber": "+919632008592" // phoneNumber along with country code
// };

module.exports = {
    sendSms: function (options, cb) {
        if (options && typeof(options) === 'object') {
            options.sender = 'MEDINH';
            sendMsg(awsConfig, options).then(data => {
                console.log("SMS sent", data);
                if (cb) {
                    cb(data)
                }
            }).catch(err => {
                console.log('SMS error', err);
                if (cb) {
                    cb()
                }
            });
        } else {
            if (cb) {
                cb()
            }
        }
    }
};