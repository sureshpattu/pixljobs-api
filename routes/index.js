'use strict';

const AdminRouter               = require('./admin.route');
const AdminAuthRouter           = require('./admin_auth.route');
const Auth                      = require('./auth.route');
const ApplicantAuthRouter       = require('./applicant_auth.route');
const RecruiterAuthRouter       = require('./recruiter_auth.route');
const ApplicantRouter           = require('./applicant.route');
const ApplicantTechnologyRouter = require('./applicant_technologies.route');
const ApplicantLanguagesRouter  = require('./applicant_languages.route');
const QaJobsRouter              = require('./qa_jobs.route');
const QaJobCatRouter            = require('./qa_job_categories.route');
const QaJobTechRouter           = require('./qa_job_technologies.route');
const QaJobReqRouter            = require('./qa_job_requirements.route');
const JobsRouter                = require('./jobs.route');
const JobCatRouter              = require('./job_categories.route');
const JobTechRouter             = require('./job_technologies.route');
const JobLikesRouter            = require('./job_likes.route');
const CategoriesRouter          = require('./categories.route');
const RequirementsRouter        = require('./requirements.route');
const TechnologiesRouter        = require('./technologies.route');
const JobApplicationsRouter     = require('./job_applications.route');
const JobCategoriesRouter       = require('./job_categories.route');
const JobRequirementsRouter     = require('./job_requirements.route');
const CompaniesRouter           = require('./companies.route');
const BenefitsRouter            = require('./benefits.route');
const NotificationsRouter       = require('./notifications.route');
const AdminNotificationsRouter  = require('./admin_notifications.route');
const TagsRouter                = require('./tags.route');
const CompanyBenefits           = require('./company_benefits.route');
const RecruiterRouter           = require('./recruiter.route');
const CompanyUsersRouter        = require('./company_users.route');
const RolesRouter               = require('./roles.route');
const IndustriesRouter          = require('./industries.route');
const QAJobVersionRouter        = require('./qa_job_versions.route');
const JobVersionRouter          = require('./job_versions.route');
const CountryCodeRouter         = require('./country_code.route');
const LanguagesRouter           = require('./languages.route');

const prefix = '/api';

module.exports = (app) => {
    app.use(`${prefix}/admin-auth`, AdminAuthRouter);
    app.use(`${prefix}/admin`, AdminRouter);
    app.use(`${prefix}/admin-notifications`, AdminNotificationsRouter);
    app.use(`${prefix}/notifications`, NotificationsRouter);

    app.use(`${prefix}/auth`, Auth);
    app.use(`${prefix}/applicant-auth`, ApplicantAuthRouter);
    app.use(`${prefix}/applicant`, ApplicantRouter);
    app.use(`${prefix}/applicant/technologies`, ApplicantTechnologyRouter);
    app.use(`${prefix}/applicant/languages`, ApplicantLanguagesRouter);

    app.use(`${prefix}/recruiter-auth`, RecruiterAuthRouter);
    app.use(`${prefix}/recruiter`, RecruiterRouter);

    //QA
    app.use(`${prefix}/qa-jobs`, QaJobsRouter);
    app.use(`${prefix}/qa-job/categories`, QaJobCatRouter);
    app.use(`${prefix}/qa-job/technologies`, QaJobTechRouter);
    app.use(`${prefix}/qa-job/requirements`, QaJobReqRouter);
    app.use(`${prefix}/qa-job/version`, QAJobVersionRouter);

    //Published
    app.use(`${prefix}/jobs`, JobsRouter);
    app.use(`${prefix}/job/categories`, JobCatRouter);
    app.use(`${prefix}/job/technologies`, JobTechRouter);
    app.use(`${prefix}/job/requirements`, JobRequirementsRouter);
    app.use(`${prefix}/job/version`, JobVersionRouter);

    app.use(`${prefix}/job/likes`, JobLikesRouter);
    app.use(`${prefix}/categories`, CategoriesRouter);
    app.use(`${prefix}/requirements`, RequirementsRouter);
    app.use(`${prefix}/technologies`, TechnologiesRouter);
    app.use(`${prefix}/job-applications`, JobApplicationsRouter);
    app.use(`${prefix}/job-categories`, JobCategoriesRouter);
    app.use(`${prefix}/companies`, CompaniesRouter);
    app.use(`${prefix}/benefits`, BenefitsRouter);
    app.use(`${prefix}/tags`, TagsRouter);
    app.use(`${prefix}/company-benefits`, CompanyBenefits);
    app.use(`${prefix}/industries`, IndustriesRouter);

    app.use(`${prefix}/company-users`, CompanyUsersRouter);
    app.use(`${prefix}/roles`, RolesRouter);
    app.use(`${prefix}/country-code`, CountryCodeRouter);
    app.use(`${prefix}/languages`, LanguagesRouter);
};
