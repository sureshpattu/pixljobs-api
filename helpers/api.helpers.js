exports.success = function(res, _data, _msg) {
    res.json({
        error  :false,
        data   :_data,
        message:_msg || 'Success'
    })
};
exports.error   = function(res, _err, _msg, _data) {
    res.json({
        error  :true,
        data   :_data || null,
        message:_msg ? _msg : _err.message || 'Something went wrong'
    })
};