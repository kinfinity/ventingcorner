import routeUtils from '../utils/routerOptions'
import express from 'express'
import cloudinaryCon from '../plugins/cloudinaryCon'
import winstonLogger from '../utils/winstonLogger'
import jsStringCompression from 'js-string-compression'
import publicEnums from '../../app/publicEnums'
import RedisCache from '../utils/redisAuthCache'

import userService from '../../domains/services/userService'



/**
 * base64 image strings are compress b4 sent to server
 * so we decompress them first 
 * 
 */
const hm = new jsStringCompression.Hauffman()



/**
     * 
     *  Authentication call routes
     *  
     */


  // free access endpoints for authentication
  const openAccessRouterService = express.Router([routeUtils.routerOptions])
  openAccessRouterService.use(routeUtils.csrfMiddleware)

  // OpenAccess_routes : don't require accessToken
  openAccessRouterService.route('/signup').post(routeUtils.asyncMiddleware(async (req,res,next) => {
  //openAccessRouterService.get('/VC/userSignUp',routeUtils.asyncMiddleware(async (req,res,next) => {
  
    winstonLogger.info('user-SIGNUP')

    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    if(
      req.body.UserName &&
       req.body.Name && 
       req.body.Email &&
       req.body.Password &&
       req.body.Address && 
       req.body.ProfileImage 
       ){
      const profiler = winstonLogger.startTimer()

      try{
          
        // create user
        const payloadS =  await userService.createNewEmailUser(
            req.body.UserName,
            req.body.Name,
            req.body.Email,
            req.body.Password,
            req.body.BirthDate,
            req.body.Address,
            'Temp',// req.body.ProfileImage,// Gets updated on Logo upload to cloudinary
            req.body.Topics
        )
        winstonLogger.info('CREATED:')
        winstonLogger.info(JSON.stringify(payloadS,null,4))
      
        if(payloadS.statusCode !== 402){
            
          // done with SIGNUP
          // authenticate user -> creates token
          const payloadA = await userService.authenticateUser({
              detail: payloadS.email,
              password: payloadS.password
          }).
          catch((err) => {
      
              winstonLogger.error('ERROR: authentication')
              winstonLogger.error(err.stack)

              res.json({
                request_url: '/signup',
                state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_FAILED,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
                token: null
              })
      
          })
      
          winstonLogger.info("SIGNUP PAYLOAD")
          winstonLogger.info(JSON.stringify(payloadA,null,4))

          payloadS.state = 'failure'
          // Persist images if user was created 
          if(payloadA.token !== null ){

              winstonLogger.info('SAVE LOGO TO CLOUDINARY')
              // if it worked save the image to cloudinary with userName / profile # hm.decompress(req.body.Logo)
              const result = await cloudinaryCon.uploadUserProfileImage(req.body.ProfileImage, req.body.Name, req.body.Email).
              catch((e) => {

                  winstonLogger.error('Error uploading Logo')
                  winstonLogger.error(e.stack)

              })

              winstonLogger.info('COUDLINARY RESULTS')
              winstonLogger.info(result)
              winstonLogger.info('END')
              payloadA.state = publicEnums.VC_STATES.REQUEST_OK
              payloadA.request_url = '/signup'

          }

          // Send the payload to client
          res.json(payloadA)

      }
      else{

          winstonLogger.info('INFO: user not created')
          res.json(payloadS)

      }
    } catch(e){

      winstonLogger.error('ERROR: signup failed')
      winstonLogger.error(e.stack)
      res.json({
        request_url: '/signup',
        state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
        statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
        statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
        token: null
      })

    }
            
      profiler.done({ message: 'End of user_signup'})
      
      next()

  }else{

    res.json({
      request_url: '/signup',
      state: publicEnums.VC_STATES.REQUEST_ERROR,
      statusCode: publicEnums.VC_STATUS_CODES.REQUEST_ERROR,
      statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_PARAMS,
      token: null
    })

  }

}))
  
openAccessRouterService.route('/user/login').get(routeUtils.asyncMiddleware(async (req,res,next) => {

    winstonLogger.info('user-LOGIN')

    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    if(
      req.body.detail &&
      req.body.password
      ){
      
        try {

            // *test cache
            RedisCache.Whitelist.AddToken(req.body.detail, "testToken")
            //
            winstonLogger.info('CHECK: redisCache')
            // RedisCache.Whitelist.remove(req.body.detail)
            winstonLogger.info(JSON.stringify(RedisCache.Whitelist.verify(req.body.detail),null,4))

            //if(!RedisCache.Whitelist.verify(req.body.detail)){
          
              const payload = await userService.authenticateUser({
                detail: req.body.detail,
                password: req.body.password
              })
              winstonLogger.info("PAYLOAD")
              winstonLogger.info(JSON.stringify(payload))
              if(payload){
                RedisCache.Whitelist.AddToken(req.body.detail, "testToken")
              }
              res.json(payload)

            // }else{
            //   winstonLogger.info(req.body.detail+ " Already Logged In")
            //   res.json({message: "INFO: User Already Logged In"})
            // }

          } catch (e) {

          winstonLogger.error('ERROR: authentication')
          winstonLogger.error(e.stack)

          res.json({
            request_url: '/user/login',
            state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
            token: null
          })

        }

        next()
    
      }else{

        res.json({
          request_url: '/user/login',
          state: publicEnums.VC_STATES.REQUEST_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.REQUEST_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_PARAMS,
          token: null
        })
        
      }


}))

  module.exports = openAccessRouterService