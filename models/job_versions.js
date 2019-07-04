'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('qa_job_versions', {
        id       :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        qa_job_id:{
            type:Sequelize.UUID
        },
        job_id   :{
            type:Sequelize.UUID
        },
        admin_id :{
            type:Sequelize.UUID
        }
    }, {
        underscored:true
    });
};