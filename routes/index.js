'use strict';

const AuthRouter   = require('./auth.route');
const UserRouter   = require('./user.route');
const QaJobsRouter = require('./qa_jobs.route');
const NotificationsRouter = require('./notifications.route');
const AdminNotificationsRouter = require('./admin_notifications.route');
const TagsRouter = require('./tags.route');

const prefix = '/api';

module.exports = (app) => {
    app.use(`${prefix}/auth`, AuthRouter);
    app.use(`${prefix}/user`, UserRouter);
    app.use(`${prefix}/qa-jobs`, QaJobsRouter);
    app.use(`${prefix}/notifications`, NotificationsRouter);
    app.use(`${prefix}/admin-notifications`, AdminNotificationsRouter);
    app.use(`${prefix}/tags`, TagsRouter);
};
