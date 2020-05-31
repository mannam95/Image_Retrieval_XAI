import mxnet as mx
from mxnet import image
from mxnet.gluon.data.vision import transforms
import gluoncv
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




app = FlaskAPI(__name__)


model = gluoncv.model_zoo.get_model('fcn_resnet101_voc', pretrained=True)

@app.route('/segment', methods=['GET'])
def doProcessing():
    try:
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
        output = model.predict(img)
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
    
        return {'status':'success'}, status.HTTP_200_OK
    except:
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR
        
        
############################################################################################        

model = models.resnet18(pretrained=True)

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
        #data = {'file':fileName,'vector': str(vec)}
        return jsonify(feature=vec), status.HTTP_200_OK
        #flask.jsonify(data)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR

    
if __name__ == '__main__':
    app.run(debug=True)