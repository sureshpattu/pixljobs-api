'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('companies', {
        id      :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        user_id:{
            type:Sequelize.UUID
        },
        name    :{
            type:Sequelize.TEXT('long')
        },
        industry:{
            type:Sequelize.TEXT('long')
        },
        size    :{
            type:Sequelize.STRING
        },
        about   :{
            type:Sequelize.TEXT('long')
        },
        email   :{
            type    :Sequelize.STRING,
            validate:{
                isEmail:true
            },
            unique  :{
                args:true,
                msg :'Email address already in use!'
            }
        },
        logo    :{
            type:Sequelize.STRING
        },
        status  :{
            type        :Sequelize.ENUM('closed', 'active', 'review', 'deleted'),
            defaultValue:'review'
        }
    }, {
        underscored:true
    });
};