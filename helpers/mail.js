let nodemailer   = require('nodemailer');
const fs         = require('fs'),
      config     = require('../config/config'),
      MailConfig = require('../config/mail_config'),
      path       = require('path'),
      Handlebars = require('handlebars');

let transporter = nodemailer.createTransport(MailConfig);

module.exports = {

    sendMail              :function(req, options) {
        if(options.hasOwnProperty('from') && options.hasOwnProperty('to') && options.hasOwnProperty('subject') &&
            options.hasOwnProperty('body')) {
            // if (options.to && req.hostname === 'localhost') {
            //     options.to = 'sureshpattu2002@gmail.com'
            // }
            let mailOptions = {
                from   :options.from, // sender address
                to     :options.to, // list of receivers
                subject:options.subject, // Subject line
                html   :options.body // email body
            };

            transporter.sendMail(mailOptions, function(error, response) {
                if(error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + response);
                }

                transporter.close(); // shut down the connection pool, no more messages
            });
        }
    },
    sendWelcomeMail       :function(req, email, url) {
        let source   = fs.readFileSync(path.join(__dirname, '../routes/templates/welcome_mail.hbs'), 'utf8');
        let template = Handlebars.compile(source);
        template     = template({url:url});

        let mailOptions = {
            from   :config.domain_email,
            to     :email,
            subject:'Welcome to Pixljobs',
            html   :template
        };

        if(mailOptions.hasOwnProperty('from') && mailOptions.hasOwnProperty('to') &&
            mailOptions.hasOwnProperty('subject') &&
            mailOptions.hasOwnProperty('html')) {

            transporter.sendMail(mailOptions, function(error, response) {
                if(error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + response);
                }

                transporter.close(); // shut down the connection pool, no more messages
            });
        }
    },
    sendEmailVerifyMail   :function(req, email, url) {
        let source   = fs.readFileSync(path.join(__dirname, '../routes/templates/verify_mail.hbs'), 'utf8');
        let template = Handlebars.compile(source);
        template     = template({url:url});

        let mailOptions = {
            from   :config.domain_email,
            to     :email,
            subject:'Verify Your Email Address',
            html   :template
        };
        if(mailOptions.hasOwnProperty('from') && mailOptions.hasOwnProperty('to') &&
            mailOptions.hasOwnProperty('subject') &&
            mailOptions.hasOwnProperty('html')) {

            transporter.sendMail(mailOptions, function(error, response) {
                if(error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + response);
                }

                transporter.close(); // shut down the connection pool, no more messages
            });
        }
    },
    sendForgotPasswordMail:function(req, email, url) {
        let source   = fs.readFileSync(path.join(__dirname, '../routes/templates/reset_password_mail.hbs'), 'utf8');
        let template = Handlebars.compile(source);
        template     = template({url:url});

        let mailOptions = {
            from   :config.domain_email,
            to     :email,
            subject:'Reset Password',
            html   :template
        };
        if(mailOptions.hasOwnProperty('from') && mailOptions.hasOwnProperty('to') &&
            mailOptions.hasOwnProperty('subject') &&
            mailOptions.hasOwnProperty('html')) {

            transporter.sendMail(mailOptions, function(error, response) {
                if(error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + response);
                }

                transporter.close(); // shut down the connection pool, no more messages
            });
        }
    },
    sendNewApplicationMail:function(req, email, job_name, url) {
        let source   = fs.readFileSync(path.join(__dirname, '../routes/templates/new_application.hbs'), 'utf8');
        let template = Handlebars.compile(source);
        template     = template({url:url, job_name:job_name});

        let mailOptions = {
            from   :config.domain_email,
            to     :email,
            subject:'Job Application',
            html   :template
        };
        if(mailOptions.hasOwnProperty('from') && mailOptions.hasOwnProperty('to') &&
            mailOptions.hasOwnProperty('subject') &&
            mailOptions.hasOwnProperty('html')) {

            transporter.sendMail(mailOptions, function(error, response) {
                if(error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + response);
                }

                transporter.close(); // shut down the connection pool, no more messages
            });
        }
    },
    sendJobStatusMail     :function(req, email, subject, msg, url) {
        let source   = fs.readFileSync(path.join(__dirname, '../routes/templates/job_status.hbs'), 'utf8');
        let template = Handlebars.compile(source);
        template     = template({url:url, msg:msg});

        let mailOptions = {
            from   :config.domain_email,
            to     :email,
            subject:'Your Job ' + subject,
            html   :template
        };
        if(mailOptions.hasOwnProperty('from') && mailOptions.hasOwnProperty('to') &&
            mailOptions.hasOwnProperty('subject') &&
            mailOptions.hasOwnProperty('html')) {

            transporter.sendMail(mailOptions, function(error, response) {
                if(error) {
                    console.log(error);
                } else {
                    console.log('Message sent: ' + response);
                }

                transporter.close(); // shut down the connection pool, no more messages
            });
        }
    }

};