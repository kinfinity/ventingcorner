/**
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * 
 */

import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import categoryService from '../../domains/services/categoryService'
import userService from '../../domains/services/userService'
import rantService from '../../domains/services/rantService'

 const onVent =  {

    /**
     *  Patch in the Vent into the Category for which it was created 
     * 
     *  Params 
     *          - VentID
     *          - CategoryID
     * 
     */
    addToCategory: async(params) => { 

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))

        await categoryService.
        addVent(params.VentID,params.CategoryID).
        then((res) => {

                if(res !== null){
                    winstonLogger.info('UPDATE: Vent to Category document')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated
                }
                // if it didn't persist try again Or serialize if DB is down ... 
                
        }).
        catch((e) =>{

            winstonLogger.error('ERROR: appending Vent to Category document')
            winstonLogger.error(e)

        })

    },
    addToUser: async(params) => { 

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))
        
        await userService.
        addVent(params.VentID,params.UserID).
        then((res) => {

                if(res !== null){
                    winstonLogger.info('UPDATE: Vent to User document')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated
                }
                // if it didn't persist try again Or serialize if DB is down ... 
                
        }).
        catch((e) =>{

            winstonLogger.error('ERROR: appending Vent to User document')
            winstonLogger.error(e)

        })

    },

    //
    removeFromCategory: async(params) => { 

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))

        await categoryService.removeVent(params.VentID,params.CategoryID).
        then((res) => {

                if(res !== null){
                    winstonLogger.info('UPDATE: Vent to Category document')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated
                }
                // if it didn't persist try again Or serialize if DB is down ... 
                
        }).
        catch((e) =>{

            winstonLogger.error('ERROR: removing Vent from Category document')
            winstonLogger.error(e)

        })

    },
    removeFromUser: async(params) => { 

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))
        
        await userService.removeVent(params.VentID,params.UserID).
        then((res) => {

                if(res !== null){
                    winstonLogger.info('UPDATE: Vent From User document')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated
                }
                // if it didn't persist try again Or serialize if DB is down ... 
                
        }).
        catch((e) =>{

            winstonLogger.error('ERROR: removing Vent From User document')
            winstonLogger.error(e)

        })

    },

    delete: async(params) => { 

        const options = {
            useFindAndModify: false,
            new: true
          }

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))
        
        let rant = null,ind = 0

        for ( rant in params.rantIDList){
            winstonLogger.info("current ID: "+ params.rantIDList[ind])
            winstonLogger.info(params.rantIDList[ind])

            await rantService._rantModel.findOneAndRemove(
                {_id: params.rantIDList[ind]},
                options
            ).
            then((res) => {

                if(res !== null){
                    winstonLogger.info('DELETE: rant')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated
                }
                // if it didn't persist try again Or serialize if DB is down ...   
            }).
            catch((e) =>{

                winstonLogger.error('ERROR:deleting rant')
                winstonLogger.error(e)

            })
            ind++
        }
        

    }
}

export default onVent