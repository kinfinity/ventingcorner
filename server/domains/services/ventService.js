/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * ventService: () : ventModel
 *
 *  implements fucntions necessary for model manipulation
 *
 */

import ventModel from '../models/ventModel'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import publicEnums from '../../app/publicEnums'
import ventEvents from '../../interfaces/Events/ventEvents'

const ventService = {

    // handle for the ventModel
    _ventModel: ventModel,

    // create Vent
    async createVent(Title,Text,Category,CategoryID,UserID){

        //
        let ventID = null
        // Create static Data for comment
        const VentData = {
          title: Title,
          text: Text,
          categoryID: CategoryID,
          category: Category,
          created_by: UserID
        }
        const Vent = new ventModel(VentData)
    
      // Save new Vent
      await Vent.
      save().
      then((result) => {

        // Succeeded in saving new Vent to DB
        winstonLogger.info(' -> Vent CREATED')
        winstonLogger.info(result)
        ventID = result._id

      }).
      catch((err) => {

        winstonLogger.error(' -> Vent NOT CREATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: 'failure',
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR,
          Token: null
        })

      })

        //return VentID
        return Promise.resolve({
            state: 'success',
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            ventID
        })

    },

    // update Text
    async updateText(Text,VentID){
        
        //
        let response = null
        //
        this._ventModel.
        findOneAndUpdate(
            {_id: VentID},
            {text: Text}
        ).
      then((result) => {

        // Succeeded in saving new Vent to DB
        winstonLogger.info(' -> Vent UPDATED')
        winstonLogger.info(result)
        response = Promise.resolve(result.text)

      }).
      catch((err) => {

        winstonLogger.error(' -> Vent NOT UPDATED')
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
            response
        })

    },

    //update Vent Image
    async updateImage(ImageUrl, VentID){
      
        //
        let response = null
        //
        this._ventModel.
        findOneAndUpdate(
            {_id: VentID},
            {image: ImageUrl}
        ).
      then((result) => {

        // Succeeded in saving new Vent to DB
        winstonLogger.info(' -> Vent UPDATED')
        winstonLogger.info(result)
        response = Promise.resolve(result.text)

      }).
      catch((err) => {

        winstonLogger.error(' -> Vent NOT UPDATED')
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
            response
        })  

        // return updated image url 

    },

    // get Vent 
    async getVent(VentID,VentTitle){

      const options = {
        useFindAndModify: false,
        new: true
      }

        //
        let response = null, factor = null
        if(VentID && VentTitle){
  
          factor = {
            _id: VentID,
            title: VentTitle
          }
  
        }else if(VentID){
  
          factor = {
            _id: VentID
          }
  
        }else if(VentTitle){
  
          factor = {
            title: Title
          }
  
        }
        await ventService._ventModel.
        findOne(factor,options).
      then((result) => {

        // Succeeded in saving new Vent to DB
        winstonLogger.info(' -> get Vent')
        winstonLogger.info(result)
        response = Promise.resolve(result)

      }).
      catch((err) => {

        winstonLogger.error(' -> Vent NOT UPDATED')
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
            response
        })
        
        // return Vent content

    },

    // delete Vent
    async deleteVent(VentID,UserID){
        
      const options = {
        useFindAndModify: false,
        new: true
      }
      winstonLogger.info("VentID: "+VentID+" UserID: "+ UserID)
      //
      let rantIDList = null,response = null
      // pack comments 
      await ventService._ventModel.findOne(
        {
          _id: VentID,
          created_by: UserID
      }).
      then((data) => {

        winstonLogger.info("Data: "+data)
        if(data){
          winstonLogger.info('RANT LIST')
          winstonLogger.info(data.rants)
          rantIDList = data.rants
        }

      }).
      catch((err) => {

        winstonLogger.error(' -> Vent NOT UPDATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
        })

      })


      // delete model
      await ventService.
      _ventModel.
      findOneAndRemove(
        {
          _id: VentID,
          created_by: UserID
        },
        options
      ).
      then((result) => {

        //
        winstonLogger.info(' -> Vent DELETED')
        winstonLogger.info(result)
        response = Promise.resolve(result)

      }).
      catch((err) => {

        winstonLogger.error(' -> Vent NOT DELETED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
        })

      })

      /**
       *  FIRE EVENTS
       *      - DELETE COMMENTS
       *      - UNLINK FROM TOPIC
       */
      if(rantIDList){
        ventEvents.
        emit(
            'on-delete',
            {
              rantIDList
            }
        )
      }

        //return 
        return Promise.resolve({
            state: publicEnums.VC_STATES.REQUEST_OK,
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            response
        })

    },

    // add comment | increase number of comments(rants)
    async addComment(CommentID,VentID){
      
      //
      let response = null
      //
      this._ventModel.
      findOneAndUpdate(
        {_id: VentID},
        {
          $inc : {'commnetCount' : 1}, // increase number of comments(rants) +1
          $push: {'comments': CommentID}
        }
      ).
      then((result) => {

        // Succeeded in saving new comment to Vent in DB
        winstonLogger.info(' -> Vent UPDATED')
        winstonLogger.info(result)
        response = Promise.resolve(result)

      }).
      catch((err) => {

        winstonLogger.error(' -> Vent NOT UPDATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: 'failure',
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
        })

      })

        //return updated Text
        return Promise.resolve({
            state: 'success',
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            response
        })

    },

    // remove comment | decrease number of comments(rants)
    async removeComment(CommentID,VentID){
      
      //
      let response = null
      //
      this._ventModel.
      findOneAndUpdate(
        {_id: VentID},
        {
          $inc : {'commnetCount' : -1}, // decrease number of comments(rants) -1
          $pull: {comments: CommentID}
        }
      ).
      then((result) => {

        // Succeeded in removing comment from Vent in DB
        winstonLogger.info(' -> Vent UPDATED')
        winstonLogger.info(result)
        response = Promise.resolve(result)

      }).
      catch((err) => {

        winstonLogger.error(' -> Vent NOT UPDATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: 'failure',
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
        })

      })

        //return updated Text
        return Promise.resolve({
            state: 'success',
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            response
        })

    }
  
}

export default ventService