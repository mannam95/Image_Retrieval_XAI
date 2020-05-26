# Business Server.

## Getting Started

These instructions will get you to set up and running Business Server on your local machine for development and testing purposes.


### Prerequisites

* For an end to end call flow you need to configure UI and Image Server on your local machine.

### Installing

* Clone the repository or download and unzip it.    
* Make sure that all the files are present in folder and in the following similar structure.  

```
Business Server(Parent Folder)
    backend
            app.js
            config.js
            Images     
    server.js        
```

Install nodejs version 12.16.1 on your machine. You can find download and installation instruction here:
https://nodejs.org/en/download/

Go to directory using command prompt where your server.js file is present.
Run below command
npm install express multer body-parser path axios fs -g

Open config.js file present in Business Server/backend and edit below parameters accordingly


"bserverhostip" : IP of the business server. In this case localhost
"bserverportnumber" : port number of business server.
"protocol" : http 
"iserverhostip" : IP of image server.
"iserverportnumber" : port number of image server.
"baseimgdir" : path to the directory where base images are stored.


## Running the Business Server
Go to directory using command prompt where your server.js file is present.
Run below command
node server.js

The node server will be up and running on the port configured in "bserverportnumber" param.


