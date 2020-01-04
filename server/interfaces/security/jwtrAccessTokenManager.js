/*
 * #k_infinityIII@Echwood
 *
 * JwtAccesTokenManager: (implementation)
 *
 *    generates | decodes signed (JWT) token
 *
 */

import config from '../../Infrastructure/utils/config'
import JWTR from 'jwt-redis'
import Redis from 'ioredis'
import winstonLogger from '../../Infrastructure/utils/winstonLogger';

const redis = new Redis()
const jwtr = new JWTR(redis)

const privateKey = config.tokenPrivateKey
const publicKey = config.tokenPublicKey

export default class {
  
  // Generate a new access token for an authenticated user | from a client
  static generate(payload, options) {
      
    let Token = null

    winstonLogger.info('PrivateKey for Token encryption')
    winstonLogger.info(privateKey)
      winstonLogger.info('Token Data')
      winstonLogger.info(JSON.stringify(payload))
      winstonLogger.info('Token Options')
      winstonLogger.info(options)

      Token = jwtr.sign({
          email: payload.email,
          name: payload.Name
        },
        privateKey,
        options
      ).
      then((tk) => {
        
        winstonLogger.info('processing Token')
        winstonLogger.info(JSON.stringify(tk))
        Token = tk
      
      }).
      catch((e) => {
        winstonLogger.error('Error generating Token')
        winstonLogger.error(e)
      })
        
      winstonLogger.info('Token')
      winstonLogger.info(JSON.stringify(Token))

      return Token

  }

  static verify(accessToken, options) {

      //equally decodes the token
      return jwtr.verify(accessToken, publicKey, options)

  }
  
  static destroy(accessToken) {

    return jwtr.destroy()

  }

}
