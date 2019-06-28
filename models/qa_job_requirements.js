'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('qa_job_requirements', {
        id            :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        qa_job_id        :{
            type:Sequelize.UUID
        },
        requirement_id:{
            type:Sequelize.UUID
        },
        status        :{
            type        :Sequelize.ENUM('pending', 'viewed', 'shortlisted', 'downloaded'),
            defaultValue:'pending'
        }
    }, {
        underscored:true
    });
};