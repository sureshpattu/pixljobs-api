'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('technologies', {
        id  :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        name:{
            type:Sequelize.TEXT('long')
        },
        desc:{
            type:Sequelize.TEXT('long')
        }
    }, {
        underscored:true
    });
};