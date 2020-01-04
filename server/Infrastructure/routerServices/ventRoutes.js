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
  VentRouter.use('/VC/vent',routeUtils.asyncMiddleware(routeUtils.authUser))
  
  // create Vent
  VentRouter.route('/VC/vent')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('Vent')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
          const payload = await ventService.createVent(
            req.body.Image,
            req.body.Text
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          payload.state = 'failure'
          if(payload){
            payload.state = 'success'
          }
          
          // return VentID
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR: creating Vent')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })
        
      }

    next()

  }))

  // delete Vent
  VentRouter.route('/VC/vent')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('Vent-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
          const payload = await ventService.deleteVent(
            req.body.VentID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          payload.state = 'failure'
          if(payload){
            payload.state = 'success'
          }
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR:delete Vent')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

      }

    next()

  }))

    // get Vent description
    VentRouter.route('/VC/vent')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('Vent-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        const payload = await ventService.getVent(
            req.body.VentID
        )

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))
        payload.state = 'failure'
        if(payload){
            payload.state = 'success'
        }
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR:getting Vent info')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    // update Vent description
    VentRouter.route('/VC/vent')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

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

        const payload = await ventService.updateVentDescription(
            req.body.VentID,
            req.body.Text
        )

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))
        payload.state = 'failure'
        if(payload){
            payload.state = 'success'
        }
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR:getting Vent info')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    

  module.exports = VentRouter