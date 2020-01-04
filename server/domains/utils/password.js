/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * Created on Tues Apr 15 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 * 
 * Password:
 *  hashes a password string
 *
 * Fucntions:
 *      Hash
 *
 */

// Import hashing library
import bcrypt from 'bcrypt'
// Import configuration file
import config from '../../Infrastructure/utils/config'
import nexmo from 'nexmo'
import mailer from '../../Infrastructure/plugins/mailer'
import shortid from 'shortid'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

const Password = {

  /*
   * Hashing is done by bcrypt library
   * takes in password and returns Hash
   * Uses the obj to get access to properties
   */
    async hash(password) {

      winstonLogger.info('hash password static function')

      const SALT_WORK_FACTOR = 12

      winstonLogger
    // Generate a salt
      const hashedPassword = await new Promise((resolve, reject) => {

        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {

              winstonLogger.info('starting generation of salt and hash')
        if (err) {

              winstonLogger.info('error occured when salting with bcrypt')
          winstonLogger.error(e)

        }
        // Continues if no error
        winstonLogger.info(`SALT IS : ${salt}`)
        // Hash the password using our new salt
              bcrypt.hash(password, salt, (xerr, hash) => {

            if (xerr) {

              winstonLogger.info('error occured when hashing with bcrypt')
              winstonLogger.info(xerr)
              reject(err)

          }
          // Continues if there's no error while hashing

          // Prepare to send the password back
          winstonLogger.info(`HASH: ${hash} `)
          winstonLogger.info('done with generation of salt and hash')
            resolve(hash)

        })

          })

    })

    return Promise.resolve(hashedPassword)

  },

  /*
   * Compare is done by bcrypt library
   * it compares the input password to an already hashed password
   * with the same library
   */
    async compare(password, hashedPassword) {

    // User bcyprot to compare passwords[input with existing]
    const matched = await new Promise((resolve, reject) => {

            bcrypt.compare(password, hashedPassword, (err, isMatch) => {

          if (err) {

                    reject(err)

                }
        // Continues if there's no error
          resolve(isMatch)

      })

    })

      return Promise.resolve(matched)

  },

  /*
   * Initiates the password reset process.
   * sends a mail with a verification code
   * to the ${email} to be validated under a timeout
   */
    async initReset(email) {

    // Varaible to hold results to be sent back
      let verPack = {}
    // Generate verificationCode
      const verificationCode = shortid.generate()
    // Generate verificationCodeExpiration time 60mins from set time
    const verificationCodeExpiration = new Date().getTime()
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
      },
    })
    const message = {
            subject: 'arrms.netlify.com | Password Reset',
            to: email,
      from: `arrms.netlify.com <${config.gmailAddress}>`,
      html: `
            <h1>Hello ,</h1>
            <h2>Here is your password reset key</h2>
            <h2><code contenteditable="false" style="font-weight:200
            font-size:1.5rempadding:5px 10px background: #EEEEEE border:0">
            ${verificationCode}</code></h4>
            <p>Please ignore if you didn't try to reset your password on our platform</p>
            `,
        }

      winstonLogger.info('sending message ...')
      mailer(message)
      .then((response) => {

          winstonLogger.info(`${response}: message sent to ${email}`)
          verPack = {
          verificationCode,
            verificationCodeExpiration,
        }

      })
      .catch((err) => {

          winstonLogger.info(`could not send verification code: ${verificationCode}  to ${email}`)
        Promise.reject(err)

      })

      return Promise.resolve(verPack)

  },

    async initReset(phoneNumber) {

    // Varaible to hold results to be sent back
      const verPack = {}
    // Generate verificationCode
      const verificationCode = shortid.generate()
    // Generate verificationCodeExpiration time 60mins from set time
      const verificationCodeExpiration = new Date().getTime() + 60 * 60 * 1000

      const _nexmo = new nexmo({
        apiKey: config.nexmoApiKey,
        apiSecret: config.nexmoApiSecret,

    })

    //

  },

}

export default Password