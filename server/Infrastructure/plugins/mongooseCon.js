/*
 *  Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * mongooseCon : () : connection
 *      create mongoose connection to mongoDB
 */

import config from '../utils/config';
import mongoose from 'mongoose';
import winstonLogger from '../utils/winstonLogger';

// Mongo Connection options
const options = {
    keepAlive: true,
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    //reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    //reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    //bufferMaxEntries: 1,
    connectTimeoutMS: 20000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    useUnifiedTopology: true
};

/**
 * Connection.once('open', () => {
 *
 * console.log('connection opened');
 * connection.on('connected', () => console.log('MongoDB event connected'));
 * connection.
 * on('disconnected', () => console.log('MongoDB event disconnected'));
 * connection.
 * on('reconnected', () => console.log('MongoDB event reconnected'));
 * connection.
 * on('error', (err) => console.log(`MongoDB event error:  ${err}`));
 * connection.
 * on('unhandledRejection', (reason, p) => {
 * error(`Unhandled Rejection at: ${util.inspect(p)} reason: ${reason}`);
 *});
 *
 * // Return resolve();
 * return server.start();
 *
 * });
 */

 winstonLogger.info(config.dbURI)
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(config.dbURI, options)
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));


//* Create and export the connection
export default  mongoose;
