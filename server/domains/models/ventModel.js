/**
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * ventModel: () : ventSchema : () : mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
require('mongoose-type-url')

const TSchema = mongoose.Schema

const ventSchema = TSchema({
    title: {
        type: String,
        require:true,
        unique: false
    },
    text:{
        type: String,
        require: false,
        unique: false
    },
    image: {
        type: TSchema.Types.Url,
        required: false
    },
    category:{
        type: TSchema.Types.ObjectId,
        ref: 'categoryModel'
    },
    views: {
        'default': 0,
        'type': Number
    },
    rantCount: {
        'default': 0,
        'type': Number
    },
    rants: [{
        type: TSchema.Types.ObjectId,
        ref: 'rantModel'
    }],
    actionStats:{
        likes:{
            type: Number,
            required: false,
            default: 0
        },
        dislikes:{
            type: Number,
            required: false,
            default: 0
        }
    },
    created_at: { 
        type: Date,
         required: false, 
         default: Date.now()
    },
    udpated_at: { 
        type: Date, 
        required: true, 
        default: Date.now() 
    }},
    {
    timestamps: true,
    strict: true
})

// Preparatory steps before save to model(pre-save)
ventSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }

    next()
    
})

export default mongoose.model('ventModel', ventSchema)