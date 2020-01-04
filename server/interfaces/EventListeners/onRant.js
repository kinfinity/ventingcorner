/**
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * 
 */

import winstonLogger from '../../Infrastructure/utils/winstonLogger'
import ventService from '../../domains/services/ventService'
import rantService from '../../domains/services/rantService'

 const onRant =  {

    /**
     *  Patch in the rant into the post for which it was created 
     * 
     *  Params 
     *          - VentID
     *          - rantID
     * 
     */
    created: async(params) => { 

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))

        ventService.
        addrant(params.RantID,params.VentID).
        then((res) => {


                if(res !== null){

                    winstonLogger.info('UPDATE: rant to post document')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated
                }
                // if it didn't persist try again Or serialize if DB is down ... 
                
        }).
        catch((e) =>{

            winstonLogger.error('ERROR: appending rant to post document')
            winstonLogger.error(e)

        })

    },
    

    deleted: async(params) => {

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))
        
        ventService.
        removerant(params.RantID,params.VentID).
        then((res) => {


                if(res !== null){

                    winstonLogger.info('REMOVE: rant from post document')
                    winstonLogger.info(res)
                    //validated
                    
                }
                // if it didn't persist try again Or serialize if DB is down ... 
                
        }).
        catch((e) =>{

            winstonLogger.error('ERROR: removing rant from post document')
            winstonLogger.error(e)

        })

    },

    deleteMultiple: async(params) => {

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))
        
        rantService.
        deleteMultiple(params.RantIDList).
        then((res) => {


                if(res !== null){

                    winstonLogger.info('REMOVE: rant from post document')
                    winstonLogger.info(res)
                    //validated
                    
                }
                // if it didn't persist try again Or serialize if DB is down ... 
                
        }).
        catch((e) =>{

            winstonLogger.error('ERROR: removing rant from post document')
            winstonLogger.error(e)

        })

    }


}

export default onRant