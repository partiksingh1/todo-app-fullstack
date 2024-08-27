import express from "express"
import {User} from "../model/userSchema.js"
import zod from "zod"
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/index.js";
import bcrypt from "bcrypt";
import { error } from "console";

const userRoute = express.Router();
const userSignupSchema = zod.object({
    username:zod.string().min(1,"Name is required").trim(),
    email:zod.string().email("Invalid email format"),
    password:zod.string().min(8,"Password must be at least 8 characters long").trim(),
})
const userLoginSchema = zod.object({
    email:zod.string().email("Invalid email format"),
    password:zod.string().min(8,"Password must be at least 8 characters long").trim(),
})

userRoute.post("/signup",async (req,res)=>{
    try {
        const {success,data:userData,error} = userSignupSchema.safeParse(req.body);
        if(!success){
            return res.status(400).send({
                message:"Validation error",
                error:error.errors
            })
        }

        const {username,email,password} = userData;
        const existingUser =  await User.findOne({email})
    if(existingUser){
        return res.status(409).send({
            message:"user already exists with this email"
        })
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await User.create({
        username,
        email,
        password:hashedPassword,
    });

    if(newUser){
        return res.status(201).send({
            message:`User successfully created with email ${newUser.email}`,
            newUser : newUser,
        })
    }
    } catch (error) {
        console.error("Error creating user");
        res.status(500).send({
            message:"unable to create new user",
            error:error.message
        })
    }
})

userRoute.get("id/:_userId",authMiddleware,async(req,res)=>{
    try {
        const user = await User.findById(req.params._userId);
        if(user){
            return res.status(201).send({
                message:`User successfully found `,
                user : user,
            })
        }
        return res.status(404).send({
            message:`User not found `,
        })
    } catch (error) {
        console.error("Error fetch user");
        res.status(500).send({
            message:"unable to fetch new user",
            error:error.message
        })
    }
})

userRoute.get("/getUsers",authMiddleware,async(req,res)=>{
    try {
        const users = await User.find();
        if(users){
            return res.status(200).send({
                message:"Fetched all users",
                users: users
            });
        }
    } catch (error) {
        console.error("Error fetching user");
        res.status(500).send({
            message:"unable to fetch all users",
            error:error.message
        })
    }
})

userRoute.post("/login",async(req,res)=>{
    try {
        const {success,data:loginData,error} = userLoginSchema.safeParse(req.body);
        if(!success){
            res.status(400).send({
                message:"validation error",
                error:error.errors
            })
        }

        const {email,password}=  loginData;

        const user = await User.findOne({email});
        if(user && bcrypt.compareSync(password,user.password)){
            const token = jwt.sign({userId:user._id},"mysecretkey",{expiresIn:"24h"});
            return res.status(200).send({
                message:"Logged in successfully",
                user,
                token
            })
        }
        return res.status(401).send({
            message:"Incorrect email or password"
        });
    } catch (error) {
        console.error("Unable to login");
        res.status(500).send({
            message:"unable to login",
            error:error.message
        })
    }
})


export default userRoute;