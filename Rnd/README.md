# Highlevel Feature Extraction

highlevel.ipynb is a jupyter notebook which implements Resnet18 to extract feature vectors from jpg or png images. The features are taken from the avgpool layer of the Resnet18 network.

The first snippet of the code contains the preprocessing logic and implementation of a pretrained Resnet18 network 

The second snippet the code is able to create a tsv file of feature vectors of all images given the folder location. For the code to work, just change the variable 'im_path' to the preferred folder location.

The fourth snippet of the code generates cosine similarity between the query image and all the images in the folder. For the code to work, give the location of the query image to the 'pic_one' variable. Change the 'directory' variable to the location of the folder of images to be compared with the query image.
