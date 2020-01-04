const redis = require('redis')
import {promisify} from 'util'
import winstonLogger from '../utils/winstonLogger'
var assert = require('assert')

// create and connect redis client to local instance.
const  options = {
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection')
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted')
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000)
    }
}

let client = redis.createClient(process.env.REDIS_URL)// ,options)
winstonLogger.info("REDIS_URL: \n\t "+ process.env.REDIS_URL)
winstonLogger.info("REDIS_STATE: "+ client.connected)
// error Handling
client.on('error', function (err) {
    winstonLogger.error(err.message)
    winstonLogger.error(err.stack)
    assert(err instanceof Error)
    assert(err instanceof redis.AbortError)
    assert(err instanceof redis.AggregateError)
    // The set and get get aggregated in here
    assert.strictEqual(err.errors.length, 2)
    assert.strictEqual(err.code, 'NR_CLOSED')
})

// rebind and Promisify get and set
const getAsync = () => {

    winstonLogger.info('cacheGET:')
    winstonLogger.info(client.connected)
    if(client.connected){
        return promisify(client.get).bind(client)
    }else{
        try{
            winstonLogger.info('reconnecting ... ')
            client.shutdown()
            client = redis.createClient(options)
            const get = promisify(redis.createClient(options).get).bind(client)
            return Promise.resolve(get)
        }catch(e){

            winstonLogger.error('ERROR: getting cache')
            winstonLogger.error(e.message)
            winstonLogger.error(e.stack)

        }
    }

}
const setAsync = () => {

    winstonLogger.info('cacheSET:')
    winstonLogger.info(client.connected)
    if(client.connected){
        return promisify(client.set).bind(client)
    }else{
        try{
            winstonLogger.info('reconnecting ... ')
            client.shutdown()
            client = redis.createClient(options)
            const set = promisify(redis.createClient(options).set).bind(client)
            return Promise.resolve(set)
        }catch(e){

            winstonLogger.error('ERROR: setting cache')
            winstonLogger.error(e.message)
            winstonLogger.error(e.stack)
            
        }
    }

}

const getSync =  (key) => {

    winstonLogger.info(`cacheGET: connected? ${client.connected}`)
    if(client.connected){
        winstonLogger.info('returning cache data')
        winstonLogger.info(client.get(key))
        return client.get(key)
    }else{
        try{
            winstonLogger.info('reconnecting ... ')
            client.shutdown()
            client = redis.createClient(options)
            return client.get(key)
        }catch(e){

            winstonLogger.error('ERROR: getting cache')
            winstonLogger.error(e.message)
            winstonLogger.error(e.stack)
            
        }
    }
}
const setSync =  (key,Data) => {

    winstonLogger.info(`cacheGET: connected? ${client.connected}`)
    if(client.connected){
        winstonLogger.info('returning cache data')
        return client.set(key,Data)
    }else{
        try{
            winstonLogger.info('reconnecting ... ')
            client.shutdown()
            client = redis.createClient(options)
            return client.set(key,Data)
        }catch(e){

            winstonLogger.error('ERROR: setting cache')
            winstonLogger.error(e.message)
            winstonLogger.error(e.stack)
            
        }
    }
}

const remove =  (key) => {

    winstonLogger.info('removing key')
    winstonLogger.info(`cacheGET: connected? ${client.connected}`)
    if(client.connected){
        winstonLogger.info('returning cache data')
        return client.del(key)
    }else{
        try{
            winstonLogger.info('reconnecting ... ')
            client.shutdown()
            client = redis.createClient(options)
            return client.del(key)
        }catch(e){

            winstonLogger.error('ERROR: setting cache')
            winstonLogger.error(e.message)
            winstonLogger.error(e.stack)
            
        }
    }
}

const RedisCache = {getAsync,setAsync,getSync,setSync,remove} 
export default RedisCache