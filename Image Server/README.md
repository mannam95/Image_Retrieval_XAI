# IRTEX Image Server

## Getting Started

The Proejects are built using Netbeans and Visual Studio 2015(for native compoents and opencv).The config folder has the configuration for the Image Server. Dependencies contains the prebuilt binaries.
To get started, use the ImageServer.war file to be hosted on tomcat 8(tested with same). Configure the web.xml before deploying.


### Prerequisites

* Java 1.8 or above
* Tomcat * or above or similar serlvet container
* Microsoft c++ redistributable 2015
* opencv with contrib and non free modules 64 bit with java binding
* GSON
* Simple Json
* Lire library
* Native Handler(custom implementation code in Imageserver tools)

All the libraries are required to be added to PATH

### Installing

* Build the BackgroundForegroundExtractor jar and create the a file, which is then to be fed to bovwExtractor jar, which creates 2 dictionary files, one is the centers file(the lower sized file), and the disctionary file. Update the config accordingly
* DO same for cld and ehd extractor, and they will generate only the dictionary files. Update them too in config.

use the generated files to deploy the imageserver in a standard servlet setting


## Authors

* **Subhajit Mondal** - *Backend Developer*

### Contributors
* **Kushagra Kumar** - *Contributed in Color and Shape Extraction*

