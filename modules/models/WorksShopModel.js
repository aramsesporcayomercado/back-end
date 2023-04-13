const{Schema, model} = require('mongoose');

const worksShopSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    category:{
        type:String,
        require:true
    }
}, {timestamps:true}
)
worksShopSchema.index({name:1}, {unique:true})

module.exports = model('Taller',worksShopSchema);