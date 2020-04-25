const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
//mean-course will be my database that will be created on the fly
mongoose.connect("mongodb+srv://subhajit:tDaIPDU8Nfa8NWzS@cluster0-kkltl.mongodb.net/mean-course?retryWrites=true&w=majority")
.then(()=>{console.log("connected to database");})
.catch(()=>{console.log("connection failed")});

app.use('/images', express.static(path.join('backend/images')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

//app.use('/api/posts', postRouter);

const searchRouter = require('./search/search');

app.use('/api/search', searchRouter);

module.exports = app;


//mongo db
//subhajit
//tDaIPDU8Nfa8NWzS
