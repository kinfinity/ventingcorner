/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * config : () :
 *      load from .env with dotenv
 * 
 */

import winstonLogger from './winstonLogger'

const path = require('path')
const fs = require('fs')


let _tokenPrivateKey = null, _tokenPublicKey = null
try {
  
  // _tokenPrivateKey = fs.readFileSync(__dirname + '/../certs/token/private.key','utf-8') 
  // _tokenPublicKey = fs.readFileSync(__dirname + '/../certs/token/public.key','utf-8')
  _tokenPrivateKey = fs.readFileSync(__dirname + '/../bin/certs/token/rsa_private.pem','utf-8') 
  _tokenPublicKey = fs.readFileSync(__dirname + '/../bin/certs/token/rsa_public.pem','utf-8')
  
  winstonLogger.info('PRIVATE KEY:')
  winstonLogger.info(_tokenPrivateKey)
  winstonLogger.info('PUBLIC KEY:')
  winstonLogger.info(_tokenPublicKey)

} catch (e) {

  winstonLogger.error('ERROR:')
  winstonLogger.error(e.message)
  winstonLogger.error(e.stack)

}

let config = null
if(require('dotenv').config({path: path.join(__dirname, './../../../.env')})){

  config = {

    serverPort: process.env.serverPORT,
    dbName: process.env.DB_NAME,
    dbURI: process.env.DB_CON,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    auth0Domain: process.env.AUTH0_DOMAIN,
    auth0client: process.env.AUTH0_CLIENT_ID,
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
    gmailAddress: process.env.GMAILADD,
    gmailPassword: process.env.GMAILPWD,
    nexmoApiKey: process.env.NEXMO_API_KEY,
    nexmoApiSecret: process.env.NEXMO_API_SECRET,
    cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY,
    cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    serverID: process.env.serverID,
    tokenPrivateKey: _tokenPrivateKey,// || process.env.TOKEN_PRIVATEKEY,
    tokenPublicKey: _tokenPublicKey// || process.env.TOKEN_PUBLICKEY

  }

}

export default config