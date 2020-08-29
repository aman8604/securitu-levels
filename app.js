//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine",'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/authTest",{ useNewUrlParser: true, useUnifiedTopology: true } )
const db = mongoose.connection;
db.on("error",function(){
    console.log("Can't connect to the Database");
});

db.on("open",function(){
    console.log("connected to the Database Successfully");
});

const usersSchema =new mongoose.Schema({
    userName:String,
    password:String
});

usersSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']})

const User = mongoose.model("user",usersSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        userName: req.body.username,
        password: req.body.password
    });
    newUser.save(function(){
        res.render("secrets");
    })
})

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    User.findOne({userName:req.body.username},function(err,user){
        if(!err){
            if(user){
                if(user.password===req.body.password){
                    res.render("secrets");
                }
                else{
                    res.send("Wrong Password");
                }
            }
            else{
                res.send("User Not Found"); 
            }
        }
    })
})









app.listen(3000,function(){
    console.log("Server is listining at Port: 3000");
})