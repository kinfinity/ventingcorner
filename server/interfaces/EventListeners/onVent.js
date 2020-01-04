/**
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * 
 */

import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import categoryService from '../../domains/services/categoryService'

 const onVent =  {

    /**
     *  Patch in the Vent into the Category for which it was created 
     * 
     *  Params 
     *          - VentID
     *          - CategoryID
     * 
     */
    created: async(params) => { 

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))

        categoryService.
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
    

    deleted: async(params) => {

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))
        
        categoryService.
        removeVent(params.VentID,params.CategoryID).
        then((res) => {


                if(res !== null){

                    winstonLogger.info('REMOVE: Vent from Category document')
                    winstonLogger.info(res)
                    //validated
                    
                }
                // if it didn't persist try again Or serialize if DB is down ... 
                
        }).
        catch((e) =>{

            winstonLogger.error('ERROR: removing Vent from Category document')
            winstonLogger.error(e)

        })

    }

}

export default onVent