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
        
        //check if category exists
        const res = await categoryService.categoryExists(Category)
        if(res){
          return Promise.resolve({
            state: publicEnums.VC_STATES.RESOURCE_EXISTS,
            statusCode: publicEnums.VC_STATUS_CODES.CONFLICT,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.RESOURCE_EXISTS
          })
        }
        //continue if it doesn't

        // Create static Data for Category
        const categoryData = {
            title: Category,
            description: Description
        }
        const category = new categoryModel(categoryData)
    
      // Save new Category
      await category.
      save().
      then((result) => {

        // Succeeded in saving new post to DB
        winstonLogger.info(' -> category CREATED')
        winstonLogger.info(result)
        response = Promise.resolve(result.text)

      }).
      catch((err) => {

        winstonLogger.error(' -> category NOT CREATED')
        winstonLogger.error(err)

        return Promise.resolve({
          state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
          statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
        })

      })

        //return updated Text
        return Promise.resolve({
            state: publicEnums.VC_STATES.REQUEST_OK,
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
            response
        })

    },

    // update description
    async updateDescription(CategoryID, Description){

        const options  = {
          useFindAndModify: false,
          new: true
        }
         //
         let uDescription = null 
         // 
         await categoryService._categoryModel.findOneAndUpdate(
             {
                 _id: CategoryID
             },
             {
                 description: Description
             },
             options
         ).
         then((result) => {
 
            if(!result){
              return Promise.resolve({
                state: publicEnums.VC_STATES.INVALID_RESOURCE,
                statusCode: publicEnums.VC_STATUS_CODES.NOT_FOUND,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_PARAMS
              })
            }
             // Succeeded in saving new category to DB
             winstonLogger.info(' -> category UPDATED')
             winstonLogger.info(result)
             uDescription = result
     
           }).
           catch((err) => {
     
             winstonLogger.error(' -> category NOT UPDATED')
             winstonLogger.error(err)
     
             return Promise.resolve({
               state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
               statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
               statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
             })
     
           })
     
             //return updated Text
             return Promise.resolve({
                 state: publicEnums.VC_STATES.REQUEST_OK,
                 statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                 statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                 uDescription
             })

    },

    //update Category
    async updateImage(ImageUrl, Category){

        const options  = {
          useFindAndModify: false,
          new: true
        }
        //
        let obj = null 
        // 
        await categoryService._categoryModel.findOneAndUpdate(
            {
                title: Category
            },
            {
                image: ImageUrl
            },
            options
        ).
        then((result) => {

            if(!result){
              return Promise.resolve({
                state: publicEnums.VC_STATES.INVALID_RESOURCE,
                statusCode: publicEnums.VC_STATUS_CODES.NOT_FOUND,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.INCORRECT_PARAMS
              })
            }
            // Succeeded in saving new comment to DB
            winstonLogger.info(' -> Category UPDATED')
            winstonLogger.info(result)
            obj = result
    
      }).
      catch((err) => {
    
            winstonLogger.error(' -> Category NOT UPDATED')
            winstonLogger.error(err)
    
            return Promise.resolve({
              state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
            })
    
      })
    
      //return updated ImageUrl
      return Promise.resolve({
          state: publicEnums.VC_STATES.REQUEST_OK,
          statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
          statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
          obj
      })

    },

    // get Category 
    async getCategory(CategoryID,Title){

        // 
        let response = null,factor = null
        if(CategoryID && Title){

          factor = {
            _id: CategoryID,
            title: Title
          }

        }else if(CategoryID){

          factor = {
            _id: CategoryID
          }

        }else if(Title){

          factor = {
            title: Title
          }

        }
        //
        await categoryService._categoryModel.
        findOne(
            factor
        ).
        then((result) => {

            // Succeeded in saving new comment to DB
            winstonLogger.info(' -> Category UPDATED')
            winstonLogger.info(result)
            response = result
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> Category NOT UPDATED')
            winstonLogger.error(err)
    

            return Promise.resolve({
              state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
            })
    
          })

            // return Category overview
            return Promise.resolve({
                state: publicEnums.VC_STATES.REQUEST_OK,
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                data: response
            })

    },
    
    // delete Category
    async deleteCategory(CategoryID){

      const options  = {
        useFindAndModify: false,
        new: true
      }
        // 
        let response = null

        await categoryService._categoryModel.
        findOneAndRemove(
            {_id: CategoryID},
            options
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
              state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
            })
    
          })

            // 
            return Promise.resolve({
                state: publicEnums.VC_STATES.REQUEST_OK,
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                response
            })

    },
    // get CategoryList
    async getCategoryList(){

      // 
      let response = [{"title":"obj_id"}],cat = null,ind = 0,t=null,i=null
      //clear 
      response.pop()
      //-
      await categoryService._categoryModel.
      find().
      then((result) => {

          // Succeeded in saving new comment to DB
          winstonLogger.info(' -> CategoryList')
          winstonLogger.info(JSON.stringify(result,null,4))

          if(result){
            for(cat in result){
              t = result[ind].title
              i = result[ind]._id
              winstonLogger.info("title: "+t+" id: "+i)
              response.push({title,id})
              ind++
            }
          } 

        }).
        catch((err) => {
  
          winstonLogger.error(' Failed Getting CategoryList')
          winstonLogger.error(err.stack)

          return Promise.resolve({
            state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
            statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
          })
  
        })

          // return Category overview
          return Promise.resolve({
              state: publicEnums.VC_STATES.REQUEST_OK,
              statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
              response
          })

  },
    
    // add Vent to Category
    async addVent(VentID,CategoryID){

        // 
        let response = null

        await categoryService._categoryModel.
        findOneAndUpdate(
            {_id: CategoryID},
            {
              $push: {vents: VentID}
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
              state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.INTERNAL_SERVER_ERROR
            })
    
          })

            // 
            return Promise.resolve({
                state: publicEnums.VC_STATES.REQUEST_OK,
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                response
            })

    },
    
    // remove Vent from Category
    async removeVent(VentID,CategoryID){

        // 
        let response = null

        await categoryService._categoryModel.
        findOneAndRemove(
            {_id: CategoryID},
            {
              $pull: {vents: VentID}
            }
        ).
        then((result) => {

            // Removing Vent from Category in DB
            winstonLogger.info(' -> Category UPDATED')
            winstonLogger.info(result)
            response = Promise.resolve(result)
    
          }).
          catch((err) => {
    
            winstonLogger.error(' -> Category NOT UPDATED')
            winstonLogger.error(err)
    
            return Promise.resolve({
              state: publicEnums.VC_STATES.INTERNAL_SERVER_ERROR,
              statusCode: publicEnums.VC_STATUS_CODES.INTERNAL_SERVER_ERROR,
              statusMessage: publicEnums.VC_STATUS_MESSAGES.HASHING_ERROR
            })
    
          })

            // 
            return Promise.resolve({
                state: publicEnums.VC_STATES.REQUEST_OK,
                statusCode: publicEnums.VC_STATUS_CODES.REQUEST_OK,
                statusMessage: publicEnums.VC_STATUS_MESSAGES.REQUEST_OK,
                response
            })

    },
    async categoryExists(Title) {

      let eeResult = null
  
      // Check 
      await categoryService._categoryModel.
      findOne({title: Title}).
      then((Data) => {
  
        winstonLogger.info(`checking data base for category title `)
        if(Data){
    
          if (Data.length === 0) {
  
            winstonLogger.info('no such category')
            eeResult = Promise.resolve(false)
  
          }
  
          winstonLogger.info(`FOUND: ${Data}`)
          eeResult = Promise.resolve(true)
        }
  
      }).
      catch((err) => {
  
        winstonLogger.info('error checking database')
        winstonLogger.info(err)
        eeResult1 = Promise.resolve(false)
  
      })
        return eeResult  
    }


}

export default categoryService