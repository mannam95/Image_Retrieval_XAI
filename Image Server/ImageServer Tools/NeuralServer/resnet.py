from PIL import Image
import numpy
import pandas as pd
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from flask import request, url_for, jsonify
from flask_api import FlaskAPI, status, exceptions

app = FlaskAPI(__name__)

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

@app.route('/resnet', methods=['GET'])
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
        return jsonify(feature=str(vec)), status.HTTP_200_OK
        #flask.jsonify(data)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return {'status':'failure'}, status.HTTP_500_INTERNAL_SERVER_ERROR

if __name__ == '__main__':
    app.run(debug=True)