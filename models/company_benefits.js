module.exports = function(sequelize, Sequelize) {

    return sequelize.define('company_benefits', {
        id          :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        company_id:{
            type     :Sequelize.UUID,
            allowNull:false
        },
        benefit_id  :{
            type     :Sequelize.UUID,
            allowNull:false
        }
    }, {
        underscored:true
    });
};