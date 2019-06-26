'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('job_applications', {
        id     :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        job_id :{
            type:Sequelize.UUID
        },
        applicant_id:{
            type:Sequelize.UUID
        },
        status :{
            type        :Sequelize.ENUM('pending', 'viewed', 'shortlisted', 'downloaded'),
            defaultValue:'pending'
        }
    }, {
        underscored:true
    });
};