/*
 * Created by Egbewatt kokou <ksupro1@gmail.com>
 * 
 * December 2019
 *
 */

 const nodemon =  require('nodemon')
require = require('esm')(module)
global.Promise = require('bluebird');

/**
nodemon({
    script: require('./src/server/Infrastructure/appServer'),
    stdout: false // output to console
}).on('readable', function() { 
    this.stdout.pipe(fs.createWriteStream('./logs/output.txt'));
    this.stderr.pipe(fs.createWriteStream('./logs/err.txt')); 
});
 */

module.exports = require('./server/Infrastructure/appServer')
