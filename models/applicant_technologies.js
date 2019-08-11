'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('applicant_technologies', {
        id           :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        applicant_id :{
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
        },
        exp_month    :{
            type:Sequelize.STRING
        },
        exp_year     :{
            type:Sequelize.STRING
        }
    }, {
        underscored:true
    });
};