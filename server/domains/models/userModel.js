/**
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 *
 *  userModel: () : userSchema: () : mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
import winstonLogger from '../../Infrastructure/utils/winstonLogger'
require('mongoose-type-url')
require('mongoose-type-email')
import uniqueValidator from 'mongoose-unique-validator'

const TSchema = mongoose.Schema
/**
     * name,
     * email,
     * password,
     * address, 
     * profileImage,
     * Categorys
     * birthDate
     * 
     * followers + count
     * following + count
     * 
 */
const userSchema = new TSchema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    email: {
        type: TSchema.Types.Email,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    phoneNumber:{
      type: Number,
      max: 13,
      min: 11
    },
     profileImage: {//mongoose.SchemaTypes.Url
       type: TSchema.Types.Url,
       required:false,

     },
     address: {  // ? strip
       type: String,
       required: false,
       unique: false
     },
    categorys: [{
     title:{
         type: String,
         required: false,
         unique: true
     },
     CategoryID: {
       type: TSchema.Types.ObjectId,
       ref: 'categoryModel'
     }
    }],
    vents: [{
      type: TSchema.Types.ObjectId,
      ref: 'ventModel'
    }],
    rants: [{
      type: TSchema.Types.ObjectId,
      ref: 'rantModel'
    }],
    followers: [{
       type: TSchema.Types.ObjectId,
       ref: 'userModel'
     }],
     followerCount: {
       type: Number,
       required: false,
       unique: false
     },
     following: [{
        type: TSchema.Types.ObjectId,
        ref: 'userModel'
      }],
      followCount: {
        type: Number,
        required: false,
        unique: false
      },
      birthDate: { type: Date }, // ? strip
      joinedOn: { type: Date, default: new Date() },
      verified: {
        type: Boolean,
        requried: false,
        default: false
      }
    },
    {
        timestamps: true,
        strict: true
    }

)

//
userSchema.plugin(uniqueValidator)

// Preparatory steps before save to model(pre-save)
userSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }
    winstonLogger.info('PRE:')
    winstonLogger.info(JSON.stringify(this,null,4))

    next()
    
})

export default mongoose.model('userModel', userSchema)