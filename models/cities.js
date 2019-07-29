'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('cities', {
        id  :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        city:{
            type:Sequelize.TEXT('long')
        }
    }, {
        underscored:true
    });
};