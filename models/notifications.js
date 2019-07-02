'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('notifications', {
        id      :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        admin_id:{
            type:Sequelize.UUID
        },
        recruiter_id  :{
            type:Sequelize.UUID
        },
        qa_job_id  :{
            type:Sequelize.UUID
        },
        subject     :{
            type:Sequelize.TEXT('long')
        },
        msg     :{
            type:Sequelize.TEXT('long')
        },
        status  :{
            type        :Sequelize.ENUM('read', 'unread', 'deleted'),
            defaultValue:'unread'
        }
    }, {
        underscored:true
    });
};