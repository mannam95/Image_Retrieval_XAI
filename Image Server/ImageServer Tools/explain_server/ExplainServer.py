import uuid
import math
import gc
import itertools
import json
import ntpath
from json import JSONEncoder
import os
from os import listdir
from os.path import isfile
import pickle
import cv2
import gluoncv
import matplotlib.image as mpimg
import mxnet as mx
import numpy
import pandas as pd
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from flask import jsonify, request, url_for
from flask_api import FlaskAPI, exceptions, status
from gluoncv import model_zoo, utils
from gluoncv.data.transforms.presets.segmentation import test_transform
from gluoncv.utils.viz import get_color_pallete
from matplotlib import pyplot as plt
from mxnet import image
from mxnet.gluon.data.vision import transforms
from PIL import Image, ImageDraw, ImageFilter
from scipy.spatial.distance import cdist
from skimage import (color, exposure, filters, img_as_float, io, morphology, transform)
from skimage.color import gray2rgb, rgb2gray
from skimage.measure import compare_ssim
from sklearn import datasets, linear_model
from sklearn.metrics import mean_squared_error, r2_score
import torchvision

app = FlaskAPI(__name__)

preprocess = torchvision.transforms.Compose([torchvision.transforms.ToTensor(),torchvision.transforms.Normalize(mean=[0.485, 0.456, 0.406],std=[0.229, 0.224, 0.225])])
model_segment = torch.hub.load('pytorch/vision:v0.6.0', 'fcn_resnet101', pretrained=True)

net = model_zoo.get_model('yolo3_darknet53_voc', pretrained=True)

def doSegmentProcessing(filename, confidence):
    vector = numpy.zeros(len(net.classes))
    img_looped = []
    images = {}
    arr = []
    added_scores = []
    boxes = []
    f = cv2.imread(filename)
    mn=min(f.shape[0], f.shape[1])
    mx=max(f.shape[0], f.shape[1])
    x, img = gluoncv.data.transforms.presets.yolo.load_test(filename, short=mn, max_size=mx)
    class_IDs, scores, bounding_boxes = net(x)
    class_IDs = class_IDs.asnumpy()
    scores = scores.asnumpy()
    bounding_boxes = bounding_boxes.asnumpy()
    
    fname = ntpath.basename(filename)
    print(filename)
    i = 0
    for i in range(len(class_IDs[0])):
        current = i
        if class_IDs[0][i][0] == -1 :
            break
        if scores[0][i][0] <= confidence:
            continue
        
        x,y,w,h = bounding_boxes[0][i]
        mmask = numpy.zeros(shape=f.shape, dtype="uint8")
        c=cv2.rectangle(mmask, (x, y), (x+w, y+h), (255, 255, 255), -1)
        
        masked_img = cv2.bitwise_and(f, c)
        name = fname+str(i)+".png"
        
        cv2.imwrite(name,masked_img)
        
        
        model_segment.eval()
        input_image = Image.open(name)
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
        elem = 0
        mx = -1
        unique, count = numpy.unique(predict, return_counts = True)
        for j in range(len(unique)):
            if unique[j]==0:
                continue
            n = count[j]
            if mx == -1 or mx<n:
                elem = unique[j]
                mx = n
        if mx == -1:
            continue

        num = class_IDs[0][current][0]
        vector[int(num)] += 1
        arr.append(net.classes[int(num)])
        added_scores.append(scores[0][current][0])
        boxes.append(bounding_boxes[0][i])

        for x in range(len(predict)):
          for y in range(len(predict[x])):
            if(predict[x][y]==0):
                continue
            if(predict[x][y]!=elem):
                continue
            dat = images.get(predict[x][y], None)
            if(dat is None):
                dat = numpy.zeros(predict.shape)
            dat[x][y] = 255
            images[predict[x][y]] = dat
        
        img_looped.append(images)
        images = {}
        
    final_list = []
    for x in img_looped:
        j = x.values()
        for y in j:
            final_list.append(y)
    return final_list, vector, arr, added_scores, boxes





def default_call(obj):
    if isinstance(obj, numpy.ndarray):
        return obj.tolist()
    if isinstance(obj, numpy.float32):
        return obj.tolist()
    return obj.__dict__
        
class data:
    def __init__(self, hist, l, ratio, labels, scores, name, box):
        self.hist = hist
        self.large_hist = l
        self.ratio = ratio
        self.labels = labels
        self.scores = scores
        self.name = name
        self.box = box
    def toJSON(self):
        return json.dumps(self, default=lambda o: default_call(o), sort_keys=True, indent=4)
        #return json.dumps(self, cls = NumpyArrayEncoder, sort_keys=True, indent=4)

def semantic_info(img, confidence):
    img_info = []
    masks, vector, arr, scores, boxes = doSegmentProcessing(img, confidence)
    for i in range(len(masks)):
        mask = ntpath.basename(img)+"_mask_"+str(i)+".png"
        io.imsave(mask, masks[i])
        typess = arr[i]
        score = scores[i]
        box = boxes[i]


        image = cv2.imread(img)
        print(mask)
        img_mask = cv2.imread(mask, cv2.IMREAD_UNCHANGED)
        hist = cv2.calcHist([image], [0, 1, 2], img_mask, [256,256,256], [0, 256, 0, 256, 0, 256])
        l = []
        '''for x in hist:
            for y in x:
                for z in y:
                    l.append(z)'''
        

        unique, count = numpy.unique(img_mask, return_counts = True)
        ratio = count[0]/(count[0]+count[1])
        
        d = data(hist, l, ratio, typess, score, mask, box)
                
        img_info.append(d)
    return img_info, vector
    



class entity:
    def __init__(self, query, base, color_distance, size_distance, cat, query_mask_name, base_mask_name, q_box, b_box):
        self.q_obj = query
        self.b_obj = base
        self.color_distance = color_distance
        self.size_distance = size_distance
        self.cat = cat
        self.query_mask_name = query_mask_name
        self.base_mask_name = base_mask_name
        self.q_box = q_box
        self.b_box = b_box
        
    def toJSON(self):
        return json.dumps(self, default=lambda o: default_call(o), sort_keys=True, indent=4)
        #return json.dumps(self, cls = NumpyArrayEncoder, sort_keys=True, indent=4)
        
        
class similarity_per_facet:
    def __init__(self, similarity_of_obj_type, sim_for_color, sim_for_shape):
        self.similarity_of_obj_type = similarity_of_obj_type
        self.sim_for_color = sim_for_color
        self.sim_for_shape = sim_for_shape
    
    def toJSON(self):
        return json.dumps(self, default=lambda o: default_call(o), sort_keys=True, indent=4)
        #return json.dumps(self, cls = NumpyArrayEncoder, sort_keys=True, indent=4)
        
class similarity_per_image:
    def __init__(self, similarity_for_obj, sim_per_facet, query_img, base_img, actual_name):
        self.similarity_for_obj = similarity_for_obj
        self.sim_per_facet = sim_per_facet
        self.query_img = query_img
        self.base_img = base_img
        self.base_name_original = actual_name
        
    def toJSON(self):
        return json.dumps(self, default=lambda o: default_call(o), sort_keys=True, indent=4)
        #return json.dumps(self, cls = NumpyArrayEncoder, sort_keys=True, indent=4)
        
class similarity:
    def __init__(self, similarity_arr):
        self.similarity_arr = similarity_arr
        
    def toJSON(self):
        return json.dumps(self, default=lambda o: default_call(o), sort_keys=True, indent=4)

class store:
    def __init__(self, info, vector, img):
        self.info = info
        self.vector = vector
        self.img = img

colors = ["Black", "White", "Red", "Lime", "Blue", "Yellow", "Cyan", "Magenta", "Silver", "Gray", "Maroon", "Olive", "Green", "Purple", "Teal", "Navy"]
c_codes = [(0,0,0), (255,255,255), (255,0,0), (0,255,0), (0,0,255), (255,255,0), (0,255,255), (255,0,255),  (192,192,192), (128,128,128), (128,0,0), (128,128,0), (0,128,0), (128,0,128), (0,128,128), (0,0,128)]

def compare(query, images, store_path, resp_img_save_path):
    color_encode_count = 0

    #information of query... to be generated at runtime
    query_info, query_vector = semantic_info(query, 0.70)
    query_im = cv2.imread(query)
    
    uniq= numpy.unique(query_vector)
    query_vector_norm = None
    if len(uniq) == 1 and uniq[0] == 0 :
        query_vector_norm = query_vector
    else:
        query_vector_norm = query_vector / numpy.linalg.norm(query_vector)
            
    
    similarity_per_image_list = []
    
    
    
    
    #overall similarity based on facets
    sim_for_color = 0
    sim_for_shape = 0
    sim_for_obj = 0
    
    for img in images:
        query_img = query_im.copy()
        color_encode_count = 0
        #similarity on per object type broken down
        overall_similarity = []
        
        #somehow get the image information here.. ideally from desearialised file.. generation at runtime is not recommended.. to be fixed
        #this in case if the data is not serialised\
        #image_info, img_vector = semantic_info(img, 0.70)
        #if data is serialised then get that and do the ops
        fname = ntpath.basename(img)
        n_path = os.path.join(store_path, fname+".pkl")
        bse = pickle.load(open(n_path, 'rb'))
        image_info = bse.info
        img_vector = bse.vector
        bse_img = bse.img
        uniq= numpy.unique(img_vector)
        img_vector_norm = None
        if len(uniq) == 1 and uniq[0] == 0 :
            img_vector_norm = img_vector
        else:
            img_vector_norm = img_vector / numpy.linalg.norm(img_vector)
        
        #distance between 2 object vectors
        x_val = 0
        y_val = 0
        sim_for_obj = 0
        for i in range(len(query_vector)):
            sim_for_obj += (query_vector_norm[i] * img_vector_norm[i])
            x_val += (query_vector_norm[i] * query_vector_norm[i])
            y_val += (img_vector_norm[i] * img_vector_norm[i])
        x_val = math.sqrt(x_val)
        y_val = math.sqrt(y_val)
        if x_val == 0 or y_val == 0:
            sim_for_obj = 0
        else:
            sim_for_obj = sim_for_obj /(x_val*y_val)
        
        #sim_for_obj = cdist(query_vector_norm.reshape(1, -1), img_vector_norm.reshape(1, -1), metric='cosine')
        
        #now get each object type from the array and compare color
        for i in range(len(query_vector)):
            sim_for_color = 0
            sim_for_shape = 0
            cat = net.classes[i]
            query_count = query_vector[i]
            base_count = img_vector[i]
            
            #if both doesnt have the object then nothing to do
            if query_count == 0 and base_count == 0:
                continue
                
            #if one has an object and the other doesnt have, then add the distance as 1 unit for each
            if query_count == 0 or base_count == 0:
                continue
            #if say there is 2 vs 3 match, then at most 2 will be compared, one will have zero similarity
            num_obj = min(query_count, base_count)
            distance_obj = []
            for q_info in query_info:
                if q_info.labels != cat:
                    continue
                for b_info in image_info:
                    if b_info.labels != cat:
                        continue
                    color_distance = cv2.compareHist(q_info.hist, b_info.hist, cv2.HISTCMP_BHATTACHARYYA)
                    size_distance = abs(q_info.ratio - b_info.ratio)
                    #distance_obj.append(entity(q_info, b_info, color_distance, size_distance, cat))
                    distance_obj.append(entity(query, img, color_distance, size_distance, cat, q_info.name, b_info.name, q_info.box, b_info.box))
            sorted_distance_list = sorted(distance_obj, key = lambda x: x.color_distance+x.size_distance, reverse=False)
            
            
            
            #top n list of color and shape added for an object type
            final_list = []
            for sdl in sorted_distance_list:
                if len(final_list) == num_obj:
                    break
                flag = True
                for x in final_list:
                    if sdl.query_mask_name == x.query_mask_name or sdl.base_mask_name == x.base_mask_name:
                        flag = False
                        break
                if flag==True:
                    final_list.append(sdl)
                    
            #final_list is the list of objects inside one image for one object type say aeroplane
                    
            for obj in final_list:
                obj.color_distance = 1-obj.color_distance
                sim_for_color += obj.color_distance
                obj.size_distance = 1-obj.size_distance
                sim_for_shape += obj.size_distance
                obj.color_name = colors[color_encode_count]
                obj.color_code = c_codes[color_encode_count]
                x,y,w,h = obj.q_box
                query_img =cv2.rectangle(query_img, (x, y), (x+w, y+h), c_codes[color_encode_count], 2)
                x,y,w,h = obj.b_box
                bse_img =cv2.rectangle(bse_img, (x, y), (x+w, y+h), c_codes[color_encode_count], 2)
                color_encode_count += 1

            
            sim_for_color = sim_for_color/query_count
            sim_for_shape = sim_for_shape/query_count
                
            overall_similarity.append(similarity_per_facet(final_list, sim_for_color, sim_for_shape))
            #so overall_similarity contains all object to object comparisons for an image
        
        
        
        milliseconds = uuid.uuid4().hex.upper()
        q_img_path = os.path.join(resp_img_save_path, str(milliseconds)+".png")
        milliseconds = uuid.uuid4().hex[:6].upper()
        b_img_path = os.path.join(resp_img_save_path, str(milliseconds)+".png")

        cv2.imwrite(q_img_path,query_img)
        cv2.imwrite(b_img_path,bse_img)

        similarity__ = similarity_per_image(sim_for_obj, overall_similarity, q_img_path, b_img_path, img)
        similarity_per_image_list.append(similarity__)

    return (similarity_per_image_list)

def extract(img, store_path):
    image_info, img_vector = semantic_info(img, 0.70)
    bse = store(image_info, img_vector, cv2.imread(img))
    fname = ntpath.basename(img)
    n_path = os.path.join(store_path, fname+".pkl")
    pickle.dump(bse, open(n_path, 'wb'), protocol=pickle.HIGHEST_PROTOCOL)


def extract_n_store(mypath, store_path):
    onlyfiles = [os.path.join(mypath, f) for f in listdir(mypath) if isfile(os.path.join(mypath, f))]
    print("total number of files "+str(len(onlyfiles)))
    cmp = 0
    for f_name in onlyfiles:
        extract(f_name, store_path)
        print("finished writing "+str(cmp+1)+"/"+str(len(onlyfiles)))
        cmp += 1



#extract_n_store("D:\\dke\\2ND SEM\\IRTEX\\R&D\\explainibility\\img", "D:\\dke\\2ND SEM\\IRTEX\\R&D\\explainibility\\extraction")


'''query = "../2.jpg"
img = "2007_000033.jpg"
img1 = "2007_000032.jpg"
store_path = "D:\\dke\\2ND SEM\\IRTEX\\R&D\\explainibility\\extraction"
res_img = "D:\\dke\\2ND SEM\\IRTEX\\R&D\\explainibility\\res_img"
d = compare(query, [img, img1], store_path, res_img)

s = similarity(d)

print(s.toJSON())'''


@app.route('/rerank', methods=['POST'])
def get_classification():
    try:
    
    
        w = request.form['filename']
        x = request.form['resp']
        y = request.form['str_pth']
        z = request.form['res_path']
        
        #X = json.loads(X)
        x = json.loads(x)
        
        #print(type(diabetes_X))
        #print(X)
        #print(y)
        
        #X = numpy.array(X)[0]
        x = list(numpy.array(x))
        
        #diabetes_X, diabetes_y = datasets.load_diabetes(return_X_y=True)

        print(w)
        print(x)
        print(type(x))
        print(y)
        print(z)

        d = compare(w, x, y, z)

        s = similarity(d)

        #print(s.toJSON())



        return s.toJSON(), status.HTTP_200_OK
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR
        
        





if __name__ == '__main__':
    app.run(debug=True, port =4000 )


