'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('job_technologies', {
        id           :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        job_id       :{
            allowNull:false,
            type     :Sequelize.UUID
        },
        technology_id:{
            allowNull:false,
            type     :Sequelize.UUID
        }
    }, {
        underscored:true
    });
};