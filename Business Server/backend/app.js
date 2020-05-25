const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = express();
const axios = require("axios");

// Kush - commented mongodb connection code. since we will be using filesystem.
//mean-course will be my database that will be created on the fly
//mongoose.connect("mongodb+srv://subhajit:tDaIPDU8Nfa8NWzS@cluster0-kkltl.mongodb.net/mean-course?retryWrites=true&w=majority")
//.then(()=>{console.log("connected to database");})
//.catch(()=>{console.log("connection failed")});

app.use('/images', express.static(path.join('backend/images')));

// load configuration file.
const conf = require('./config.json');

//map the base image absolute path to proxy resultimages directory.
app.use('/resultimages', express.static(path.join(conf.baseimgdir)));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

//app.use('/api/posts', postRouter);

//Kush: Dummy code to fetch query image path for testing get request to image server. This can be replaced with acutual query image path. 
let qimagepath;
fs.readdirSync( __dirname +'/query_image/' ).forEach( file => {

  const extname = path.extname( file );
  const filename = path.basename( file, extname );
  qimagepath = __dirname + '\\query_image\\' + file; 
});

// Kush - fire a get request to the Image(dummy) server with image path as request param on arrival of get request from the client.
// It is important to set 'qimagepath' variable before the sending the get the request.

// url to the image server. This param has to be configured in conf.json. 
const imagerserverurl = conf.protocol + "://" + conf.iserverhostip + ":" + conf.iserverportnumber //"http://localhost:5100";

app.get('/',(req, res, next)=>{
  axios.get(imagerserverurl,{ params: {
    queryimagepath: qimagepath
  }
}).then(response => {
      const data = response.data;
      obj = JSON.parse(JSON.stringify(data));
      // check if response data is correct.
      if (checkresponse(data)){
      readjsonobject(obj);
      // TODO: Writing the json object to a file.Keeping it for time being. If not required will remove the below line.
      fs.writeFileSync('received_response.json', JSON.stringify(obj,null,2));
      res.status(200).json(obj);
    }
    else{
      // setting error respone code to 412. (Precondition Failed)
      res.status(412).json(obj)
    }
      
    })
    .catch(error => {
      console.log(error);
    });
});

// validate json received from image server.
function checkresponse(data){
  return JSON.stringify(data).includes('topScores');
}

var httpurl = conf.protocol + "://" + conf.bserverhostip + ":" + conf.bserverportnumber  //http://localhost:3000";
function readjsonobject(obj){
  var dirPath;
  var imgpath;
  var imagename;
  for (var i = 0;i<obj.topScores.length;i++){
        imgpath = obj.topScores[i].name;
        newimgpath = imgpath.replace(conf.baseimgdir+'\\','');
        newimgpath = newimgpath.split('\\').join('\/');
        imagename = path.basename(imgpath);
        var newurl = httpurl + "/resultimages/" + newimgpath;
        console.log(newurl);
        obj.topScores[i].url = newurl;
        }
}



module.exports = app;


//mongo db
//subhajit
//tDaIPDU8Nfa8NWzS
