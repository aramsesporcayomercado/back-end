const {Router,Response} = require('express');
const userSchema = require('../../models/PersonModel');
const { hashPassword, validateError} = require("../../../utils/fuctions");
const {check} = require("express-validator");

const insert = async (req, res = Response) => {
  try {
    const { name,email,password,role } = req.body;
    console.log(req.body);
    if(!name || !email || !password || !role) throw Error("Missing fields")
    //valida que no registre un usuario existente
    const existUser = await userSchema.findOne({email});
    if(existUser){
      res.status(400).json({message:"El usuario ya existe"})
    }else{
      const user = await userSchema({ name,email, password,role});
      user.password = await hashPassword(password);
      await user.save();
      res.status(200).json({message:"Registrado correctamente",user});
    }

  } catch (error) {
    console.log(error);
    const message = validateError(error);
    res.status(400).send({ message });
  }
};
const getAll = async (req,res = Response) =>{
  try {
    const results= await userSchema.find().select("_id name email createdAt role buys").
    populate("buys","_id buy price date").sort({ date: -1 }); // -1 indica orden descendente;
    ;
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    const message = validateError(err);
    res.status(400).json({ message });
  }
}

const getById = async (req,res = Response) =>{
  try {
    const {id} = req.params;
    const results = await userSchema.findById(id).select("_id name email buys createdAt role").populate('buys',"_id price date");
   results != null ? res.status(200).json(results) : res.status(400).json({message:"El usuario no existe"})
  } catch (err) {
    console.log(err);
    const message = validateError(err);
    res.status(400).json({ message });
  }
}

const deleteById = async (req,res = Response) =>{
  try {
    const {id} = req.params;
    const results= await userSchema.deleteOne({_id:id});
    res.status(200).json({message:"Eliminado correctamente",results});
  } catch (err) {
    console.log(err);
    const message = validateError(err);
    res.status(400).json({ message });
  }
};



const update = async (req, res = Response) => {
  try {
    const {id} = req.params;
    const { name,email,password } = req.body;
    if(!name || !email || !password) throw Error("Missing fields")

    console.log(req.body);
    const user = await userSchema.findOneAndUpdate({_id: id},{name:name,email:email,password : await hashPassword(password)},{new: true});
    res.status(200).json({message:"Actualizado con exito",user});
  } catch (error) {
    console.log(error);
    const message = validateError(error);
    res.status(400).send({ message });
  }
};


const userRouter = Router();
userRouter.post('/', [], insert);
userRouter.get('/',[],getAll);
userRouter.get('/:id',[],getById);
userRouter.put('/:id',[],update);
userRouter.delete('/:id',[],deleteById);
module.exports = {userRouter, };