import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()

export const verifyToken = (req, res, next)=>{
    const token = req.cookies.token
    if(!token){
        res.status(401).json({success: false, message: "Unauthorized - no token provided"})
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        if(!decoded) return res.status(401).json({success:false,message:"Unauthorized - no token provided"})
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.log("error in verifyToken", error)
        return res.status(500).json({success:false, message: "server error"})
    }
}