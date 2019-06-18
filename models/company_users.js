'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('company_users', {
        id         :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        company_id     :{
            allowNull:false,
            type     :Sequelize.UUID
        }
        ,
        user_id:{
            allowNull:false,
            type     :Sequelize.UUID
        },
        role_id:{
            allowNull:false,
            type     :Sequelize.UUID
        }
    }, {
        underscored:true
    });
};