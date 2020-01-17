/**
 * Created by k_infinity3 <ksupro1@gmail.com>
 * December 2019
 * 
 * rantModel: () : rantSchema : () : mongooseSchema
 * 
 */
import mongoose from '../../Infrastructure/plugins/mongooseCon'
require('mongoose-type-url')

const TSchema = mongoose.Schema

const rantSchema = TSchema({
    created_by: {
        type: TSchema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    text:{
        type: String,
        require: false,
        unique: false
    },
    image: {
        type: String,
        require: false,
        unique: false
    },
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
rantSchema.pre('save', function(next) {

    const now = new Date()
    this.updated_at = now
    if ( !this.created_at ) {
        this.created_at = now
    }

    next()
    
})

export default mongoose.model('rantModel', rantSchema)