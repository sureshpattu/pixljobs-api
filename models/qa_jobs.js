'use strict';

module.exports = function(sequelize, Sequelize) {

    return sequelize.define('qa_jobs', {
        id             :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        name           :{
            type:Sequelize.TEXT('long')
        },
        desc           :{
            type:Sequelize.TEXT('long')
        },
        recruiter_id   :{
            type:Sequelize.UUID
        },
        company_id     :{
            type:Sequelize.UUID
        },
        salary_min     :{
            type:Sequelize.STRING
        },
        salary_max     :{
            type:Sequelize.STRING
        },
        is_salary      :{
            type        :Sequelize.BOOLEAN,
            defaultValue:true
        },
        position_count :{
            type:Sequelize.STRING
        },
        end_date       :{
            type:Sequelize.STRING
        },
        resume_status  :{
            type        :Sequelize.BOOLEAN,
            defaultValue:false
        },
        education_level:{
            type        :Sequelize.ENUM('Secondary', 'Higher Secondary', 'Diploma', 'Bachelors', 'Masters',
                'Doctorate'),
            defaultValue:'Secondary'
        },
        urgent_status  :{
            type        :Sequelize.ENUM('days', 'week', 'weeks', 'month', 'none'),
            defaultValue:'none'
        },
        job_type       :{
            type        :Sequelize.ENUM('FullTime', 'PartTime', 'Contract', 'Internship', 'Volunteer', 'Temporary'),
            defaultValue:'FullTime'
        },
        location_type  :{
            type        :Sequelize.ENUM('office', 'remote'),
            defaultValue:'office'
        },
        action         :{
            type        :Sequelize.ENUM('open', 'closed'),
            defaultValue:'open'
        },
        phone_code     :{
            type:Sequelize.STRING
        },
        phone_number   :{
            type:Sequelize.STRING
        },
        mobile_code    :{
            type:Sequelize.STRING
        },
        mobile_number  :{
            type:Sequelize.STRING
        },
        street         :{
            type:Sequelize.STRING
        },
        area_in        :{
            type:Sequelize.STRING
        },
        area           :{
            type:Sequelize.STRING
        },
        locality       :{
            type:Sequelize.STRING
        },
        city           :{
            type:Sequelize.STRING
        },
        state          :{
            type:Sequelize.STRING
        },
        pin            :{
            type:Sequelize.STRING
        },
        country        :{
            type:Sequelize.STRING
        },
        email          :{
            type:Sequelize.STRING
        },
        work_week      :{
            type:Sequelize.STRING
        },
        holidays       :{
            type:Sequelize.STRING
        },
        exp_year       :{
            type:Sequelize.STRING
        },
        exp_month      :{
            type:Sequelize.STRING
        },
        status         :{
            type        :Sequelize.ENUM('inProgress', 'closed', 'published', 'pending', 'rejected', 'deleted'),
            defaultValue:'pending'
        },
        admin_id       :{
            type:Sequelize.UUID
        },
        admin_msg      :{
            type:Sequelize.TEXT('long')
        },
        admin_date     :{
            type:Sequelize.STRING
        },
        is_active      :{
            type        :Sequelize.BOOLEAN,
            defaultValue:true
        }
    }, {
        underscored:true
    });
};