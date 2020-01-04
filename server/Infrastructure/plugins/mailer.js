/**
 * #k_infinityIII@Echwood
 *
 * Mailer:
 *  sets up enviroment to send mails
 *
 * Fucntions:
 *
 *
 */
// Config settings
import config from '../utils/config';
// Node js mailing library
import nodemailer from 'nodemailer';

// Configure smtp transport machanism for password reset email
const transporter = nodemailer.createTransport({

  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    // Server|host gmail address
    user: config.gmailAddress,
    // Server|host gmail password
    pass: config.gmailPassword,
  }

});

// 
const mailer = (senderEmail,message) => {

    //
    transporter.sendMail(message).
    then((response) => {

        console.log(`${response}: message sent`);

    }).
    catch((err) => {

        console.log(`could not send to message`);
        Promise.reject(err);

    });

};

export default mailer;
