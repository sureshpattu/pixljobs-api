const Sequelize = require('sequelize');
module.exports  = {
    up  :function(migration, DataTypes, done) {
        // add altering commands here, calling 'done' when finished

        //qa_jobs table
        migration.addColumn(
            'qa_jobs',
            'is_salary',
            {
                type        :Sequelize.BOOLEAN,
                defaultValue:true
            }
        );
        migration.addColumn(
            'qa_jobs',
            'area_in',
            {
                type:Sequelize.STRING
            }
        );

        //jobs table
        migration.addColumn(
            'jobs',
            'is_salary',
            {
                type        :Sequelize.BOOLEAN,
                defaultValue:true
            }
        );
        migration.addColumn(
            'jobs',
            'area_in',
            {
                type:Sequelize.STRING
            }
        );

        //qa_job_technologies table
        migration.addColumn(
            'qa_job_technologies',
            'level',
            {
                type        :Sequelize.ENUM('Basic', 'Proficient', 'Expert'),
                defaultValue:'Basic'
            }
        );

        //job_technologies table
        migration.addColumn(
            'job_technologies',
            'level',
            {
                type        :Sequelize.ENUM('Basic', 'Proficient', 'Expert'),
                defaultValue:'Basic'
            }
        );

        //applicants table
        migration.addColumn(
            'applicants',
            'home_city',
            {
                type:Sequelize.TEXT
            }
        );

        //applicant_languages table
        migration.addColumn(
            'applicant_languages',
            'exp_month',
            {
                type:Sequelize.STRING
            }
        );
        migration.addColumn(
            'applicant_languages',
            'exp_year',
            {
                type:Sequelize.STRING
            }
        );

        //applicant_technologies table
        migration.addColumn(
            'applicant_technologies',
            'exp_month',
            {
                type:Sequelize.STRING
            }
        );
        migration.addColumn(
            'applicant_technologies',
            'exp_year',
            {
                type:Sequelize.STRING
            }
        );

        done();
    },
    down:function(migration, DataTypes, done) {
        // add reverting commands here, calling 'done' when finished
        done();
    }
};
