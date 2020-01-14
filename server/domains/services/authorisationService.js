/**
* #k_infinityIII@Echwood
*
* authorisationService: () 
*
*  implements fucntions necessary for model manipulation
*
* Fucntions:
*      authoriseToken()
*
*/

import tokenService from './tokenService'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'


const authorisationService = {

 _tokenService: tokenService,
 /*
  * Token style authorization for requests
  * Every request goes through but is only
  *  validated if the user posses a valid token
  */
 async authoriseToken(accessToken) {

  let decodedToken = null

  winstonLogger.info('acces TOKEN:')
  winstonLogger.info(accessToken)

  // Verify token
  await authorisationService._tokenService.
  decodeToken(accessToken).
  then((dToken) => {

    winstonLogger.info('TOKEN:')
    winstonLogger.info(JSON.stringify(dToken,null,4))
    if(dToken){
      decodedToken = dToken
    }

  }).
  catch((e) =>{

    winstonLogger.info('ERROR:')
    winstonLogger.info(e.message)

  })
  
  return decodedToken

 }

}

export default authorisationService