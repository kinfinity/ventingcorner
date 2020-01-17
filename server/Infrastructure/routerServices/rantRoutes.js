import routeUtils from '../utils/routerOptions'
import express from 'express'
import cloudinaryCon from '../plugins/cloudinaryCon'
import winstonLogger from '../utils/winstonLogger'
import publicEnums from '../../app/publicEnums'
import jsStringCompression from 'js-string-compression'
import rantService from '../../domains/services/rantService'

/**
     * 
     *  Build  rant API call routes
     *  
     */

  //  Router for rant calls 
  const rantRouter = express.Router([routeUtils.routerOptions])

  //
  rantRouter.use('/rant',routeUtils.asyncMiddleware(routeUtils.authUser))
  
    // create rant
    rantRouter.route('/rant/create')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('rant')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
    try {
          
        let ImageUrl = null
        //check if there's image first
        if(req.body.Image){

            // push image to cloudinary first
            winstonLogger.info('SAVE LOGO TO CLOUDINARY')
            // if it worked save the image to cloudinary with userName / profile # hm.decompress(req.body.Logo)
            const result = await cloudinaryCon.uploadrantImage(req.body.Image, req.body.Category, req.body.postID).
            catch((e) => {

                winstonLogger.error('Error uploading Image')
                winstonLogger.error(e.stack)

            })

            winstonLogger.info('COUDLINARY RESULTS')
            winstonLogger.info(result)
            winstonLogger.info('END')

            ImageUrl = result.Url

        }

          const payload = await rantService.createTextrant(
            req.body.Text,
            req.body.UserID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          payload.request_url = '/rant/create'

          // Fire Event -> push rantID to Vent Document

          res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR: creating rant')
        winstonLogger.error(e.stack)

        res.json({
          state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessages: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
        })

    }

    next()

  }))

  // delete rant  ?
  rantRouter.route('/rant/delete')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('rant-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
          const payload = await rantService.deleterant(
            req.body.rantID
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          payload.state = 'failure'
          if(payload){
            payload.state = 'success'
          }
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR:delete rant')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

      }

    next()

  }))

    // get rant
    rantRouter.route('/rant')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('rant-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        const payload = await rantService.getrant(
            req.body.rant
        )

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))
        payload.state = 'failure'
        if(payload){
            payload.state = 'success'
        }
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR:getting rant info')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    // update rant description
    rantRouter.route('/rant/update')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('rant-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        //check if there's image first
        if(req.body.Image){

            // push image to cloudinary first
            winstonLogger.info('SAVE LOGO TO CLOUDINARY')
            // if it worked save the image to cloudinary with userName / profile # hm.decompress(req.body.Logo)
            const result = await cloudinaryCon.uploadrantImages(req.body.Image, req.body.rant).
            catch((e) => {

                winstonLogger.error('Error uploading Logo')
                winstonLogger.error(e.stack)

            })

            winstonLogger.info('COUDLINARY RESULTS')
            winstonLogger.info(result)
            winstonLogger.info('END')

        }

        const payload = await rantService.updaterantDescription(
            req.body.rant,
            req.body.Description
        )

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))
        payload.state = 'failure'
        if(payload){
            payload.state = 'success'
        }
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR:getting rant info')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    

  module.exports = rantRouter