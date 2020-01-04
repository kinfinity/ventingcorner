/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 */

import redisClient from '../plugins/redisClient'
import winstonLogger from './winstonLogger'

const redisAuthCache = {

    /**
     *  whitelist manipulation in redis cacheDB
     *  holds Token references for multiple logins
     *  user | device | [location?]
     * 
     */
    Whitelist: {

        /**
         * Add Token reference of logged in users
         */
        AddToken: async (key, Token) =>{

            //
            redisClient.setSync(key, Token)
            redisClient.getSync(key)
            winstonLogger.info(`LOGGED_IN: ${key}`)
            winstonLogger.info(`TOKEN: ${Token}`)

        },
        /**
         * verify if Token is logged in
         */
        verify: async (key) => {

            //
            if(redisClient.getSync(key)){
                return Promise.resolve(true)
            }else{
                winstonLogger.info('login not found')
                return Promise.resolve(false)
            }

        },
        /**
         * logging out or blocking user -> remove from whitelist
         */
        remove: async (key) => {

            //
            return Promise.resolve(redisClient.remove(key))

        },

    },
    /**
     *   blacklist manipulation in redis cacheDB
     *   holds Token references for tokens Logged out but which haven't expired
     *  the expiry time should be checked to remove the token from this list to avoid memory spillage
     */
    Blacklist: {
        /**
         * Add Token reference of logged in users
         */
        AddToken: async (Token) =>{},
        /**
         * Verify if token is in blacklist
         */
        verify: async (Label) => {},
        /**
         * remove from blacaklist.
         */
        Remove: async (Token) =>{},

    }

 }

 export default redisAuthCache