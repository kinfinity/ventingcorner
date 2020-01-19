
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import fs from 'fs'
import cors from 'cors'
import helmet from 'helmet'
import winstonLogger from '../utils/winstonLogger'
import routeUtils from '../utils/routerOptions'
import publicEnums from '../../app/publicEnums'


// middle-ware options
const corsOptions = {
    "origin": "*",
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,crsf-token,x-csrf-token',
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "exposedHeaders": [
        'csrf-token', 'x-csrf-token'
    ]
}

const helmetOptions = {}


// main Express application/router 
const app = express()
app.
    use(cookieParser()).
    // use(helmet.hidePoweredBy({ setTo: 'VentingCorner' })).
    // use(helmet(helmetOptions)).
    use(cors(corsOptions)).
    use(bodyParser.json()).
    use(bodyParser.urlencoded({
        extended: true//
    }))

    app.use(helmet());
    app.use(helmet.xssFilter({ setOnOldIE: true }));
    app.use(helmet.frameguard('deny'));
    app.use(helmet.hsts({maxAge: 7776000000, includeSubdomains: true}));
    app.use(helmet.hidePoweredBy());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.noCache());


  
// Handle app errors
app.use(function (err, req, res, next) {

    if(err){

        winstonLogger.error("ENCOUNTERED ERROR:")
        winstonLogger.error(err.code)
        winstonLogger.error(err.message)
        winstonLogger.error(err.stack)
        winstonLogger.error("HEADERS:")
        winstonLogger.error(req.headers)

    }
    
    if (err.code == 'EBADCSRFTOKEN'){
        // handle CSRF token error
        winstonLogger.error('CSRF TOKEN TAMPERED WITH')
        res.json({
            state: publicEnums.VC_STATES.CSRF_ERROR,
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.CSRF_ERROR
        })

    }else if(err.code == 'ERR_ASSERTION'){
        // handle CSRF token error
        winstonLogger.error('ERR_ASSERTION')
        res.json({
            state: 'FAILURE',
            statusCode: publicEnums.VC_STATUS_CODES.REQUEST_ERROR,
            statusMessage: publicEnums.VC_STATUS_MESSAGES.ASSERTION_ERR,
            Token: null
        })

    }
    return next(err)

})


// On conditional require
const wrapper = {

    requireF: (modulePath) => {

        try {

            return require (modulePath)

        } catch (err) {

            winstonLogger.log({
                level: 'error',
                message: `requireF(): The file ${modulePath} could not be loaded :: ${err.stack}`
            })

            return false

        }

    }

}

// CSRFTOKEN GENERATION ENDPOINT
app.get("/csrfTOKEN", routeUtils.csrfMiddleware,function(req, res) {
    //    send the token to client
      let _token = req.csrfToken()
      winstonLogger.info(`GENERATED_CSRF: ${_token}`)
      res.json({ csrfToken: _token})
})

app.get("/viewHEADERS",function(req, res) {// For Debugging
      winstonLogger.info("REQUEST_HEADERS:" +JSON.stringify(req.headers,null,4))
      res.json({ 
            headers: req.headers,
            body: req.body
        })
})

// 
const routersPath = '../routerServices/'
const routerList = fs
        .readdirSync(`${__dirname}//${routersPath}`)
        .filter((filename) => filename.match(/\.js$/))

let index_ = 0
//
routerList.forEach((routerName) => {

    winstonLogger.info(`routerService[${index_}]: ${routerName}`)
    index_ += 1
    routerName.trim()
    routerName.split('.')[0]
    routerName = `../routerServices/${routerName}`

    const routerModule = wrapper.requireF(routerName)
    app.use(routerModule)

})

module.exports = app