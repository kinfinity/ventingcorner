/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 */

import csurf from 'csurf'
import winstonLogger from './winstonLogger'
import publicEnums from '../../app/publicEnums'
import authorisationService from '../../domains/services/authorisationService'

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise
     .resolve(fn(req, res, next))
      .catch(next)
}


// Options
const routerOptions = {}

/***
 * 
 * Check and authorise tokens on each path based on scope
 * the scope must match the route where it was called
 *  
 **/
const authUser = async (req, res, next) => {
  
  winstonLogger.info('AUTHORISATION MIDDLEWARE')
  const bearerHeader = req.headers['x-access-token'] || req.headers['authorization']
  winstonLogger.info(`HEADERs: ${JSON.stringify(bearerHeader,null,4)}`)

  if(bearerHeader){
    const bearer = bearerHeader.split('.') // .slice(7, token.length)
    const bearerToken = bearer[1]
    req.Token = bearerToken
    winstonLogger.info(`TOKEN: ${bearerToken}`)
    req.baseUrl // scope must match base url filtered and lowerCase e.g /user -> user
    
    //authorise token gotten
    const resx = await authorisationService.authoriseToken(bearerToken)
    if(resx){
      winstonLogger.info('RES:')
      winstonLogger.info(JSON.stringify(resx,null,4))
      req.body.userName = resx.userName

      req.body.authorized = true
    }else{
      winstonLogger.info('__AUTHORIZED__: false')
      req.body.authorized = false
      res.json({
        state: 'FAILURE',
        statusCode: publicEnums.VC_STATUS_CODES.INCORRECT_TOKEN,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_TOKEN,
        Data: null
      })
    }
    
    if(req.body.authorized){
      winstonLogger.info('__AUTHORIZED__: true')
      next()
    }
    
  }else{
    res.json({
      state: 'FAILURE',
      statusCode: publicEnums.VC_STATUS_CODES.NO_TOKEN,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.EMPTY_TOKEN,
      Data: null
    })
  }
}

const csrfMiddleware = csurf({
  cookie: true
})

export default {
  routerOptions,
  authUser,
  asyncMiddleware,
  csrfMiddleware
}