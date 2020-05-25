const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const axios = require("axios");
const multer = require('multer');
const fs = require('fs');

// load configuration file.
const conf = require('./config.json');

//map the base image absolute path to proxy resultimages directory.
//app.use('/resultimages', express.static(path.join(conf.baseimgdir)));
app.use('/resultimages',express.static('E:\\SummerSem\\Project_XAI\\temporary data\\less image'));

app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

// url to the image server. This param has to be configured in conf.json. 
const imagerserverurl = conf.protocol + "://" + conf.iserverhostip + ":" + conf.iserverportnumber + '/'+'ImageServer/qbe' // 'http://localhost:8080/ImageServer/qbe'
//console.log("imagerserverurl: "+imagerserverurl);
// validate json received from image server.
function checkresponse(data){
  return JSON.stringify(data).includes('topScores');
}

var httpurl = conf.protocol + "://" + conf.bserverhostip + ":" + conf.bserverportnumber 

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
        obj.topScores[i].name = newurl;
        }
}


const storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, 'backend/images')
  },
  filename:(req, file, cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, name+"-"+Date.now());
  }
});

// Kush - fire a GET request to the Image server with image path as request param on arrival of POST request from the client.
// It is important to set 'filename' variable before the sending the get the request.

app.post('/lireq', multer({ storage: storage }).single('urld'), (req, res, next)=>{
  if(req.file){
    filename =req.file.filename;
    imagePath = __dirname + '\\images\\' +req.file.filename;
    
    axios.get(imagerserverurl,{ params: {
      file: imagePath
    }
    }).then(response => {
        const data = response.data;
        obj = JSON.parse(JSON.stringify(data));
        // check if response data is correct.
        if (checkresponse(data)){
        readjsonobject(obj);
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
  }

  else{

    res.status(404).json({message:'image is mandatory for this query'});
  }  

});

module.exports = app;

//mongo db
//subhajit
//tDaIPDU8Nfa8NWzS
