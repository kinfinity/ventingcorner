/**
 * #k_infinityIII@Echwood
 *
 * cloudinaryCon:
 *  sets up enviroment to upload images and videos
 *
 * Fucntions:
 *
 *
 */
// Config settings
import config from '../utils/config'
import userEvents from '../../interfaces/Events/userEvents'
import winstonLogger from '../utils/winstonLogger'
import cloudinary from 'cloudinary'
// const cloudinary = require('cloudinary').v2
import ventEvents from '../../interfaces/Events/ventEvents'


cloudinary.config({ 
    cloud_name: config.cloudinaryName,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
    api_key: config.cloudinaryAPIKey, 
    api_secret: config.cloudinarySecret 
})

const cloudinaryCon = {

    async uploadUserProfileImage(Image, Name, Email){

        let res = null 
        const userID = Name + Email

        winstonLogger.info("CLOUDINARY")
        winstonLogger.info(JSON.stringify(cloudinary.v2,null,4))

        await cloudinary.v2.uploader.upload(
            Image, 
            {
                folder: "user/" + userID,
                public_id: userID0,
                overwrite: true,
                invalidate: true,
                width: 810, height: 456, crop: "fill"

        }).
        then((result) => {
            res = result
        }).
        catch((e) => {

            winstonLogger.error('Error uploading ProfileImage')
            winstonLogger.error(JSON.stringify(e,null,4))

            return res = false

        })

        // Emit event for LogoPersistence
        try {
            
            winstonLogger.info('Upload Result')
            winstonLogger.info(JSON.stringify(res.url, null,4))
            
            if(res !== null && res !== false){

            }        
            
                //create holder for response image url
                const logoURL = res.url

                winstonLogger.info('EVENT PARAMETERS')
                winstonLogger.info(Name)
                winstonLogger.info(Email)
                winstonLogger.info(res.url)

                // fire Events then send payload
                userEvents.
                emit('user-ProfileImageUploaded',
                    {// send params
                    Name,
                    Email, 
                    logoURL
                })

                return res = true


        } catch (e) {
        
            winstonLogger.error('Error emitting event')
            winstonLogger.error(JSON.stringify(e,null,4))

            return res = false

        }
        // Check if the db url was updated else persist the picture to local storage[serialise] and try again later
        

        return res

    }, 
    //upload Post Images
    async uploadPostImages(Image,Topic,PostID){

        let res = null 

        winstonLogger.info("CLOUDINARY")
        winstonLogger.info(Topic)
        winstonLogger.info(PostID)
    
        await cloudinary.v2.uploader.upload(
            Image, 
            {
                folder: Topic + "/" + PostID,
                public_id: PostID,
                overwrite: true,
                invalidate: true,
                // width: 810, height: 456, crop: "fill"
        }).
        then((result) => {
            winstonLogger.info('UPLOADING...')
            winstonLogger.info(JSON.stringify(result,null,4))
            res = result
        }).
        catch((e) => {

            winstonLogger.error('Error uploading  Image')
            winstonLogger.error(JSON.stringify(e,null,4))

            return res = false

        })

        // Emit event for Persistence
        try {
            
            winstonLogger.info('Upload Result')
            winstonLogger.info(JSON.stringify(res.url, null,4))
            
            if(res !== null && res !== false){

            }                

                const notificationURL = res.url

                winstonLogger.info('EVENT PARAMETERS')
                winstonLogger.info(Topic)
                winstonLogger.info(PostID)
                winstonLogger.info(res.url)

                // fire Events then send payload
                ventEvents.
                emit('post-ImagesUploaded',
                    {// send params
                    Topic,
                    PostID,
                    notificationURL
                })

                return res = true


        } catch (e) {
        
            winstonLogger.error('Error emitting event')
            winstonLogger.error(JSON.stringify(e,null,4))

            return res = false

        }
        // Check if the db url was updated else persist the picture to local storage[serialise] and try again later

        return res

    },
    // upload Topic Images
    async uploadTopicImages(Image,Topic){

        let res = null 

        winstonLogger.info("CLOUDINARY")
        winstonLogger.info(Topic)
    
        await cloudinary.v2.uploader.upload(
            Image, 
            {
                folder: Topic,
                public_id: Topic,
                overwrite: true,
                invalidate: true,
                // width: 810, height: 456, crop: "fill"
        }).
        then((result) => {
            winstonLogger.info('UPLOADING...')
            winstonLogger.info(JSON.stringify(result,null,4))
            res = result
        }).
        catch((e) => {

            winstonLogger.error('Error uploading  Image')
            winstonLogger.error(JSON.stringify(e,null,4))

            return res = false

        })

        // Emit event for Persistence
        try {
            
            winstonLogger.info('Upload Result')
            winstonLogger.info(JSON.stringify(res.url, null,4))
            
            if(res !== null && res !== false){

            }                

                const notificationURL = res.url

                winstonLogger.info('EVENT PARAMETERS')
                winstonLogger.info(Topic)
                winstonLogger.info(res.url)

                // fire Events then send payload
                ventEvents.
                emit('topic-ImageUploaded',
                    {// send params
                    Topic,
                    notificationURL
                })

                return res = true


        } catch (e) {
        
            winstonLogger.error('Error emitting event')
            winstonLogger.error(JSON.stringify(e,null,4))

            return res = false

        }
        // Check if the db url was updated else persist the picture to local storage[serialise] and try again later

        return res

    }

}

export default cloudinaryCon