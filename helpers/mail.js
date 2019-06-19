let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    secureConnection: true,
    port: 465,
    auth: {
        user: "AKIAIX5VT425Q5J7V24Q",
        pass: "AgBzt/Y2Yb21hgvYcH5A6iMSc+mLdsxjIh4ALeZZooNi"
    }
});


module.exports = {

    sendMail: function (req, options) {
        if (options.hasOwnProperty('from') && options.hasOwnProperty('to') && options.hasOwnProperty('subject') && options.hasOwnProperty('body')) {
            // if (options.to && req.hostname === 'localhost') {
            //     options.to = 'sureshpattu2002@gmail.com'
            // }
            let mailOptions = {
                from: options.from, // sender address
                to: options.to, // list of receivers
                subject: options.subject, // Subject line
                html: options.body // email body
            };

            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response);
                }

                transporter.close(); // shut down the connection pool, no more messages
            });
        }
    }

};