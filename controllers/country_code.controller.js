'use strict';

const ApiHelpers  = require('../helpers/api.helpers');
const CountryCode = require('../data/data_country');

module.exports = {
    index:(req, res) => {
        ApiHelpers.success(res, CountryCode);
    }
};