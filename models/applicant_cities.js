'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('applicant_cities', {
        id          :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        city_id     :{
            allowNull:false,
            type     :Sequelize.UUID
        },
        applicant_id:{
            allowNull:false,
            type     :Sequelize.UUID
        }
    }, {
        underscored:true
    });
};