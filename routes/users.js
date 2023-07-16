const jwt = require("jsonwebtoken")
const express = require("express")
const User = require("../models/userModel")
const Course = require("../models/courseModel")
const getValidationErrors = require("../utils/index")
const userAuth = require("../middleware/userAuth")

require('dotenv').config()

const userSecretKey = process.env["USER_SECRET_KEY"]

const router = express.Router()

router.post("/signup",async (req,res) => {
    const {username, password} = req.body
    try{
        const usernameExists = await User.findOne({username})
        if(usernameExists){
            res.status(400).json({error : "Username is already in use"})
            return
        }
        const newUser = new User({username, password, courses : []})
        await newUser.save()
        res.status(201).json({message : "User created successfully"})
    } catch(e){
        const errors = getValidationErrors(e.errors)
        if(e.name === "ValidationError")
            res.status(400).json({error : errors})
        else
            res.status(500).json({error : "Something went wrong, please try again"})
    }
})

router.post("/login",async (req,res) => {
    const {username, password} = req.body
    if(!username || !password){
        res.status(400).json({error : "Please enter both username and password"})
        return
    }
    try{
        const userFound = await User.findOne({username, password})
        if(userFound){
            const payload = {username : userFound["username"]}
            const token = jwt.sign(payload,userSecretKey,{expiresIn : "1h"})
            res.json({message : "Logged in successfully", token})
        }
        else
            res.status(404).json({error : "Invalid credentials"})
    } catch(e){
        res.status(500).json({error : "Something went wrong, please try again"})
    }
})

router.post("/courses/:courseId",userAuth,async (req,res) => {
    const {courseId} = req.params
    try{
        const selectedCourse = await Course.findById(courseId)
        if(!selectedCourse || !selectedCourse["published"]){
            res.status(404).json({error : "Invalid course id"})
            return
        }
        const user = await User.findOne({username : req.username})
        if(user.courses.includes(courseId)){
            res.status(400).json({error : "Course already bought"})
            return
        }
        user.courses.push(selectedCourse)
        await user.save()
        res.json({message : "Course was successfully added"})
    } catch(e){
        if(e.name === "CastError")
            res.status(400).json({error : e.message})
        else
            res.status(500).json({error : "Something went wrong, please try again"})
    }
})

router.get("/purchasedCourses",userAuth,async (req,res) => {
    try{
        const user = await User.findOne({username : req.username}).populate("courses")
        console.log(user)
        res.json({courses : user.courses})
    } catch(e){
        res.status(500).json({error : "Something went wrong, please try again"})
    }
})

router.get("/courses",userAuth,async (req,res) => {
    try{
        const courses = await Course.find({published : true})
        res.json({courses})
    } catch(e){
        res.status(500).json({error : "Something went wrong, please try again"})
    }
})

module.exports = router