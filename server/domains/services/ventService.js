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
    async createVent(Text){

        //
        let response = null
        // Create static Data for comment
        const VentData = {
            text: Text
        }
        const Vent = new ventModel(VentData)
    
      // Save new Vent
      Vent.
      save().
      then((result) => {

        // Succeeded in saving new Vent to DB
        winstonLogger.info(' -> Vent CREATED')
        winstonLogger.info(result)
        response = Promise.resolve(result._id)

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
            response
        })

    },

    // update Text
    async updateText(Text , VentID){
        
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
    async getVent(VentID){

        //
        let response = null
        /
        this._ventModel.
        findOne({_id: VentID}).
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
    async deleteVent(VentID){
        
      // holder to pack objects so they can be later destroyed
      let commentIDList = null 
      // response holder
      let response = null
      
      // pack comments 
      this._ventModel.findOne({_id: VentID}).
      then((data) => {
        commentIDList = data.comments
      })


      // delete model
      this.
      _ventModel.
      findOneAndRemove({_id: VentID}).
      then((result) => {

        // Succeeded in saving new Vent to DB
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

      /**
       *  FIRE EVENTS
       *      - DELETE COMMENTS
       *      - UNLINK FROM TOPIC
       */
      ventEvents.
        emit(
            'delete-comments',
            {
              commentIDList
            }
      )// send params
      ventEvents.
        emit(
            'Vent-deleted',
            {
              VentID,
              TopicID
            }
      )// send params

        //return updated Text
        return Promise.resolve({
            state: 'success',
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