'use strict';

const AuthRouter            = require('./auth.route');
const UserRouter            = require('./user.route');
const QaJobsRouter          = require('./qa_jobs.route');
const CategoriesRouter      = require('./categories.route');
const RequirementsRouter    = require('./requirements.route');
const TechnologiesRouter    = require('./technologies.route');
const JobApplicationsRouter = require('./job_applications.route');
const JobCategoriesRouter   = require('./job_categories.route');
const JobRequirementsRouter = require('./job_requirements.route');

const prefix = '/api';

module.exports = (app) => {
    app.use(`${prefix}/auth`, AuthRouter);
    app.use(`${prefix}/user`, UserRouter);
    app.use(`${prefix}/qa-jobs`, QaJobsRouter);
    app.use(`${prefix}/categories`, CategoriesRouter);
    app.use(`${prefix}/requirements`, RequirementsRouter);
    app.use(`${prefix}/technologies`, TechnologiesRouter);
    app.use(`${prefix}/job-applications`, JobApplicationsRouter);
    app.use(`${prefix}/job-categories`, JobCategoriesRouter);
    app.use(`${prefix}/qa-requirements`, JobRequirementsRouter);
};
