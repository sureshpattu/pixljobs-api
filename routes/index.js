'use strict';

const AuthRouter               = require('./auth.route');
const UserRouter               = require('./applicant.route');
const QaJobsRouter             = require('./qa_jobs.route');
const QaJobCatRouter           = require('./qa_job_categories.route');
const QaJobTechRouter          = require('./qa_job_technologies.route');
const JobsRouter               = require('./jobs.route');
const JobCatRouter             = require('./job_categories.route');
const JobTechRouter            = require('./job_technologies.route');
const JobLikesRouter           = require('./job_likes.route');
const CategoriesRouter         = require('./categories.route');
const RequirementsRouter       = require('./requirements.route');
const TechnologiesRouter       = require('./technologies.route');
const JobApplicationsRouter    = require('./job_applications.route');
const JobCategoriesRouter      = require('./job_categories.route');
const JobRequirementsRouter    = require('./job_requirements.route');
const CompaniesRouter          = require('./companies.route');
const BenefitsRouter           = require('./benefits.route');
const NotificationsRouter      = require('./notifications.route');
const AdminNotificationsRouter = require('./admin_notifications.route');
const TagsRouter               = require('./tags.route');
const CompanyBenefits = require('./company_benefits.route');

const prefix = '/api';

module.exports = (app) => {
    app.use(`${prefix}/auth`, AuthRouter);
    app.use(`${prefix}/user`, UserRouter);

    //QA
    app.use(`${prefix}/qa-jobs`, QaJobsRouter);
    app.use(`${prefix}/qa-job/categories`, QaJobCatRouter);
    app.use(`${prefix}/qa-job/technologies`, QaJobTechRouter);

    //Production
    app.use(`${prefix}/jobs`, JobsRouter);
    app.use(`${prefix}/job/categories`, JobCatRouter);
    app.use(`${prefix}/job/technologies`, JobTechRouter);

    app.use(`${prefix}/job/likes`, JobLikesRouter);
    app.use(`${prefix}/categories`, CategoriesRouter);
    app.use(`${prefix}/requirements`, RequirementsRouter);
    app.use(`${prefix}/technologies`, TechnologiesRouter);
    app.use(`${prefix}/job-applications`, JobApplicationsRouter);
    app.use(`${prefix}/job-categories`, JobCategoriesRouter);
    app.use(`${prefix}/qa-requirements`, JobRequirementsRouter);
    app.use(`${prefix}/job-requirements`, JobRequirementsRouter);
    app.use(`${prefix}/companies`, CompaniesRouter);
    app.use(`${prefix}/benefits`, BenefitsRouter);
    app.use(`${prefix}/notifications`, NotificationsRouter);
    app.use(`${prefix}/admin-notifications`, AdminNotificationsRouter);
    app.use(`${prefix}/tags`, TagsRouter);
    app.use(`${prefix}/company-benefits`,CompanyBenefits);
};
