const {Router,Response, json} = require('express');
const worksShopSchema = require('../../models/WorksShopModel');
const { validateError} = require("../../../utils/fuctions");
const userSchema = require("../../models/PersonModel");

const insert = async (req, res = Response) => {
    try {
        const { name,price,category} = req.body;
        if(!name || !price || !category)  throw Error("Missing fields")

        console.log(req.body);
        //valida que no exista un servicio igual
        const existUser = await worksShopSchema.findOne({name});
        if(existUser){
            res.status(400).json({message:"Ya existe el servicio"});
        }else{
            const response = await worksShopSchema({name,price,category});
            await response.save();
            res.status(200).json({message:"Registrado correctamente",response});
        }

    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).send({ message });
    }
};


const getAll = async (req,res = Response) =>{
    try {
        const results= await worksShopSchema.find();
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
        const results= await worksShopSchema.findById(id);
        results != null ? res.status(200).json(results) : res.status(400).json({message:"No existe el servicio"})
    } catch (err) {
        console.log(err);
        const message = validateError(err);
        res.status(400).json({ message });
    }
}

const deleteById = async  (req,res =Response) =>{
    try {
        const {id} = req.params;
        const results = await  worksShopSchema.deleteOne({_id:id});
        res.status(200).json({message:"Eliminado correctamente",results});
    }catch (err){
        const message = validateError(err)
        res.status(400).json({message})
    }
}
const updateById = async (req,res = Response) =>{
    try {
        const {id} = req.params;
        const {name,price,category} = req.body;
        if(!name || !price || !category || !id)  throw Error("Missing fields")
        const service = await worksShopSchema.findOneAndUpdate({_id:id},{name:name,price:price,category:category}, {new:true})
        res.status(200).json({message:"Actualizado correctamente",service})
    }catch (err){
        const message = validateError(err);
        res.status(400).json({message})
    }
}


const worksShop = Router();
worksShop.post('/', [], insert);
worksShop.get('/',[],getAll);
worksShop.get('/:id',[],getById);
worksShop.delete('/:id',[],deleteById)
worksShop.put('/:id',[],updateById)
module.exports = {worksShop};
