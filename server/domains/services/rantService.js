/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * rantService: () : rantModel
 *
 *  implements fucntions necessary for model manipulation
 *
 */

import rantModel from '../models/rantModel'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import publicEnums from '../../app/publicEnums'

const rantService = {

    // handle for the rantModel
    _rantModel: rantModel,

    // create Text rant
    async createTextrant(Text){

        let response = null
        // Create static Data for rant
        const rantData = {
            text: Text
        }
        const rant = new rantModel(rantData)
    
      // Save new rant
      rant.
      save().
      then((result) => {

        // Succeeded in saving new rant to DB
        winstonLogger.info(' -> rant CREATED')
        winstonLogger.info(result)
        response = Promise.resolve(result._id)

      }).
      catch((err) => {

        winstonLogger.error(' -> rant NOT CREATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: 'failure',
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR,
          Token: null
        })

      })

        //return rantID
        return Promise.resolve({
            state: 'success',
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            response
        })

    },
    //update Text rant
    async updateTextrant(Text, rantID){
      
        //
        let uText = null 
        // 
        this._rantModel.findOneAndUpdate(
            {
                _id:rantID
            },
            {
                text
            }
        ).
        then((result) => {

            // Succeeded in saving new rant to DB
            winstonLogger.info(' -> rant UPDATED')
            winstonLogger.info(result)
            uText = Promise.resolve(result.text)
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> rant NOT UPDATED')
            winstonLogger.error(err)
    
            return Promise.resolve({
              state: 'failure',
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR,
              Token: null
            })
    
          })
    
            //return updated Text
            return Promise.resolve({
                state: 'success',
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                uText
            })

    },

    // create Image rant
    async createImagerant(ImageUrl){
    
        let response = null
        // Create static Data for rant
        const rantData = {
            image: ImageUrl
        }
        const rant = new rantModel(rantData)
    
      // Save new rant
      rant.
      save().
      then((result) => {

        // Succeeded in saving new rant to DB
        winstonLogger.info(' -> rant CREATED')
        winstonLogger.info(result)
        response = Promise.resolve(result.image)

      }).
      catch((err) => {

        winstonLogger.error(' -> rant NOT CREATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: 'failure',
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR,
        })

      })

        //return rantID
        return Promise.resolve({
            state: 'success',
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            response
        })

        // return cloudinary Url

    },

    //update Text rant
    async updateImagerant(ImageUrl , rantID){
         //
         let uImage = null 
         // 
         this._rantModel.findOneAndUpdate(
             {
                 _id:rantID
             },
             {
                 image: ImageUrl
             }
         ).
         then((result) => {
 
             // Succeeded in saving new rant to DB
             winstonLogger.info(' -> rant UPDATED')
             winstonLogger.info(result)
             uImage = Promise.resolve(result.image)
     
           }).
           catch((err) => {
     
             winstonLogger.error(' -> rant NOT UPDATED')
             winstonLogger.error(err)
     
             return Promise.resolve({
               state: 'failure',
               statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
               statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR,
               Token: null
             })
     
           })
     
             //return updated Text
             return Promise.resolve({
                 state: 'success',
                 statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                 statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                 uImage
             })

    },

    // get rant 
    async getrant(rantID){

        // 
        let response = null
        //
        this._rantModel.
        findOneAndDRemove(
            {_id: rantID}
        ).
        then((result) => {

            // Succeeded in saving new rant to DB
            winstonLogger.info(' -> Getting rant ')
            winstonLogger.info(result)
            response = Promise.resolve(result)
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> ERROR getting rant ')
            winstonLogger.error(err)
    
            return Promise.resolve({
              state: 'failure',
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
            })
    
          })

            // return Category overview
            return Promise.resolve({
                state: 'success',
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                response
            })

    },

    // delete rant
    async deleteRant(rantID){
        

      
    },

    // delete multiple
    async deleteMultiple(rantIDList){

    }
  
}

export default rantService