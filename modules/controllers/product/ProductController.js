const {Router,Response} = require('express');
const productSchema = require('../../models/ProductModel');
const { validateError} = require("../../../utils/fuctions");
const categorySchema = require("../../models/CategoryModel")
const insert = async (req, res = Response) => {
    try {
        const { name,description,price,categoryId } = req.body;
        console.log(req.body);
            if(!name || !description || !price || !categoryId) throw Error("Missing fields")
        //valida que no registre un producto ya existente
        const existProduct = await productSchema.findOne({name});
        if(existProduct){
            res.status(400).json({message:"El producto ya existe"})
        }else{
            const response = await productSchema({ name,description, price, category:categoryId});
            await response.save();

            // actualiza la colección de categoria con el ID del producto creado
            const category = await categorySchema.findById(categoryId);
            category.products.push(response._id)
            await category.save();
            res.status(200).json({message:"Creado con exito", response});
        }
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).send({ message });
    }
};


const getAll = async (req,res = Response) =>{
    try {
        const results= await productSchema.find().select("_id name description  price count createdAt category").
        populate("category","_id name");
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
        const results= await productSchema.findById(id).select("_id name description  price count createdAt category").
        populate("category","_id name");
        results != null ? res.status(200).json(results) : res.status(400).json({message:"El producto no existe"})
    } catch (err) {
        console.log(err);
        const message = validateError(err);
        res.status(400).json({ message });
    }
}


const update = async (req, res = Response) => {
    try {
        const {id} = req.params;
        const { name,description,price,category} = req.body;
        if(!name || !description || !price || !categoryId) throw Error("Missing fields")
        console.log(req.body);
        const product = await productSchema.findOneAndUpdate({_id:id},  {name:name,description:description,price:price,category:category},{new: true });
        res.status(200).json({message:"Actualizado correctamente",product});
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).send({ message });
    }
};

const deleteById = async (req,res = Response) =>{
    try {
        const {id} = req.params;
        const results= await productSchema.findByIdAndDelete({_id:id});
        res.status(200).json({message:"Eliminado con exito",results});
    } catch (err) {
        console.log(err);
        const message = validateError(err);
        res.status(400).json({ message });
    }
};


const productRouter = Router();
productRouter.post('/', [], insert);
productRouter.get('/',[],getAll);
productRouter.get('/:id',[],getById);
productRouter.put('/:id',[],update);
productRouter.delete('/:id',[],deleteById);
module.exports = {productRouter, };