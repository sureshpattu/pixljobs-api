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

        done();
    },
    down:function(migration, DataTypes, done) {
        // add reverting commands here, calling 'done' when finished
        done();
    }
};
