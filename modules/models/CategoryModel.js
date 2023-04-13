const{Schema, model} = require('mongoose');
const categorySchema = new Schema({
        name:{type:String, require:true},
        products: [{ type:Schema.Types.ObjectId, ref: "Product" }],
    }, {timestamps:true} //creacion
)
categorySchema.index({name:1}, {unique:true})
module.exports = model('Category',categorySchema);