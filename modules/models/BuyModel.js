const{Schema, model} = require('mongoose');
const buySchema = new Schema({
        price:{
            type:Number,
            require:true},
            product:{
                type:Schema.Types.ObjectId,
                ref:"Product",
                require: true
            },

    user: { type: Schema.Types.ObjectId, ref: "Usuario", require:true },

    date:{type: String}
    }, {timestamps:true} //creacion
)
buySchema.index({user:1,date:1})
module.exports = model('Compra',buySchema);