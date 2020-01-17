/** 
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 */
import routeUtils from '../utils/routerOptions'
import express from 'express'
import cloudinaryCon from '../plugins/cloudinaryCon'
import winstonLogger from '../utils/winstonLogger'
import publicEnums from '../../app/publicEnums'
import jsStringCompression from 'js-string-compression'
import ventService from '../../domains/services/ventService'
import ventEvents from '../../interfaces/Events/ventEvents'

/**
     * 
     *  Build  user API call routes
     *        - VentingCorner/vent/create        | Create new category
     *        - VentingCorner/vent/delete        | Delete existing category
     *        - VentingCorner/vent               | Get category description
     *        - VentingCorner/vent/update        | Update category description
     * 
     */

  //  Router for Vent calls 
  const VentRouter = express.Router([routeUtils.routerOptions])

  //  
  VentRouter.use('/vent',routeUtils.asyncMiddleware(routeUtils.authUser))
  // userID from token must match request userID for transaction to work
  
  // create Vent
  VentRouter.route('/vent/create')
    .post(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('Vent')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
          const payload = await ventService.createVent(
            req.body.Title,
            req.body.Text,
            req.body.Category,
            req.body.CategoryID,
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))

          //check if it worked
          if(payload.state == publicEnums.VC_STATES.REQUEST_OK){
            // fire Event to bind/add vent to category CategoryID
            winstonLogger.info('FIRING_EVENT: bind-to-category')
            winstonLogger.info(payload.ventID)
            winstonLogger.info(req.body.CategoryID)
            ventEvents.
            emit(
                'bind-to-category',
                {
                  VentID: payload.ventID,
                  CategoryID: req.body.CategoryID
                }
            )
            
            // fire Event to bind to user UserID
            winstonLogger.info('FIRING_EVENT: bind-to-user')
            winstonLogger.info(req.body.UserID)
            ventEvents.
            emit(
                'bind-to-user',
                {
                  VentID: payload.ventID,
                  UserID: req.body.UserID
                }
            )

          }
          
          // return VentID
          payload.request_url = '/vent/create'
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR: creating Vent')
        winstonLogger.error(e.stack)

        res.json({
          request_url: '/vent/create',
          state: publicEnums.VC_STATES.AUTHENTICATION_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
          token: null
        })
        
      }

    next()

  }))

  // delete Vent
  VentRouter.route('/vent/delete')
    .delete(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('Vent-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
          const payload = await ventService.deleteVent(
            req.body.VentID,
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          winstonLogger.info('here')
          winstonLogger.info(payload.Data)

          //check if it worked
          if(payload.state == publicEnums.VC_STATES.REQUEST_OK){
            // fire Event to bind/add vent to category CategoryID
            winstonLogger.info('FIRING_EVENT: remove-from-category')
            
            ventEvents.
            emit(
                'remove-from-category',
                {
                  VentID: payload.Data._id,
                  CategoryID: payload.Data.categoryID
                }
            )
            
            // fire Event to bind to user UserID
            winstonLogger.info('FIRING_EVENT: remove-from-user')
            
            ventEvents.
            emit(
                'remove-from-user',
                {
                  VentID: payload.Data._id,
                  UserID: req.body.UserID
                }
            )

          }
         
          payload.request_url = '/vent/delete'
          if(payload.state == publicEnums.VC_STATES.REQUEST_OK){
            delete payload['Data']
            payload.deleted = true
          }else{
            payload.deleted = false
          }
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR:delete Vent')
        winstonLogger.error(e.stack)

        res.json({
            request_url: 'vent/delete',
            state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
            Data: null
        })

      }

    next()

  }))

    // get Vent description
    VentRouter.route('/vent')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('Vent-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        const payload = await ventService.getVent(
            req.body.VentID,
            req.body.VentTitle
        )

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(payload)
        payload.request_url = '/vent'
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR:getting Vent info')
        winstonLogger.error(e.stack)

        res.json({
          request_url: '/vent',
          state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
          Data: null
        })

    }

    next()

    }))

    // update Vent description
    VentRouter.route('/vent/update')
    .post(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('Vent-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        //check if there's image first
        if(req.body.Image){

            // push image to cloudinary first
            winstonLogger.info('SAVE LOGO TO CLOUDINARY')
            // if it worked save the image to cloudinary with userName / profile # hm.decompress(req.body.Logo)
            const result = await cloudinaryCon.uploadVentImages(req.body.Image, req.body.Topic, req.body.VentID).
            catch((e) => {

                winstonLogger.error('Error uploading Logo')
                winstonLogger.error(e.stack)

            })

            winstonLogger.info('COUDLINARY RESULTS')
            winstonLogger.info(result)
            winstonLogger.info('END')

        }

        const payload = await ventService.updateText(
            req.body.Text,
            req.body.VentID
        )

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))

        payload.request_url = '/vent/update'
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR:getting Vent')
        winstonLogger.error(e.stack)

        res.json({
            state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    

    // add rants to vent

  module.exports = VentRouter