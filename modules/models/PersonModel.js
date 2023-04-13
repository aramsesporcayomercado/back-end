const{Schema, model} = require('mongoose');
const userSchema = new Schema({
        name:{type:String, require:true},
    email:{type: String, require: true},
    password:{type:String, require:true},
    role:{type:String, require:false},
        buys: [{ type:Schema.Types.ObjectId, ref: "Compra" }],

}, {timestamps:true} //creacion
)
userSchema.index({email:1}, {unique:true})

module.exports = model('Usuario', userSchema);