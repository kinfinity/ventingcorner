/** 
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * categoryModel: () : categorySchema : () : mongooseSchema
 * 
 */

import mongoose from '../../Infrastructure/plugins/mongooseCon'
require('mongoose-type-url')

const TSchema = mongoose.Schema

const categorySchema = TSchema({
    title: {
        type: String,
        require:true,
        unique: false
    },
    description:{
        type: String,
        require: false,
        unique: false
    },
    subscribers:{
        type: Number,
        require: false,
        unique: false
    },
    images: [{
        type: TSchema.Types.Url,
        required: false
    }],
    vents: [{
        type: TSchema.Types.ObjectId,
        ref: 'ventModel'
    }],
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
categorySchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }

    next()
    
})

export default mongoose.model('categoryModel', categorySchema)