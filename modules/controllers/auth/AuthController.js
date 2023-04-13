const { Router, Response } = require('express');
const { generateToken } = require("../../../config/jwt");
const { validatePassword, validateError} = require("../../../utils/fuctions");
const userSchema = require('../../models/PersonModel');

const signin= async(req,res = Response) =>{
try {
const {email, password} = req.body;
console.log(req.body);
    if (!email || !password) throw Error("Missing fields");
    const existUser = await userSchema.aggregate([{$match: {email: email,}}]);
    if ( await validatePassword(    password, existUser[0].password)) {
        const token = await generateToken({
            id: existUser[0]._id,
            email: email,
            role:existUser[0].role,
            isLogged: true
        });
        res.status(200).json({token});
    }else{
        throw Error("Password mismatch");
    }
}catch (error){
console.log(error);
const message = validateError(error);
res.status(400).send({message});
}
};
const signRouter = Router();
signRouter.post('/',[],signin);
module.exports = {
    signRouter,
}