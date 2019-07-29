'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('job_technologies', {
        id           :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        qa_job_id    :{
            type:Sequelize.UUID
        },
        job_id       :{
            allowNull:false,
            type     :Sequelize.UUID
        },
        technology_id:{
            allowNull:false,
            type     :Sequelize.UUID
        },
        level        :{
            type        :Sequelize.ENUM('Basic', 'Proficient', 'Expert'),
            defaultValue:'Basic'
        }
    }, {
        underscored:true
    });
};