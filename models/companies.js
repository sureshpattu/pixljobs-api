'use strict';

module.exports = function(sequelize, Sequelize) {
    return sequelize.define('companies', {
        id           :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        user_id      :{
            type:Sequelize.UUID
        },
        name         :{
            type:Sequelize.TEXT('long')
        },
        industry     :{
            type:Sequelize.TEXT('long')
        },
        size         :{
            type:Sequelize.STRING
        },
        about        :{
            type:Sequelize.TEXT('long')
        },
        phone_code   :{
            type:Sequelize.STRING
        },
        phone_number :{
            type:Sequelize.STRING
        },
        mobile_code  :{
            type:Sequelize.STRING
        },
        mobile_number:{
            type:Sequelize.STRING
        },
        street       :{
            type:Sequelize.STRING
        },
        area         :{
            type:Sequelize.STRING
        },
        locality     :{
            type:Sequelize.STRING
        },
        city         :{
            type:Sequelize.STRING
        },
        state        :{
            type:Sequelize.STRING
        },
        pin          :{
            type:Sequelize.STRING
        },
        country      :{
            type:Sequelize.STRING
        },
        email        :{
            type:Sequelize.STRING
        },
        logo         :{
            type:Sequelize.STRING
        },
        website         :{
            type:Sequelize.STRING
        },
        pan        :{
            type:Sequelize.STRING
        },
        tan         :{
            type:Sequelize.STRING
        },
        gst         :{
            type:Sequelize.STRING
        },
        cin         :{
            type:Sequelize.STRING
        },
        photo_1      :{
            type:Sequelize.STRING
        },
        photo_2      :{
            type:Sequelize.STRING
        },
        photo_3      :{
            type:Sequelize.STRING
        },
        photo_4      :{
            type:Sequelize.STRING
        },
        video_1      :{
            type:Sequelize.STRING
        },
        video_2      :{
            type:Sequelize.STRING
        },
        status       :{
            type        :Sequelize.ENUM('closed', 'active', 'review', 'deleted'),
            defaultValue:'review'
        }
    }, {
        underscored:true
    });
};