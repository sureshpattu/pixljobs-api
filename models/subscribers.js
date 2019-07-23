'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('subscribers', {
        id      :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        name    :{
            type:Sequelize.TEXT('long')
        },
        mobile            :{
            type  :Sequelize.STRING,
            unique:{
                args:true,
                msg :'Mobile number already in use!'
            }
        },
        mobile_code       :{
            type        :Sequelize.STRING,
            defaultValue:'91'
        },
        email             :{
            type    :Sequelize.STRING,
            validate:{
                isEmail:true
            },
            unique  :{
                args:true,
                msg :'Email address already in use!'
            }
        },
        url       :{
            type:Sequelize.TEXT('long')
        },
    }, {
        underscored:true,
        version    :true
    });
};