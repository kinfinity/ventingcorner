/*
 * #k_infinityIII
 *
 * JwtAccesTokenManager: (implementation)
 *
 *    generates | decodes signed (JWT) token
 *
 */

import config from '../../Infrastructure/utils/config'
import jwt from 'jsonwebtoken'
import winstonLogger from '../../Infrastructure/utils/winstonLogger';

const privateKey = config.tokenPrivateKey
const publicKey = config.tokenPublicKey

export default class {
  
  // Generate a new access token for an authenticated user | from a client
  static generate(payload, options) {
      
    let Token = null

    winstonLogger.info('PrivateKey for Token encryption')
    winstonLogger.info(JSON.stringify(privateKey,null,4))
      winstonLogger.info('Token Data')
      winstonLogger.info(JSON.stringify(payload,null,4))
      winstonLogger.info('Token Options')
      winstonLogger.info(JSON.stringify(options,null,4))

      try {
           
        Token = jwt.sign(
          payload,
          privateKey,
          options
        )

      } catch (e) {
        
        winstonLogger.error('Error generating Token')
        winstonLogger.error(e.message)

      }
       
      winstonLogger.info('Token')
      winstonLogger.info(JSON.stringify(Token,null,4))

      return Token

  }

  static verify(Token, options) {

    let res = null
      //equally decodes the token
      
      try{

        res = jwt.verify(Token, publicKey, options)
        winstonLogger.info(JSON.stringify(res,null,4))

      }catch(e){
        
        winstonLogger.error('ERROR:')
        winstonLogger.error(e.message)

      }
      return res

  }
  
  static destroy(Token) {

    return jwt.destroy(Token)

  }

}
