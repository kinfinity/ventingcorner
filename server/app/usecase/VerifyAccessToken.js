/*
 * #k_infinityIII@Echwood
 *
 * VerifyAccesToken: () :
 *      Promises Bluebird
 *
 */
import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import config from '../../Infrastructure/utils/config'

export default class {

  constructor(accessTokenManager) {

        this.accessTokenManager = accessTokenManager

    }

    execute(accessToken) {

      winstonLogger.info('Verifying Token')
      
      const options = {
        issuer: config.serverID,
        subject: 'accessToken',
        expiresIn: '1h',
        algorithm: ['RS256'],
        audience: 'serps'
        }

    return  this.accessTokenManager.verify(accessToken,options)

  }

}