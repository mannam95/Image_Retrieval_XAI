import mxnet as mx
from mxnet import image
from mxnet.gluon.data.vision import transforms
import gluoncv
from gluoncv import model_zoo, data, utils
from matplotlib import pyplot as plt
from gluoncv.data.transforms.presets.segmentation import test_transform
from gluoncv.utils.viz import get_color_pallete
import matplotlib.image as mpimg
import numpy;
import ntpath
from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from PIL import Image
import numpy
import pandas as pd
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from flask import request, url_for, jsonify
from flask_api import FlaskAPI, status, exceptions
import gc
from PIL import Image
from sklearn import datasets, linear_model
from sklearn.metrics import mean_squared_error, r2_score
import json






app = FlaskAPI(__name__)


'''
@app.route('/segment', methods=['GET'])
def doProcessing():
    try:
        gc.collect()
        model_semantic_segment = gluoncv.model_zoo.get_model('fcn_resnet101_voc', pretrained=True)
        # using cpu
        fileName = request.args.get('fileName')
        workingDir = request.args.get('workingDir')
        fname = ntpath.basename(fileName)
        tempName = ntpath.join(workingDir, fname)
        print(fileName)
        ctx = mx.cpu(0)
        img = image.imread(fileName)
        #img = image.imread('D:\\dke\\2ND SEM\\IRTEX\\resource\\pascal data\\VOCtrainval_11-May-2012\\VOCdevkit\\VOC2012\\less image\\2007_000033.jpg')
        #plt.imshow(img.asnumpy())
        #plt.show()
        img = test_transform(img, ctx)
        output = model_semantic_segment.predict(img)
        predict = mx.nd.squeeze(mx.nd.argmax(output, 1)).asnumpy()

        images = {}

        for x in range(len(predict)):
          for y in range(len(predict[x])):
            if(predict[x][y]==0):
                continue;
            dat = images.get(predict[x][y], None)
            if(dat is None):
                dat = numpy.zeros(predict.shape)
            dat[x][y] = 1
            images[predict[x][y]] = dat
            
        #print(images.shape)
        i=0
        for key in images:
            dat = images.get(key, None)
            mask = get_color_pallete(dat, 'pascal_voc')
            name = tempName+str(i)+'.png'
            print(name)
            i=i+1;
            mask.save(name)
        
        #mask = get_color_pallete(predict, 'pascal_voc')
        #mask.save("output.png")
        del model_semantic_segment
        del img
        return {'status':'success'}, status.HTTP_200_OK
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR
'''



preprocess = transforms.Compose([transforms.ToTensor(),transforms.Normalize(mean=[0.485, 0.456, 0.406],std=[0.229, 0.224, 0.225])])




@app.route('/segment', methods=['GET'])
def doProcessing():
    try:
        #print(request)
        filename = request.args.get('fileName')
        workingDir = request.args.get('workingDir')
        fname = ntpath.basename(filename)
        tempName = ntpath.join(workingDir, fname)
        print(filename)

        model_segment = torch.hub.load('pytorch/vision:v0.6.0', 'fcn_resnet101', pretrained=True)
        model_segment.eval()
        input_image = Image.open(filename)
        input_tensor = preprocess(input_image)
        input_batch = input_tensor.unsqueeze(0)

        # move the input and model to GPU for speed if available
        if torch.cuda.is_available():
            input_batch = input_batch.to('cuda')
            model_segment.to('cuda')

        with torch.no_grad():
            output = model_segment(input_batch)['out'][0]
        output_predictions = output.argmax(0)
        predict = output_predictions.byte().cpu().numpy()
        #print(predict)

        '''palette = torch.tensor([2 ** 25 - 1, 2 ** 15 - 1, 2 ** 21 - 1])
        colors = torch.as_tensor([i for i in range(21)])[:, None] * palette
        colors = (colors % 255).numpy().astype("uint8")

        # plot the semantic segmentation predictions of 21 classes in each color
        r = Image.fromarray(predict).resize(input_image.size)
        r.putpalette(colors)
        r.save("hello.png")
        '''
        
        images = {}

        for x in range(len(predict)):
          for y in range(len(predict[x])):
            if(predict[x][y]==0):
                continue;
            dat = images.get(predict[x][y], None)
            if(dat is None):
                dat = numpy.zeros(predict.shape)
            dat[x][y] = 1
            images[predict[x][y]] = dat
            
        print("here")
            
        #print(images.shape)
        i=0
        for key in images:
            dat = images.get(key, None)
            mask = get_color_pallete(dat, 'pascal_voc')
            #mask = mask.convert('RGB')
            #mask.putpalette(colors)
            name = tempName+str(i)+'.png'
            print(name)
            i=i+1;
            mask.save(name)

        return {'status':'success'}, status.HTTP_200_OK
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR


        
        
############################################################################################        


transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )])

model = models.resnet18(pretrained=True)
layer = model._modules.get('avgpool')
model.eval()


net = model_zoo.get_model('yolo3_darknet53_voc', pretrained=True)

@app.route('/hlsf', methods=['GET'])
def get_vector():
    try:
        fileName = request.args.get('fileName')
        input_image = Image.open(fileName)
        image = input_image.convert("RGB")  # in case input image is not in RGB format
        img_t = transform(image)
        batch_t = torch.unsqueeze(img_t, 0)
        my_embedding = torch.zeros([1, 512, 1, 1])
        def copy_data(m, i, o):
            my_embedding.copy_(o.data)
        h = layer.register_forward_hook(copy_data)
        model(batch_t)
        h.remove()
        vec = my_embedding.squeeze().cpu().numpy().tolist()
        
        arr = []
        cls = net.classes
        x, img = data.transforms.presets.yolo.load_test(fileName, short=512)
        class_IDs, scores, bounding_boxes = net(x)
        class_IDs = class_IDs.asnumpy()
        for dat in class_IDs[0] :
            if dat[0] == -1 :
                break
            arr.append(cls[int(dat[0])])
        
        
        
        #data = {'file':fileName,'vector': str(vec)}
        return jsonify(feature=vec, classes=arr), status.HTTP_200_OK
        #flask.jsonify(data)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR


@app.route('/color', methods=['GET'])
def get_color():
    try:
        fileName = request.args.get('fileName')
        img = Image.open(fileName)
        color_img = img.convert("P",palette=Image.ADAPTIVE, colors=16)
        #color_img.show()
        color = color_img.getcolors()
        #print(color)

        cols = [ col[0] for col in color ]
        return jsonify(cols), status.HTTP_200_OK
        #flask.jsonify(data)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR
        

@app.route('/classification', methods=['POST'])
def get_classification():
    try:
        
        # Load the diabetes dataset
        
        
        X = request.form['xcomp']
        y = request.form['ycomp']
        
        X = json.loads(X)
        y = json.loads(y)
        
        #print(type(diabetes_X))
        #print(X)
        #print(y)
        
        X = numpy.array(X)
        y = numpy.array(y)
        
        #diabetes_X, diabetes_y = datasets.load_diabetes(return_X_y=True)

        #print(X.shape)
        #print(y.shape)


        # Create linear regression object
        regr = linear_model.LinearRegression()

        # Train the model using the training sets
        regr.fit(X, y)


        return jsonify(regr.coef_.tolist()), status.HTTP_200_OK
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR
        
        

    
if __name__ == '__main__':
    app.run(debug=True)