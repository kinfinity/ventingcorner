/*
 * #k_infinityIII@
 *
 * GetAccesToken: () :
 *
 */
import fs from 'fs'
import config from '../../Infrastructure/utils/config'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'

export default class {

  constructor(TokenManager) {

    this.TokenManager = TokenManager
    winstonLogger.info('Refresh TokenManager set')

    }

    execute(payload) {

      winstonLogger.info('encoding payload into Token')
      //
      const options = {
        issuer: config.serverID,
        subject: 'accessToken',
        expiresIn: '20h',
        algorithm: 'RS256',
        audience: 'serps'
        }
        
      return this.TokenManager.generate(payload, options)

  }

}