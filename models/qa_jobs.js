'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('qa_jobs', {
        id        :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        name      :{
            type:Sequelize.TEXT('long')
        },
        desc      :{
            type:Sequelize.TEXT('long')
        },
        user_id   :{
            type:Sequelize.UUID
        },
        company_id:{
            type:Sequelize.UUID
        },
        salary_min:{
            type:Sequelize.STRING
        },
        salary_max:{
            type:Sequelize.STRING
        },
        job_type  :{
            type        :Sequelize.ENUM('FullTime', 'PartTime', 'Contract', 'Internship'),
            defaultValue:'FullTime'
        },
        status    :{
            type        :Sequelize.ENUM('closed', 'active', 'review', 'deleted'),
            defaultValue:'review'
        }
    }, {
        underscored:true
    });
};