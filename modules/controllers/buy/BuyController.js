const {Router,Response} = require('express');
const buySchema = require('../../models/BuyModel');
const userSchema = require("../../models/PersonModel")
const { validateError} = require("../../../utils/fuctions");

const insert = async (req, res = Response) => {
    try {
        const { price, buy,userId } = req.body;
        if(!price || !buy || !userId)  throw Error("Missing fields")

        const horaMx = new Date().toLocaleString("es-MX", {
                timeZone: "America/Mexico_City",
            hour12: false,
            year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
            .replace(/[/]/g, "-")
            .replace(/[,]/g, " ");
        const response = await buySchema({price,product:buy.idProduct,user: userId, date:horaMx });
        await response.save();

        // actualiza la colección de usuarios con el ID de la compra creada
        const user = await userSchema.findById(userId);
        user.buys.push(response._id);
        await user.save();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).send({ message });
    }
};


const getAll = async (req,res = Response) =>{
    try {
        const results= await buySchema.find().select("_id product price date user").
        populate({path: "user", select: "_id name email role",}).
        populate({path: "product", select: "name price",}).
        sort({ date: -1 }); // -1 indica orden descendente;
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
        const results= await buySchema.findById(id).select("_id buy price date user").populate("user","_id name email role ");
        results != null ? res.status(200).json(results) : res.status(400).json({message:"No existe la venta"});
    } catch (err) {
        console.log(err);
        const message = validateError(err);
        res.status(400).json({ message });
    }
}





const buyRouter = Router();
buyRouter.post('/', [], insert);
buyRouter.get('/',[],getAll);
buyRouter.get('/:id',[],getById);
module.exports = {buyRouter};