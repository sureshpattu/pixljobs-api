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
db.recruiters.hasMany(db.qa_jobs);
db.recruiters.hasMany(db.companies);

//Jobs
db.jobs.hasMany(db.job_applications);
db.jobs.hasMany(db.job_likes);
db.jobs.hasMany(db.job_requirements);
db.jobs.hasMany(db.job_technologies);
db.jobs.hasMany(db.job_categories);
db.jobs.belongsTo(db.recruiters);
db.jobs.belongsTo(db.qa_jobs);
db.jobs.belongsTo(db.companies);

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

//QA Jobs
db.qa_jobs.hasMany(db.qa_job_technologies);
db.qa_jobs.hasMany(db.qa_job_categories);
db.qa_jobs.hasMany(db.jobs);
db.qa_jobs.belongsTo(db.companies);
db.qa_jobs.belongsTo(db.recruiters);

db.qa_job_technologies.belongsTo(db.qa_jobs);
db.qa_job_technologies.belongsTo(db.technologies);

db.qa_job_categories.belongsTo(db.qa_jobs);
db.qa_job_categories.belongsTo(db.categories);

//Companies
db.companies.hasMany(db.company_benefits);

db.companies.belongsTo(db.recruiters);
db.companies.belongsTo(db.industries);

db.company_benefits.belongsTo(db.companies);
db.company_benefits.belongsTo(db.benefits);

//Notifications
db.admin_notifications.belongsTo(db.applicants);
db.admin_notifications.belongsTo(db.jobs);

module.exports = db;
