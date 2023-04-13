const {Router,Response} = require('express');
const categorySchema = require('../../models/CategoryModel');
const { validateError} = require("../../../utils/fuctions");

const insert = async (req, res = Response) => {
    try {
        const { name} = req.body;
        if(!name)   throw Error("Missing fields")

        console.log(req.body);
        //valida que no se registre una categoria existente
        const existCategory = await  categorySchema.findOne({name});
        if (existCategory){
            res.status(400).json({message:"La categoria ya existe"})
        }else{
            const category = await categorySchema({name});
            await category.save();
            res.status(200).json({message:"Registrada correctamente",category});
        }

    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).send({ message });
    }
};


const getAll = async (req,res = Response) =>{
    try {
        const results= await categorySchema.find().select("_id name createdAt products").
        populate("products","_id name description price createdAt");
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
        const results= await categorySchema.findById(id).select("_id name createdAt products").populate("products");
        results != null ? res.status(200).json(results) : res.status(400).json({message:"La categoria no existe"})
    } catch (err) {
        console.log(err);
        const message = validateError(err);
        res.status(400).json({ message });
    }
}


const update = async (req, res = Response) => {
    try {
        const{id} = req.params;
        const {name} = req.body;
        if(!name || !id)   throw Error("Missing fields")

        console.log(req.body);
        const category = await categorySchema.findOneAndUpdate({_id: id}, {name: name}, {new: true});
        res.status(200).json({message:"Actualizado correctemente",category});
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).send({ message });
    }
};

const deleteById = async (req,res = Response) =>{
    try {
        const {id} = req.params;
        const results = await categorySchema.deleteOne({ _id: id });
        res.status(200).json({message:"Eliminado con exito",results});
    } catch (err) {
        console.log(err);
        const message = validateError(err);
        res.status(400).json({ message });
    }
};


const categoryRouter = Router();
categoryRouter.post('/', [], insert);
categoryRouter.get('/',[],getAll);
categoryRouter.get('/:id',[],getById);
categoryRouter.put('/:id',[],update);
categoryRouter.delete('/:id',[],deleteById);
module.exports = {categoryRouter, };