'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('job_likes', {
        id     :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        job_id :{
            allowNull:false,
            type     :Sequelize.UUID
        },
        user_id:{
            allowNull:false,
            type     :Sequelize.UUID
        }
    }, {
        underscored:true,
        version    :true,
        deletedAt  :'destroyTime',
        paranoid   :true
    });
};