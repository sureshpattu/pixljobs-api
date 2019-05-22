'use strict';
const path   = require('path');
const fs     = require('fs');
const crypto = require('crypto');
const url    = require('url');
const gm     = require('gm').subClass({imageMagick:true});
require('gm-base64');

function decodeBase64Image(dataString) {
    let matches  = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let response = {};
    if(matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

exports.uploadImage = (data64String, _dir_path, cb) => {
    try {
        let _path                            = path.resolve(__dirname, '../uploads');
        let imageTypeRegularExpression       = /\/(.*?)$/;
        let seed                             = crypto.randomBytes(20);
        let uniqueSHA1String                 = crypto.createHash('sha1').update(seed).digest('hex');
        let imageBuffer                      = decodeBase64Image(data64String);
        let userUploadedFeedMessagesLocation = _path + _dir_path + '/';
        let uniqueRandomImageName            = 'image-' + uniqueSHA1String;
        let imageTypeDetected                = imageBuffer.type.match(imageTypeRegularExpression);
        let userUploadedImagePath            = userUploadedFeedMessagesLocation +
            uniqueRandomImageName +
            '.' +
            imageTypeDetected[1];
        try {
            fs.writeFile(userUploadedImagePath, imageBuffer.data,
                function() {
                    console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                    cb(_dir_path + '/' + uniqueRandomImageName + '.' + imageTypeDetected[1]);
                });
        }
        catch(error) {
            console.log('ERROR:', error);
            cb(null);
        }
    }
    catch(error) {
        console.log('ERROR:', error);
        cb(null);
    }
};

exports.returnImage = (req, res, _dir_path) => {
    let _path     = path.resolve(__dirname, _dir_path);
    let _url      = url.parse(req.url).pathname;
    _url          = _url.replace(/^\//, '');
    _url          = _path + '/' + _url;
    let url_parts = url.parse(req.url, true);
    let query     = url_parts ? url_parts.query : {};
    let toDataUri = true;
    let _file_type;
    gm(_url).format(function(err, val) {
        _file_type = val;
    }).size(function(err, value) {
        //if(value) {
        //    this.drawText(value.width - 100, value.height - 50, 'MEDININ');
        //}
        if(query.h || query.w) {
            this.resize(query.h, query.w);
        }
        this.stream(_file_type, function(err, stdout) {
            let buf = '';
            if(err) {
                console.log((err));
                return res.send(null);
            }
            stdout.on('data', function(data) {
                buf += data.toString('binary');
            }).on('end', function() {
                let buffer = new Buffer(buf, 'binary');
                let result = buffer.toString('base64');
                if(toDataUri) {
                    result = 'data:image/' + _file_type + ';base64,' + result;
                }
                return res.send(result);
            });
        });
    });
};
