/** 
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 */

import routeUtils from '../utils/routerOptions'
import express from 'express'
import cloudinaryCon from '../plugins/cloudinaryCon'
import winstonLogger from '../utils/winstonLogger'
import shortid from 'shortid'
import publicEnums from '../../app/publicEnums'
import jsStringCompression from 'js-string-compression'
import categoryService from '../../domains/services/categoryService'

/**
     * 
     *  Build  user API call routes
     *        - VentingCorner/category/create        | Create new category
     *        - VentingCorner/category/delete        | Delete existing category
     *        - VentingCorner/category               | Get category description
     *        - VentingCorner/categorylist           | Get list of categories
     *        - VentingCorner/category/update        | Update category description
     *        - VentingCorner/category/vents         | Get category vents
     * 
     */


  //  Router for category calls 
  const categoryRouter = express.Router([routeUtils.routerOptions])

  //  Protect all routes
  categoryRouter.use('/category',routeUtils.asyncMiddleware(routeUtils.authcategory))
  
  
  categoryRouter.use('/category/create',routeUtils.asyncMiddleware(routeUtils.csrfMiddleware))

  // create category  | ~* add admin protect
  categoryRouter.route('/category/create')
    .post(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('CREATE-CATEGORY')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
          const payload = await categoryService.createCategory(
            req.body.Title,
            req.body.Description
          )
          
          // Image exists?
          if(req.body.Image){

            winstonLogger.info('TO CLOUDINARY')
            // decompress image string
            // decode from base64

            // upload to cloudinary
            const uploadResult = await cloudinaryCon.uploadCategoryImages(req.body.Image, req.body.Title).
            catch((e) => {

                winstonLogger.error('Error uploading image')
                winstonLogger.error(e.stack)

            })

            winstonLogger.info('COUDLINARY RESULTS')
            winstonLogger.info(uploadResult)
            winstonLogger.info('END')

          }
          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))

          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR: creating category')
        winstonLogger.error(e.stack)

        res.json({
            state: publicEnums.VC_STATES.REQUEST_ERROR,
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_ERROR,
            Data: null
        })

      }

    next()

  }))

  // delete category
  categoryRouter.route('/category/delete')
    .delete(routeUtils.asyncMiddleware (async(req,res,next) => {
    
    winstonLogger.info('category-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))
    
      try {
          
          const payload = await categoryService.deletecategory(
            req.body.category
          )

          winstonLogger.info("PAYLOAD")
          winstonLogger.info(JSON.stringify(payload,null,4))
          payload.state = 'failure'
          if(payload){
            payload.state = 'success'
          }
          res.json(payload)

      } catch (e) {

        winstonLogger.error('ERROR:delete category')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

      }

    next()

  }))

    // get category description
    categoryRouter.route('/category')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('GET-CATEGORY')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        const payload = await categoryService.getcategory(
            req.body.CategoryID,
            req.body.Title
        )

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))
        payload.state = 'failure'
        if(payload){
            payload.state = 'success'
        }
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR:getting category info')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    // get all categories [ids and titles]
    categoryRouter.route('/categorylist')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('GET-CATEGORYLIST')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        // Use RedisCache
        const payload = await categoryService.getCategoryList() // categoryListService

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))
        payload.state = 'failure'
        if(payload){
            payload.state = 'success'
        }
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR:getting list of categories')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    // update category description
    categoryRouter.route('/category/update')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('category-PROFILE')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        //check if there's image
        if(req.body.Image){

            // decompress and decode from base64
            // hm.decompress(req.body.Image)
            // push image to cloudinary first
            winstonLogger.info('TO CLOUDINARY')
            // if it worked save the image to cloudinary with userName / profile
            const result = await cloudinaryCon.uploadcategoryImages(req.body.Image, req.body.Title).
            catch((e) => {

                winstonLogger.error('Error uploading Logo')
                winstonLogger.error(e.stack)

            })

            winstonLogger.info('COUDLINARY RESULTS')
            winstonLogger.info(result)
            winstonLogger.info('END')

        }// Fire Event to sync up with description before reaching here

        const payload = await categoryService.updateDescription(
            req.body.category,
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

        winstonLogger.error('ERROR:getting category info')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    // delete category
    categoryRouter.route('/category/delete')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('DELETE-CATEGORY')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        // 
        const payload = await categoryService.deleteCategory(
          req.body.CategoryID
        ) 

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))
        payload.state = 'failure'
        if(payload){
            payload.state = 'success'
        }
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR: deleting category')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    
    // Get category vents
    categoryRouter.route('/category/vents')
    .get(routeUtils.asyncMiddleware (async(req,res,next) => {

    winstonLogger.info('DELETE-CATEGORY')
    winstonLogger.info('REQ:')
    winstonLogger.info(JSON.stringify(req.body,null,4))

    try {
        
        // 
        const payload = await categoryService.getCategoryVents(
          req.body.CategoryID
        ) 

        winstonLogger.info("PAYLOAD")
        winstonLogger.info(JSON.stringify(payload,null,4))
        payload.state = 'failure'
        if(payload){
            payload.state = 'success'
        }
        res.json(payload)

    } catch (e) {

        winstonLogger.error('ERROR: getting category vents')
        winstonLogger.error(e.stack)

        res.json({
            state: 'failure',
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            Data: null
        })

    }

    next()

    }))

    

  module.exports = categoryRouter