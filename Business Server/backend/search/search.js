const express = require('express');

const searchRouter = express.Router();

const axios = require('axios');

const multer = require('multer');

const fs = require('fs');

const hostURL = "http://localhost:8983/solr/lire/lireq";


searchRouter.get('/lireq',(req, res, next)=>{
  axios.get(hostURL)
    .then(responseData => {
      console.log(responseData.data)
      res.status(200).json(responseData.data);
    })
    .catch(error => {
      console.log(error);
    });
});



const storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, 'backend/images')
  },
  filename:(req, file, cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, name+"-"+Date.now());
  }
});



searchRouter.post('/lireq', multer({ storage: storage }).single('url'), (req, res, next)=>{
  var filename;
  var imgaePath;
  var field;
  var rows;
  var ms;
  var accuracy;
  var candidates;

  console.log(req.file);
  console.log(req.body);

  if(req.file){
    filename =req.file.filename;
    const imgURL = req.protocol+"://"+req.get("host");
    imgaePath = imgURL+"/images/"+req.file.filename;
  }
  else{
    res.status(404).json({message:'image is mandatory for this query'});
  }

  if(req.body.field)
  {
    field = req.body.field;
  }
  else
  {
    field = "cl_ha";
  }

  if(req.body.rows)
  {
    rows = req.body.rows;
  }
  else
  {
    rows = 60;
  }

  if(req.body.ms)
  {
    ms = req.body.ms;
  }
  else
  {
    ms = false
  }

  if(req.body.accuracy)
  {
    accuracy = req.body.accuracy;
  }
  else
  {
    accuracy = .33
  }

  if(req.body.candidates)
  {
    candidates = req.body.candidates;
  }
  else
  {
    candidates=10000;
  }


  axios.get(hostURL, {
    params:
    {
      url:imgaePath,
      field:field,
      rows:rows,
      ms:ms,
      accuracy:accuracy,
      candidates:candidates
    }
  }).then(responseSearch=>{res.status(200).json(responseSearch.data);})
  .catch((err)=>{res.status(200).json({message:"data couldnt be added"});})
  .then(()=>{
    const pathToFile = "backend/images/"+req.file.filename;
    fs.unlink(pathToFile, (err) => {
      if (err) {
        console.error(err)

      }

      //file removed
    })
  });

});


module.exports =searchRouter;
