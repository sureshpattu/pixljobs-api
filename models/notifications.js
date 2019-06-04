'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('notifications', {
        id        :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        user_id   :{
            type:Sequelize.UUID
        },
        job_id:{
            type:Sequelize.UUID
        },
        msg      :{
            type:Sequelize.TEXT('long')
        },
        status    :{
            type        :Sequelize.ENUM('read', 'unread', 'deleted'),
            defaultValue:'unread'
        }
    }, {
        underscored:true
    });
};