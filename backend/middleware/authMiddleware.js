const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const authMiddleware = async(req,res,next)=>{
    // check the authorization header to get JWT token from client
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"user is not authorized!"});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded.id;   //pass logged user id to another middlewares
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({message:"invalid token!"});
    }
}

module.exports = authMiddleware;