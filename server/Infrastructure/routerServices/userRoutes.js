import routeUtils from '../utils/routerOptions'
import express from 'express'
import cloudinaryCon from './../plugins/cloudinaryCon'
import winstonLogger from '../utils/winstonLogger'
import shortid from 'shortid'
import publicEnums from '../../app/publicEnums'
import jsStringCompression from 'js-string-compression'
import userService from '../../domains/services/userService'

/**
     * 
     *  Build  user API call routes
     *        - VentingCorner/logout              | Destroy access for user Token
     *        - VentingCorner/resetpassword       | 
     *        - VentingCorner/user                | Get user Info
     *        - VentingCorner/user/update         | Update user Info
     *        - VentingCorner/user/feed           | Get user feed
     *        - VentingCorner/user/posts          | Get user posts
     * ~!
     *        - VentingCorner/user/addtopic       | Follow topic
     *        - VentingCorner/user/removetopic    | UnFollow topic
     *  
     */

  // user router for all user calls 
  const userRouter = express.Router([routeUtils.routerOptions])

  //  Protect all the User routes
  userRouter.use('/VentingCorner/user',routeUtils.asyncMiddleware(routeUtils.authUser))
  
  //  ~! LogOut
  userRouter.route('/VentingCorner/user/logout')
  .get(routeUtils.asyncMiddleware (async(req,res) => {
    
    winstonLogger.info('user-LOGOUT')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
         // const payload = await userService.signout({Token: req.body.Token})
          winstonLogger.info("PAYLOAD")
          winstonLogger.info(payload)

          payload.state = 'success'
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR: signing out')
        winstonLogger.error(e)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

      next()
  }))

  // Get user Info
  userRouter.route('/VentingCorner/user')
  .get(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('user-PROFILE')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          // 
          const payload = await userService.getProfile(
            req.body.UserName,
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          payload.state = 'failure'
          if(payload){
            payload.state = 'success'
          }
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR:getting user info')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

      }

    next()

  }))
  
  // Update user Info
  userRouter.route('/VentingCorner/user/update')
  .get(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('user-CONTACTINFO')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          // 
          const payload = await userService.updateProfile(
            req.body.UserName,
            req.body.UserID,
            req.body.data
          )
            
          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          payload.state = 'failure'
          if(payload){
            payload.state = 'success'
          }
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR: updating contactInfo')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

      }

    next()

  }))
  
  // notification API routes
  userRouter.route('/VentingCorner/user/notifications')
  .get(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('user-NOTIFICATIONS')

    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
        
          // 
          const payload = await userService.notifications(
            req.body.UserName,
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          payload.state = 'failure'
          if(payload){
            payload.state = 'success'
          }
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR: getting notifications')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

    next()

  }))

  // get posts
  userRouter.route('/VentingCorner/user/posts')
  .get(routeUtils.asyncMiddleware (async(req,res) => {
    
    winstonLogger.info('user-ACTIVITIES')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          // *
          const payload = await userService.getPosts(
            req.body.UserName,
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(payload)

          payload.state = 'success'
          res.json(payload)   

      } catch (e) {

        winstonLogger.error('ERROR: getting activities')
        winstonLogger.error(e)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

    next()

  }))


  // follow user
  userRouter.route('/VentingCorner/user/follow')
  .get(routeUtils.asyncMiddleware (async(req,res) => {
    
    winstonLogger.info('user-ACTIVITIES')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          //
          const payload = await userService.FollowUserID(
            req.body.UserName,
            req.body.UserID,
            req.body.FollowUserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(payload)

          payload.state = 'success'
          res.json(payload)   

      } catch (e) {

        winstonLogger.error('ERROR: following User')
        winstonLogger.error(e)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

    next()

  }))
  // unfollow user
  userRouter.route('/VentingCorner/user/unfollow')
  .get(routeUtils.asyncMiddleware (async(req,res) => {
    
    winstonLogger.info('user-ACTIVITIES')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          //
          const payload = await userService.UnFollowUserID(
            req.body.UserName,
            req.body.UserID,
            req.body.UnFollowUserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(payload)

          payload.state = 'success'
          res.json(payload)   

      } catch (e) {

        winstonLogger.error('ERROR: unfollowing User')
        winstonLogger.error(e)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

    next()

  }))

  // get followers
  userRouter.route('/VentingCorner/user/followers')
  .get(routeUtils.asyncMiddleware (async(req,res) => {
    
    winstonLogger.info('user-FOLOWERS')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          //
          const payload = await userService.getFollowers(
            req.body.UserName,
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(payload)

          payload.state = 'success'
          res.json(payload)   

      } catch (e) {

        winstonLogger.error('ERROR: unfollowing User')
        winstonLogger.error(e)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

    next()

  }))
  // get following
  userRouter.route('/VentingCorner/user/following')
  .get(routeUtils.asyncMiddleware (async(req,res) => {
    
    winstonLogger.info('user-FOLOWERS')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          //
          const payload = await userService.getFollowing(
            req.body.UserName,
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(payload)

          payload.state = 'success'
          res.json(payload)   

      } catch (e) {

        winstonLogger.error('ERROR: unfollowing User')
        winstonLogger.error(e)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

    next()

  }))
  
  // view User Profile -> Use ID
  userRouter.route('/VentingCorner/user/viewprofile')
  .get(routeUtils.asyncMiddleware (async(req,res) => {
    
    winstonLogger.info('user-FOLOWERS')
    winstonLogger.info('REQUEST BODY')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          //
          const payload = await userService.getUserProfile(
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(payload)

          payload.state = 'success'
          res.json(payload)   

      } catch (e) {

        winstonLogger.error('ERROR: getting User Profile')
        winstonLogger.error(e)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Token: null
        })

      }

    next()

  }))


  module.exports = userRouter