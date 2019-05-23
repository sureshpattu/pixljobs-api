'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('job_categories', {
        id     :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        job_id :{
            type:Sequelize.UUID
        },
        category_id:{
            type:Sequelize.UUID
        },
        status :{
            type        :Sequelize.ENUM('pending', 'viewed', 'shortlisted', 'downloaded'),
            defaultValue:'pending'
        }
    }, {
        underscored:true,
        version    :true,
        deletedAt  :'destroyTime',
        paranoid   :true
    });
};