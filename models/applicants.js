'use strict';

const config  = require('../config/config');
const crypto2 = require('crypto2');

module.exports = function(sequelize, Sequelize) {

    let Docs = sequelize.define('applicants', {
        id                :{
            type        :Sequelize.UUID,
            primaryKey  :true,
            defaultValue:Sequelize.UUIDV4,
            allowNull   :false
        },
        first_name        :{
            type        :Sequelize.STRING,
            defaultValue:''
        },
        last_name         :{
            type        :Sequelize.STRING,
            defaultValue:''
        },
        name              :{
            notEmpty:true,
            type    :Sequelize.STRING
        },
        title             :{
            type:Sequelize.STRING
        },
        uid               :{
            unique      :true,
            type        :Sequelize.STRING,
            defaultValue:function() {
                return `${Math.floor(1000000 + Math.random() * 9000000)}`;
            }
        },
        email             :{
            type    :Sequelize.STRING,
            validate:{
                isEmail:true
            },
            unique  :{
                args:true,
                msg :'Email address already in use!'
            }
        },
        password          :{
            type:Sequelize.STRING
        },
        dob               :{
            type:Sequelize.STRING
        },
        age               :{
            type:Sequelize.STRING
        },
        mobile            :{
            type  :Sequelize.STRING,
            unique:{
                args:true,
                msg :'Mobile number already in use!'
            }
        },
        mobile_code       :{
            type        :Sequelize.STRING,
            defaultValue:'91'
        },
        gender            :{
            allowNull:false,
            type     :Sequelize.ENUM('male', 'female', 'other')
        },
        photo             :{
            type:Sequelize.STRING
        },
        photo_type        :{
            type:Sequelize.STRING
        },
        qualification     :{
            type:Sequelize.STRING
        },
        exp_year          :{
            type:Sequelize.STRING
        },
        exp_month         :{
            type:Sequelize.STRING
        },
        current_salary    :{
            type:Sequelize.STRING
        },
        expected_salary   :{
            type:Sequelize.STRING
        },
        institution       :{
            type:Sequelize.STRING
        },
        institution_city  :{
            type:Sequelize.STRING
        },
        home_city      :{
            type:Sequelize.TEXT
        },
        current_city      :{
            type:Sequelize.TEXT
        },
        relocation        :{
            type        :Sequelize.BOOLEAN,
            defaultValue:false
        },
        resume            :{
            type:Sequelize.STRING
        },
        resume_type       :{
            type:Sequelize.STRING
        },
        designation       :{
            type:Sequelize.STRING
        },
        company           :{
            type:Sequelize.STRING
        },
        joined_at         :{
            type:Sequelize.STRING
        },
        user_type         :{
            type        :Sequelize.STRING,
            defaultValue:'6'
        },
        token             :{
            type:Sequelize.STRING
        },
        token_time        :{
            type:Sequelize.DATE
        },
        reset_token       :{
            type:Sequelize.STRING
        },
        email_token       :{
            type:Sequelize.STRING
        },
        is_email_verified :{
            type        :Sequelize.BOOLEAN,
            defaultValue:false
        },
        is_mobile_verified:{
            type        :Sequelize.BOOLEAN,
            defaultValue:false
        },
        mobile_otp        :{
            type:Sequelize.STRING
        },
        otp_verify_count  :{
            type        :Sequelize.INTEGER,
            defaultValue:0
        },
        has_login         :{
            type        :Sequelize.ENUM('YES', 'NO'),
            defaultValue:'YES'
        },
        last_login        :{
            type:Sequelize.DATE
        },
        created_at        :{
            type:Sequelize.DATE
        },
        updated_at        :{
            type:Sequelize.DATE
        }
    }, {
        underscored:true
    });

    Docs.prototype.validPassword = async function(password) {
        const decrypted = await crypto2.decrypt(this.password, config.hashSalt2, config.hashIV);
        return password === decrypted;
    };

    Docs.prototype.validOTP = async function(mobile_otp) {
        const decrypted = await crypto2.decrypt(this.mobile_otp, config.hashSalt2, config.hashIV);
        return mobile_otp === decrypted;
    };

    Docs.prototype.toJSON = function() {
        let values = Object.assign({}, this.get());

        delete values.password;
        return values;
    };

    return Docs;
};
