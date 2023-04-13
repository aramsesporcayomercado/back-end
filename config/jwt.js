const jwt = require("jsonwebtoken");
const {Error} = require("mongoose");
require("dotenv").config();

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.SECRET);
};

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        console.log(token);
        if (!token) throw Error("");
        const decodedToken = jwt.verify(token, process.env.SECRET);
        req.token = decodedToken
        next();
    } catch (error) {
        res.status(401).json({ message: "token Unauthorized" });
    }
};

const checkToken = async (req,res , next) =>{
    try {
        const token = req.headers.authorization?.replace('token','');
        if (!token) throw Error("");
        const decodificar = jwt.verify(token,process.env.SECRET);
        req.token = decodificar;
        next();
    }catch (error){
        res.status(401).json({message:"token no valido"})
    }
};
const checkRoles = (roles) => {
    return async (req, res, next) => {
        try {
            const token = req.token;
            if(!token) throw Error("");
            if(!roles.some(role=>role===token.role)) throw Error("");
            next()
        } catch (error) {
            res.status(401).json({message: "role Unauthorized"})
        }
    }
}

const validateJWT = (req, res = response, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            msg: 'There is no token in the request',
        });
    }

    try {
        const { id, email, role } = jwt.verify(token, process.env.SECRET);

        req.id = id;
        req.email = email;
        req.role = role;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token is not valid',
        });
    }

    next();
};

module.exports = {
    generateToken,
    auth,
    checkRoles,validateJWT
};
