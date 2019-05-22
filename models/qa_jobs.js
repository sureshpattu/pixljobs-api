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
        status    :{
            type        :Sequelize.ENUM('closed', 'active', 'review', 'deleted'),
            defaultValue:'review'
        }
    }, {
        underscored:true,
        version    :true,
        deletedAt  :'destroyTime',
        paranoid   :true
    });
};