from flask import request, url_for, jsonify
from flask_api import FlaskAPI, status, exceptions
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
import tensorflow.keras as keras
from tensorflow.keras import models
from tensorflow.keras import layers
from tensorflow.keras import optimizers
import tensorflow as tf
from keras.utils import np_utils
from keras.models import load_model
from keras.datasets import cifar10
from keras.preprocessing import image
import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import cv2





app = FlaskAPI(__name__)



model_cifar = tf.keras.models.load_model('my_model.h5')
model_cifar.pop()
model_cifar.pop()
model_cifar.pop()
model_cifar.compile(optimizer=optimizers.RMSprop(lr=2e-5), loss='binary_crossentropy', metrics=['acc'])
@app.route('/cifar/hlsf', methods=['GET'])
def get_vector_cifar():
    try:
        img_path = request.args.get('fileName')
        #img_path = 'D:/dke/2ND SEM/IRTEX/resource/cifar data/images/airplane/airplane_batch_1_31.jpg'
        img = image.load_img(img_path, target_size=(32, 32))
        img_data = image.img_to_array(img)
        img_data = np.expand_dims(img_data, axis=0)
        img_data = preprocess_input(img_data)

        resnet50_feature = model_cifar.predict(img_data)
        #print(resnet50_feature)
        
        return jsonify(feature=resnet50_feature.tolist()[0]), status.HTTP_200_OK
        #flask.jsonify(data)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR

    
if __name__ == '__main__':
    app.run(debug=True, port = 8000)