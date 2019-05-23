'use strict';

const AuthRouter      = require('./auth.route');
const UserRouter      = require('./user.route');
const QaJobsRouter    = require('./qa_jobs.route');
const QaJobCatRouter  = require('./qa_job_categories.route');
const QaJobTechRouter = require('./qa_job_technologies.route');
const JobsRouter      = require('./jobs.route');
const JobCatRouter    = require('./job_categories.route');
const JobTechRouter   = require('./job_technologies.route');
const JobLikesRouter  = require('./job_likes.route');

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

};
