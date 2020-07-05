import cv2
# Load two images
img1 = cv2.imread('a1.jpg')
img2 = cv2.imread('tempName0.png')

img2grey =cv2.cvtColor(img2,cv2.COLOR_BGR2GRAY)
img1grey = cv2.cvtColor(img1,cv2.COLOR_BGR2GRAY)
# I want to put logo on top-left corner, So I create a ROI
#rows,cols,channels = img2.shape
#roi = img1[0:rows, 0:cols]
# Now create a mask of logo and create its inverse mask also
#img2gray = cv.cvtColor(img2,cv.COLOR_BGR2GRAY)
#ret, mask = cv.threshold(img2gray, 10, 255, cv.THRESH_BINARY)
#mask_inv = cv.bitwise_not(mask)
# Now black-out the area of logo in ROI
img1_bg = cv2.bitwise_and(img1grey,img2grey)
#greyimg = cv2.cvtColor(img1_bg,cv2.COLOR_BGR2GRAY)
# Take only region of logo from logo image.
#img2_fg = cv.bitwise_and(img2,img2,mask = mask)
# Put logo in ROI and modify the main image
#dst = cv.add(img1_bg,img2_fg)
#img1[0:rows, 0:cols ] = dst

cv2.imshow("image1grey",img1grey)
cv2.imshow("image2grey",img2grey)
cv2.imshow('res',img1_bg)
#cv2.imshow('greyimg',greyimg)
# cv2.RETR_LIST or cv2.RETR_CCOMP
_, threshold = cv2.threshold(img1_bg, 240, 255, cv2.THRESH_BINARY)
#contours, _ = cv2.findContours(threshold, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours, _ = cv2.findContours(threshold, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
print("No. of contours: ",len(contours))
cv2.waitKey(0)
cv2.destroyAllWindows()