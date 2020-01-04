/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * categoryService: () : categoryModel
 *
 *  implements fucntions necessary for model manipulation
 *
 */

import categoryModel from '../models/categoryModel'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import publicEnums from '../../app/publicEnums'

const categoryService = {

    // handle for the categoryModel
    _categoryModel: categoryModel,

    // create Category
    async createCategory(Category, Description){
        
        let response = null
        // Create static Data for Category
        const categoryData = {
            title: Category,
            description: Description
        }
        const category = new categoryModel(categoryData)
    
      // Save new Category
      category.
      save().
      then((result) => {

        // Succeeded in saving new post to DB
        winstonLogger.info(' -> post UPDATED')
        winstonLogger.info(result)
        response = Promise.resolve(result.text)

      }).
      catch((err) => {

        winstonLogger.error(' -> post NOT UPDATED')
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

    // update description
    async updateDescription(Description, Category){

         //
         let uDescription = null 
         // 
         this._categoryModel.findOneAndUpdate(
             {
                 title: Category
             },
             {
                 description: Description
             }
         ).
         then((result) => {
 
             // Succeeded in saving new comment to DB
             winstonLogger.info(' -> comment UPDATED')
             winstonLogger.info(result)
             uDescription = Promise.resolve(result.description)
     
           }).
           catch((err) => {
     
             winstonLogger.error(' -> comment NOT UPDATED')
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
                 uDescription
             })

    },

    //update Category
    async updateImage(ImageUrl, Category){
      
        //
        let uImageUrl = null 
        // 
        this._categoryModel.findOneAndUpdate(
            {
                title: Category
            },
            {
                image: ImageUrl
            }
        ).
        then((result) => {

            // Succeeded in saving new comment to DB
            winstonLogger.info(' -> Category UPDATED')
            winstonLogger.info(result)
            uImageUrl = Promise.resolve(result.description)
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> Category NOT UPDATED')
            winstonLogger.error(err)
    
            return Promise.resolve({
              state: 'failure',
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
            })
    
          })
    
            //return updated ImageUrl
            return Promise.resolve({
                state: 'success',
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                uImageUrl
            })

    },

    // get Category 
    async getCategory(Category){

        // 
        let response = null
        //
        this._categoryModel.
        findOne(
            {title: Category}
        ).
        then((result) => {

            // Succeeded in saving new comment to DB
            winstonLogger.info(' -> Category UPDATED')
            winstonLogger.info(result)
            response = Promise.resolve(result)
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> Category NOT UPDATED')
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
    
    // delete Category
    async deleteCategory(CategoryID){

        // 
        let response = null

        this._categoryModel.
        findOneAndRemove(
            {_id: CategoryID}
        ).
        then((result) => {

            //removing Category from DB
            winstonLogger.info(' -> Category DELETED')
            winstonLogger.info(result)
            response = Promise.resolve(result)
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> Category NOT DELETED')
            winstonLogger.error(err)
    
            return Promise.resolve({
              state: 'failure',
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
            })
    
          })

            // 
            return Promise.resolve({
                state: 'success',
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                response
            })

    },
    
    // add Post to Category
    async addPost(PostID,CategoryID){

        // 
        let response = null

        this._categoryModel.
        findOneAndUpdate(
            {_id: CategoryID},
            {
              $push: {posts: PostID}
            }
        ).
        then((result) => {

            // Succeeded in adding post to Category in DB
            winstonLogger.info(' -> Category UPDATED')
            winstonLogger.info(result)
            response = Promise.resolve(result)
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> Category NOT UPDATED')
            winstonLogger.error(err)
    
            return Promise.resolve({
              state: 'failure',
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
            })
    
          })

            // 
            return Promise.resolve({
                state: 'success',
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                response
            })

    },
    
    // remove Post from Category
    async removePost(PostID,CategoryID){

        // 
        let response = null

        this._categoryModel.
        findOneAndRemove(
            {_id: CategoryID},
            {
              $pull: {posts: PostID}
            }
        ).
        then((result) => {

            // Removing Post from Category in DB
            winstonLogger.info(' -> Category UPDATED')
            winstonLogger.info(result)
            response = Promise.resolve(result)
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> Category NOT UPDATED')
            winstonLogger.error(err)
    
            return Promise.resolve({
              state: 'failure',
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
            })
    
          })

            // 
            return Promise.resolve({
                state: 'success',
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                response
            })

    }


}

export default categoryService