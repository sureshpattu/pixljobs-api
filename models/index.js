'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(__filename);
const env       = process.env.NODE_ENV || 'development';
const config    = require(__dirname + '/../config/config.json')[env];
global.db       = {};
let sequelize;

if(config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(file => {
    let model      = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
    if(db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//Users
db.recruiters.hasMany(db.jobs);

//Jobs
db.jobs.hasMany(db.job_applications);
db.jobs.hasMany(db.job_likes);
db.jobs.hasMany(db.job_requirements);
db.jobs.hasMany(db.job_technologies);
db.jobs.hasMany(db.job_categories);

db.job_applications.belongsTo(db.applicants);
db.job_applications.belongsTo(db.jobs);

db.job_likes.belongsTo(db.applicants);
db.job_likes.belongsTo(db.jobs);

db.job_requirements.belongsTo(db.jobs);
db.job_requirements.belongsTo(db.requirements);

db.job_technologies.belongsTo(db.jobs);
db.job_technologies.belongsTo(db.technologies);

db.job_categories.belongsTo(db.jobs);
db.job_categories.belongsTo(db.categories);

//Companies
db.companies.hasMany(db.company_benefits);

db.companies.belongsTo(db.recruiters);

db.company_benefits.belongsTo(db.companies);
db.company_benefits.belongsTo(db.benefits);

//Notifications
db.admin_notifications.belongsTo(db.applicants);
db.admin_notifications.belongsTo(db.jobs);

module.exports = db;
