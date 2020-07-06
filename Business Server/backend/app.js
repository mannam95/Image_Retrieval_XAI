const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const axios = require("axios");
const multer = require('multer');
const fs = require('fs');
var os = require("os");
var validUrl = require('valid-url');

// load configuration file.
const conf = require('./config.json');
const https = require('https')
//added by srinath
const xlsxFile = require('xlsx');

//map the base image absolute path to proxy resultimages directory.
//app.use('/resultimages', express.static(path.join(conf.baseimgdir)));
//app.use('/resultimages',express.static('E:\\SummerSem\\Project_XAI\\temporary data\\less image'));
app.use('/resultimages',express.static(conf.staticimgpath));
app.use('/explainimages',express.static(conf.explainabilityofimg))
app.use('/slideimages',express.static(conf.SlideImages))

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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

const sessiondatapath = "sessiondata"

function readjsonobject(obj){
  var dirPath;
  var imgpath;
  var imagename;
  for (var i = 0;i<obj.Data.topScores.length;i++){
        imgpath = obj.Data.topScores[i].name;
        //newimgpath = imgpath.replace(conf.baseimgdir+'\\','');
        //newimgpath = newimgpath.split('\\').join('\/');
        //console.log("Newimgpath: ",newimgpath)
        imagename = path.basename(imgpath);
        //console.log("imagename: ",imagename)
        var newurl = httpurl + "/resultimages/" + imagename; //newimgpath;
        //console.log("Newurl: ",newurl)
        obj.Data.topScores[i].name = newurl;
        }

   for(var i = 0;i<obj.SemanticData.similarity_arr.length;i++){
        base_img = obj.SemanticData.similarity_arr[i].base_img
        query_img = obj.SemanticData.similarity_arr[i].query_img

        baseimgpath = path.basename(base_img)
        queryimgpath = path.basename(query_img)

        baseurl = httpurl + "/explainimages/" + baseimgpath;
        queryurl = httpurl + "/explainimages/" + queryimgpath;

        obj.SemanticData.similarity_arr[i].base_img = baseurl
        obj.SemanticData.similarity_arr[i].query_img = queryurl
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



async function downloadimage(url,path){

  var localpath = fs.createWriteStream(path)

  var request = await https.get(url,function(response){
    
    response.pipe(localpath)
    console.log("--------- Downloadimage function download ---------")
  })
}
/* ============================================================
  Function: Download Image
============================================================ */

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
        
          console.log("download image")
      }),
  );


function sendgetrequest(imagePath,req,res){
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

//}
// Kush - fire a GET request to the Image server with image path as request param on arrival of POST request from the client.
// It is important to set 'filename' variable before the sending the get the request.

app.post('/lireq', multer({ storage: storage }).single('urld'), (req, res, next)=>{

   // Kush: save the session id and session data from the incoming request if it is present. 
   console.log("session data: ",req.body.sessiondata)
   if(req.body.sessiondata !== undefined && req.body.sessiondata !== null && req.body.sessiondata !== "")
   {
    let sessiondata = req.body.sessiondata
    //console.log("session data: ",sessiondata)
    const jsonobj = JSON.parse(req.body.sessiondata);
    let sessionid = jsonobj.sessionID.split('@')
    //console.log("sessionid: ",sessionid)
    sessionid = sessionid[0].replace('\"','')
    //console.log("replace sessionid: ",sessionid)
    const file = './' + sessiondatapath + '/' + sessionid
    //console.log(sessiondata)
    //console.log(file)
    fs.appendFile(file, sessiondata + os.EOL, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
   }

   var imgurl = req.body.imgurl
   //console.log("--------->",imgurl)
   var imagePath 

  if(req.file){
    console.log("file exists")
    filename =req.file.filename;
    imagePath = __dirname + '\\images\\' +req.file.filename;
    console.log("Sending get request..")
    sendgetrequest(imagePath,req,res)
  }
  else if (imgurl.trim()) //isEmpty(imgurl)
  {
    console.log("==== imgurl === present")
    if (validUrl.isUri(imgurl)) {
      timestamp = Date.now()
      lvpath = __dirname + '\\images\\' + 'imgdwnload' +  "-" + Date.now() +'.jpg'  ;
      (async () => {
          let example_image_1 = await download_image(imgurl, lvpath)
            console.log("calling get request.")
            sendgetrequest(lvpath,req,res)
      })();
     } 
    else { 
      res.status(404).json({message:'Not valid URL to download the query image'}); 
    }
  }

  else{
    res.status(404).json({message:'image or image URL is mandatory for this query'});
  }      

});

// Create Session ID and send it back to the client.
app.get('/sessionid', function (req, res) {
  var timestamp = Date.now('milli')
  var ip = req.ip
  ip = ip.replace(/:/g,'')
  ip = ip.replace(/\./g,'')
  var sessionid = timestamp + '@' + ip
  res.send(sessionid)
  
})


//code added by Srinath
//reads the deafult class images and sends it to the client
app.get('/defaultImages', function (req, res) {

  var workbook = xlsxFile.readFile(conf.slideConfigDatapath);
  var xlData = xlsxFile.utils.sheet_to_json(workbook.Sheets.Sheet1, { header: 1 });

  //transpose the excel data
  xlData = xlData[0].map((_, colIndex) => xlData.map(row => row[colIndex]));

  var imagesJsonData = [];

  //loop and generate the Json Data
  for (var i = 0; i < xlData.length; i++) {

    imageUrls = (xlData[i].slice(1)).filter(function (e) { return (e != undefined && e != '' && e != null) })
    newUrls = []
    classname = xlData[i][0]

    for (var idx = 0 ; idx< imageUrls.length; idx++ ){
      baseurl = imageUrls[idx]
      imagename =  path.basename(String(baseurl));
      baseurl = httpurl + "/slideimages/" + classname + '/' +imagename
      newUrls[idx] = baseurl
    }
    
    imagesJsonData[i] = {
      className: classname,
      imageUrls: newUrls
    }
  }

  res.send(JSON.stringify(imagesJsonData));

});

module.exports = app;

//mongo db
//subhajit
//tDaIPDU8Nfa8NWzS
