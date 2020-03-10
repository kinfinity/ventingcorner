/*
 * #k_infinityIII@
 *
 * VerifyAccesToken: () :
 *
 */
import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import config from '../../Infrastructure/utils/config'

export default class {

  constructor(TokenManager) {

        this.TokenManager = TokenManager

    }

    execute(Token) {

      winstonLogger.info('Verifying Token')
      
      const options = {
        issuer: config.serverID,
        subject: 'accessToken',
        expiresIn: '1h',
        algorithm: ['RS256'],
        audience: 'serps'
        }

    return  this.TokenManager.verify(Token,options)

  }

}