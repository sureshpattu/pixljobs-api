'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('applicant_languages', {
        id          :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        applicant_id:{
            allowNull:false,
            type     :Sequelize.UUID
        },
        language_id :{
            allowNull:false,
            type     :Sequelize.UUID
        },
        level       :{
            type        :Sequelize.ENUM('Basic', 'Proficient', 'Expert'),
            defaultValue:'Basic'
        }
    }, {
        underscored:true
    });
};