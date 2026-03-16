import {Request, Response, NextFunction} from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'
import {IUser} from '../model/User.js'
import User from '../model/User.js'
import TryCatch from '../middlewares/trycatch.js'

export interface AuthenticatedRequest extends Request{
    user?: IUser | null
}

export const isAuth = async(req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> =>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401).json({
                message:"Please Login, No auth Header",
            })

            return;
        }
        const token = authHeader.split(' ')[1];

        if(!token){
            res.status(401).json({
                message:"Please Login, Token Missing",
            })
            return;
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload

        if(!decodedValue || !decodedValue.user){
            res.status(401).json({
                message:"Invalid Token",
            })
            return;
        }

        req.user = decodedValue.user;
        next()
    }
    catch(error){
        res.status(500).json({
            message:"Please Login = JWT error"
        })
    }
}

const allowedRoles = ['customer', 'rider', 'seller'] as const;

type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(async(req:AuthenticatedRequest, res)=>{
    if(!req.user?._id){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    const {role} = req.body as {role:Role}

    if(!allowedRoles.includes(role)){
        return res.status(400).json({
            message:"Invalid Role"
        })
    }

    const user = await User.findByIdAndUpdate(req.user._id, {role}, {new:true})

    if(!user){
        return res.status(404).json({
            message:"User not found"
        }) 
    }

    const token = jwt.sign({user}, process.env.JWT_SEC as string,{
        expiresIn:"15d"
    })

    res.json({user, token})
})