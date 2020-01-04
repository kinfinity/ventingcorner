/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 *
 */

import buffer from 'buffer'
import fs from 'fs'
import path from 'path'
import winstonLogger from './winstonLogger';

const imageBuffer = buffer.Buffer
const base64Image =  {
    // Encode -> Image to base64 string
    async encode(Image) {
        try {

            await fs.readFileSync(

                Image,
                (err,data) => {
                    
                    winstonLogger.info('Encoding to base64')
                    winstonLogger.info(data)
                    winstonLogger.info(Image.toString())

                    return imageBuffer.from(data).toString('base64')
        
                }

            )

        } catch (e) {

            winstonLogger.error('Error encodingImage -> BASE64')
            winstonLogger.error(e)

        }

    },
    // Decode -> base64 String to Image
    async decode(base64String, writePath) {//writePath includes the filename and extension
        
        await fs.writeFileSync(
            path.join(__dirname,writePath),
            imageBuffer.from(base64String, 'base64')
        ).
        then((res) => {

            return true

        }).
        catch((e) => {

            winstonLogger.error('Error decodingImage <- BASE64')
            winstonLogger.error(e)

        })

    }
}

export default base64Image