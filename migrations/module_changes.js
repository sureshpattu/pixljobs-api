module.exports = {
    up  :function(migration, DataTypes, done) {
        // add altering commands here, calling 'done' when finished

        //Applicants table
        migration.addColumn(
            'applicants',
            'institution_city',
            {type:Sequelize.STRING}
        );
        migration.addColumn(
            'applicants',
            'current_city',
            {type:Sequelize.TEXT}
        );
        migration.addColumn(
            'applicants',
            'relocation',
            {
                type        :Sequelize.BOOLEAN,
                defaultValue:false
            }
        );

        //QAJobs table
        migration.addColumn(
            'qa_jobs',
            'status',
            {
                type        :Sequelize.ENUM('inProgress', 'closed', 'published', 'pending', 'rejected', 'deleted'),
                defaultValue:'pending'
            }
        );

        //Jobs table
        migration.addColumn(
            'jobs',
            'status',
            {
                type        :Sequelize.ENUM('inProgress', 'closed', 'published', 'pending', 'rejected', 'deleted'),
                defaultValue:'pending'
            }
        );

        done();
    },
    down:function(migration, DataTypes, done) {
        // add reverting commands here, calling 'done' when finished
        done();
    }
};
