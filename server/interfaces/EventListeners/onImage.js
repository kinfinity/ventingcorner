/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 */

import winstonLogger from '../../Infrastructure/utils/winstonLogger' 

// Category 
 const Category =  {

    profileUpdate: async(params) => { //schoolName, schoolID, schoolSessionID

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))

        educationManagementController.updateImageTeacher(params.ImageAlias, params.ImageID, params.teacherRef, params.oldteacherRef).
        then((res) => {


                if(res !== null){

                    winstonLogger.info('UPDATE: ImageID in teacher documents')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated 
                }
                // if it didn't persist try again Or serialize if DB is down ... 

        }).
        catch((e) =>{

            winstonLogger.error('ERROR: fixing ImageID in teacher documents')
            winstonLogger.error(e)

        })

    }

}

// Vent
const Vent =  {

    imageUpdate: async(params) => { //schoolName, schoolID, schoolSessionID

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))

        educationManagementController.updateImageTeacher(params.ImageAlias, params.ImageID, params.teacherRef, params.oldteacherRef).
        then((res) => {


                if(res !== null){

                    winstonLogger.info('UPDATE: ImageID in teacher documents')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated 
                }
                // if it didn't persist try again Or serialize if DB is down ... 

        }).
        catch((e) =>{

            winstonLogger.error('ERROR: fixing ImageID in teacher documents')
            winstonLogger.error(e)

        })

    }

}

// Rant
const Rant =  {

    profileUpdate: async(params) => { //schoolName, schoolID, schoolSessionID

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))

        educationManagementController.updateImageTeacher(params.ImageAlias, params.ImageID, params.teacherRef, params.oldteacherRef).
        then((res) => {


                if(res !== null){

                    winstonLogger.info('UPDATE: ImageID in teacher documents')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated 
                }
                // if it didn't persist try again Or serialize if DB is down ... 

        }).
        catch((e) =>{

            winstonLogger.error('ERROR: fixing ImageID in teacher documents')
            winstonLogger.error(e)

        })

    }

}


const User =  {

    profileUpdate: async(params) => { //schoolName, schoolID, schoolSessionID

        winstonLogger.info('Event Launched')
        winstonLogger.info(JSON.stringify(params,null,4))

        educationManagementController.updateImageTeacher(params.ImageAlias, params.ImageID, params.teacherRef, params.oldteacherRef).
        then((res) => {


                if(res !== null){

                    winstonLogger.info('UPDATE: ImageID in teacher documents')
                    winstonLogger.info(JSON.stringify(res,null,4))
                    //validated 
                }
                // if it didn't persist try again Or serialize if DB is down ... 

        }).
        catch((e) =>{

            winstonLogger.error('ERROR: fixing ImageID in teacher documents')
            winstonLogger.error(e)

        })

    }

}
const onImage = {
    User,
    Vent,
    Rant,
    Category
}

export default onImage