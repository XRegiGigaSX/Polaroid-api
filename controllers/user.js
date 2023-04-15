import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import GoogleUser from '../models/googleUser.js';

export const googleSignIn = async (req, res) => {
    console.log("google server")
    const user = req.body;
    try{
        // const user = (localStorage.getItem('profileTemp'))
        console.log(user);
        const token = jwt.sign({email: user.email, id: user.sub }, 'test', {expiresIn: '1h'});
        const result = await GoogleUser.create({email: user.email, name: `${user.fname} ${user.lname}`});

        res.status(200).json({result, token});
    }catch(err){
        res.status(500).json({message: "Something went wrong! Try again later."})
    }
    
}

export const signin = async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const existingUser = await User.findOne({email})
        console.log(existingUser);
        if(!existingUser) return res.status(404).json({message: "User not found"});

        const passCheck = await bcrypt.compare(password, existingUser.password);
        console.log(passCheck);
        if(!passCheck) return res.status(420).json("Invalid Credentials. Please try again.")

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: '1h'})
        // console.log(token);
        res.status(200).json({result: existingUser, token: token});

    } catch (error) {
        res.status(500).json({message: "Something went wrong! Try again later."})
    }
}

export const signup = async (req, res) => {
    const {email, password, confirmPassword, firstname, lastname} = req.body;

    try {
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({message: "User already exists. Please Sign in."});
        console.log(existingUser);
        if(password !== confirmPassword) return res.status(400).json({message: "Passwords do not match."});

        const hashPass = await bcrypt.hash(password, 12);
        const result = await User.create({email, password: hashPass, name: `${firstname} ${lastname}`});

        const token = jwt.sign({email: result.email, id: result._id }, 'test', {expiresIn: '1h'});

        res.status(200).json({result, token: token});
    } catch (error) {
        res.status(500).json({message: "Something went wrong! Try again later."});
    }
}