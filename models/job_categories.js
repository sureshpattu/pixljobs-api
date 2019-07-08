'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('job_categories', {
        id         :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        qa_job_id  :{
            type:Sequelize.UUID
        },
        job_id     :{
            allowNull:false,
            type     :Sequelize.UUID
        },
        category_id:{
            allowNull:false,
            type     :Sequelize.UUID
        }
    }, {
        underscored:true,
        version    :true
    });
};