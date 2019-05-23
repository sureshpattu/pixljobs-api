'use strict';

const AuthRouter   = require('./auth.route');
const UserRouter   = require('./user.route');
const QaJobsRouter = require('./qa_jobs.route');
const CompaniesRouter = require('./companies.route');
const BenefitsRouter = require('./benefits.route');

const prefix = '/api';

module.exports = (app) => {
    app.use(`${prefix}/auth`, AuthRouter);
    app.use(`${prefix}/user`, UserRouter);
    app.use(`${prefix}/qa-jobs`, QaJobsRouter);
    app.use(`${prefix}/companies`, CompaniesRouter);
    app.use(`${prefix}/benefits`, BenefitsRouter);
};
'use strict';