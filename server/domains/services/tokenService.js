/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * tokenService:
 *
 * Fucntions:
 *      create Token
 *      decode Token
 *      verify Token
 *
 */

import GetAccessToken from '../../app/usecase/GetAccesToken'
import VerifyAccessToken from '../../app/usecase/VerifyAccessToken'
import jwtAccessTokenManager from '../../interfaces/security/jwtAccessTokenManager'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'


const tokenService = {

  /*
   * generate new token for authenticated user
   */
  async generateToken(payload) {

    winstonLogger.info('Generate Token')
    // Return a boolean(true) and signed JWT
    const Token = new GetAccessToken(jwtAccessTokenManager).
    execute(payload)

    return Promise.resolve(Token)

  },

  /*
   * decode token for authorisation
   */
  async decodeToken(aToken) {

    // Return a decoded token 
    const decodedToken = new VerifyAccessToken(jwtAccessTokenManager).
    execute(aToken)

    winstonLogger.info('DECODED_TOKEN:')
    winstonLogger.info(JSON.stringify(decodedToken,null,4))

    return Promise.resolve(decodedToken)

  }

}

export default tokenService