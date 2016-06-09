// (C)grjoshi 3/30/2016
// PS2Utils.js - Utility functions for PredictSoft v2.00

var nodemailer = require('nodemailer');

var emailConfig = require('./smtpconfig.js');

/* logMe(message) - Log messages to console */

module.exports.logMe = function (message) {
    var dt = (new Date()).toString().split(' ').splice(1, 4).join(' ');
    console.log("[" + dt + "] " + message);
};

//send confirmation of prediction
module.exports.sendConfirmation = function(matchdate,confirmSnippet,nameOfPlayer,playerEmail){
    var title = "Predictsoft v2.10 - Thank you for submitting your prediction for " + matchdate;
    var messageBody = "<h1>Thank you " + nameOfPlayer + "!</h1><h2>We have received your submission for " + matchdate + ".</h2>"
        + "<p>&nbsp;</p>"+ confirmSnippet +"<p>&nbsp;</p>"
        + "<p><strong>Good luck!</strong></p>"
        + "<p><strong>The Predictsoft team</strong></p>"
        + "<p>&nbsp;</p><p><strong>&nbsp;</strong></p>";
    //confirmSnippet is sth like "You chose [TEAM] for the next match.";

    sendEmail(
        playerEmail,                //To
        'ever3stmomo@gmail.com',    //From
        title,                      //Title of email
        messageBody                 //Message Body
    );
};

//TODO:: run this as a separate node instance to be triggered by cron?
module.exports.sendAlerts = function(to, title,message){
    //....
};

module.exports.sendMessage = function(to, title,message){
    sendEmail(
        playerEmail,                        //To
        'nepalikancha2016@gmail.com',       //From
        title,                              //Title of email
        messageBody                         //Message Body
    );
};
//private email method
var sendEmail = function(to,from,title,mbody){

    var smtpConfig = {
      host: emailConfig.host,
        port: emailConfig.port,
        secure: true,           //use SSL
        auth: {
            user: emailConfig.user,
            pass: emailConfig.password
        }
    };

    var transporter =
        nodemailer.createTransport(smtpConfig);

    var mailOptions = {
        from: from,
        to: to,
        subject: title,
        html: mbody         //HTML text
    };

   // console.log("From",from,"TO:",to,"EMAIL TITLE:",title,"Message: ",mbody);

    transporter.sendMail(mailOptions, function (error,info){
        if(error){
            console.log(error);                                                            //does this go (in the future) into a separate verbose.log file?
            return;
        }
        console.log("Email sent to" , to , "successfully. Info.response =",info.response);       //does this go (in the future) into a separate verbose.log file?
    });
};