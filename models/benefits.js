'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('benefits', {
        id      :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        name    :{
            type:Sequelize.TEXT('long')
        }
    }, {
        underscored:true,
        version    :true
    });
};