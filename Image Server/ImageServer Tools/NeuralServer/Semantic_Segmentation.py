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
    
if __name__ == '__main__':
    app.run(debug=True)