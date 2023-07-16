const express = require('express');
const getValidationErrors = require("../utils/index")
const Admin = require("../models/adminModel")
const Course = require("../models/courseModel")
const jwt = require("jsonwebtoken");
const adminAuth = require('../middleware/adminAuth');
require('dotenv').config()

const adminSecretKey = process.env["ADMIN_SECRET_KEY"]

const router = express.Router();

router.post("/signup",async (req,res) => {
    const {username, password} = req.body
    try{
        const usernameExists = await Admin.findOne({username})
        if(usernameExists){
            res.status(400).json({error : "Username is already in use"})
            return
        }
        const newAdmin = new Admin({username, password})
        await newAdmin.save()
        res.status(201).json({message : "Admin created successfully"})
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
        const userFound = await Admin.findOne({username, password})
        if(userFound){
            const payload = {username : userFound["username"]}
            const token = jwt.sign(payload,adminSecretKey,{expiresIn : "1h"})
            res.json({message : "Logged in successfully", token})
        }
        else
            res.status(404).json({error : "Invalid credentials"})
    } catch(e){
        res.status(500).json({error : "Something went wrong, please try again"})
    }
})

router.post("/courses",adminAuth,async (req,res) => {
    const {title, description, price, imageLink, published} = req.body
    try{
        const newCourse = new Course({title, description, price, imageLink, published})
        await newCourse.save()
        res.status(201).json({message : "Course successfully added"})
    } catch(e){
        if(e.name === "ValidationError"){
            const errors = getValidationErrors(e.errors)
            res.status(400).json({error : errors})
        }
        else
            res.status(500).json({error : "Something went wrong, please try again"})
    }
})

router.put("/courses/:courseId",adminAuth,async (req,res) => {
    const {courseId} = req.params
    try{
        const course = await Course.findByIdAndUpdate(courseId,req.body,{new : true, runValidators : true})
        if(!course){
            res.status(404).json({error : "Course not found"})
            return
        }
        res.json({message : "Course has been updated"})
    } catch(e){
        if(e.name === "CastError")
            res.status(400).json({error : e.message})
        else
            res.status(500).json({error : "Something went wrong, please try again"})
    }
})

router.get("/courses",adminAuth,async (_,res) => {
    try{
        const courses = await Course.find()
        res.json({courses})
    } catch(e){
        res.status(500).json({error : "Something went wrong, please try again"})
    }
})


module.exports = router