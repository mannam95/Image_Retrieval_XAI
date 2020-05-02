/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model.local;

import INTEX_exceptions.IRTEX_Exception;
import model.LocalImageFeature;
import java.util.ArrayList;
import java.util.List;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.DMatch;
import org.opencv.core.Mat;
import org.opencv.core.MatOfDMatch;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.Size;
import org.opencv.features2d.DescriptorMatcher;
import org.opencv.features2d.ORB;
import org.opencv.highgui.HighGui;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.xfeatures2d.SURF;
import utils.*;

/**
 *
 * @author SUBHAJIT
 */
public class SegmentedFeatures extends LocalImageFeature{
    
    Mat Descriptor;
    
    public SegmentedFeatures()
    {
        this.name = "SEGMENTATION AND SURF";
    }
    
    

    @Override
    public boolean Extract(String fileName) {
        String filename = fileName;
        Mat srcOriginal = Imgcodecs.imread(filename);
        if (srcOriginal.empty()) {
            System.err.println("Cannot read image: " + filename);
            System.exit(0);
        }
        Mat src = srcOriginal.clone();
        
        //Imgproc.cvtColor(src, src, Imgproc.COLOR_BGR2HSV);
        
        Mat src_org = new Mat();
        
        srcOriginal.convertTo(src_org, CvType.CV_8UC3);
        byte[] src_orgData = new byte[(int) (src_org.total() * src_org.channels())];
        src_org.get(0,0,src_orgData);
        
        
        // Create a kernel that we will use to sharpen our image
        Mat kernel = new Mat(3, 3, CvType.CV_32F);
        // an approximation of second derivative, a quite strong kernel
        float[] kernelData = new float[(int) (kernel.total() * kernel.channels())];
        kernelData[0] = 1; kernelData[1] = 1; kernelData[2] = 1;
        kernelData[3] = 1; kernelData[4] = -8; kernelData[5] = 1;
        kernelData[6] = 1; kernelData[7] = 1; kernelData[8] = 1;
        kernel.put(0, 0, kernelData);
        // do the laplacian filtering as it is
        // well, we need to convert everything in something more deeper then CV_8U
        // because the kernel has some negative values,
        // and we can expect in general to have a Laplacian image with negative values
        // BUT a 8bits unsigned int (the one we are working with) can contain values
        // from 0 to 255
        // so the possible negative number will be truncated
        Mat imgLaplacian = new Mat();
        Imgproc.filter2D(src, imgLaplacian, CvType.CV_32F, kernel);
        Mat sharp = new Mat();
        src.convertTo(sharp, CvType.CV_32F);
        Mat imgResult = new Mat();
        Core.subtract(sharp, imgLaplacian, imgResult);
        // convert back to 8bits gray scale
        imgResult.convertTo(imgResult, CvType.CV_8UC3);
        imgLaplacian.convertTo(imgLaplacian, CvType.CV_8UC3);
        //HighGui.imshow("New Sharped Image", imgResult);
        // Create binary image from source image
        Mat bw = new Mat();
        Imgproc.cvtColor(imgResult, bw, Imgproc.COLOR_BGR2GRAY);
        Imgproc.threshold(bw, bw, 40, 255, Imgproc.THRESH_BINARY | Imgproc.THRESH_OTSU);
        //HighGui.imshow("Binary Image", bw);
        // Perform the distance transform algorithm
        Mat dist = new Mat();
        Imgproc.distanceTransform(bw, dist, Imgproc.DIST_L2, 3);
        // Normalize the distance image for range = {0.0, 1.0}
        // so we can visualize and threshold it
        Core.normalize(dist, dist, 0.0, 1.0, Core.NORM_MINMAX);
        Mat distDisplayScaled = new Mat();
        Core.multiply(dist, new Scalar(255), distDisplayScaled);
        Mat distDisplay = new Mat();
        distDisplayScaled.convertTo(distDisplay, CvType.CV_8U);
        //HighGui.imshow("Distance Transform Image", distDisplay);
        // Threshold to obtain the peaks
        // This will be the markers for the foreground objects
        Imgproc.threshold(dist, dist, 0.4, 1.0, Imgproc.THRESH_BINARY);
        // Dilate a bit the dist image
        Mat kernel1 = Mat.ones(3, 3, CvType.CV_8U);
        Imgproc.dilate(dist, dist, kernel1);
        Mat distDisplay2 = new Mat();
        dist.convertTo(distDisplay2, CvType.CV_8U);
        Core.multiply(distDisplay2, new Scalar(255), distDisplay2);
        //HighGui.imshow("Peaks", distDisplay2);
        // Create the CV_8U version of the distance image
        // It is needed for findContours()
        Mat dist_8u = new Mat();
        dist.convertTo(dist_8u, CvType.CV_8U);
        // Find total markers
        List<MatOfPoint> contours = new ArrayList<>();
        Mat hierarchy = new Mat();
        Imgproc.findContours(dist_8u, contours, hierarchy, Imgproc.RETR_EXTERNAL, Imgproc.CHAIN_APPROX_SIMPLE);
        // Create the marker image for the watershed algorithm
        Mat markers = Mat.zeros(dist.size(), CvType.CV_32S);
        // Draw the foreground markers
        for (int i = 0; i < contours.size(); i++) {
            Imgproc.drawContours(markers, contours, i, new Scalar(i + 1), -1);
        }
        // Draw the background marker
        Mat markersScaled = new Mat();
        markers.convertTo(markersScaled, CvType.CV_32F);
        Core.normalize(markersScaled, markersScaled, 0.0, 255.0, Core.NORM_MINMAX);
        Imgproc.circle(markersScaled, new Point(5, 5), 3, new Scalar(255, 255, 255), -1);
        Mat markersDisplay = new Mat();
        markersScaled.convertTo(markersDisplay, CvType.CV_8U);
        //HighGui.imshow("Markers", markersDisplay);
        Imgproc.circle(markers, new Point(5, 5), 3, new Scalar(255, 255, 255), -1);
        // Perform the watershed algorithm
        Imgproc.watershed(imgResult, markers);
        Mat mark = Mat.zeros(markers.size(), CvType.CV_8U);
        markers.convertTo(mark, CvType.CV_8UC1);
        Core.bitwise_not(mark, mark);
        
        byte[][] masks = new byte[contours.size()][(int)src_org.total()];
        
        
        
        int[] markersData = new int[(int) (markers.total() * markers.channels())];
        markers.get(0, 0, markersData);
        for (int i = 0; i < markers.rows(); i++) {
            for (int j = 0; j < markers.cols(); j++) {
                int index = markersData[i * markers.cols() + j];
                if (index > 0 && index <= contours.size()) 
                {
                    
                    masks[index-1][(i * src_org.cols() + j)] = (byte) 255;
                }
            }
        }
        
        
        ArrayList<Mat> descriptors = new ArrayList<>(); 
        
        double hessianThreshold = 400;
        int nOctaves = 4, nOctaveLayers = 3;
        boolean extended = false, upright = false;
        SURF detector = SURF.create(hessianThreshold, nOctaves, nOctaveLayers, extended, upright);
        
        Mat mask = new Mat(src_org.size(), CvType.CV_8U);
        
        for(int i=0; i< masks.length; i++)
        {
            MatOfKeyPoint keypoints1 = new MatOfKeyPoint();
            Mat descriptor = new Mat();
            
            mask.put(0, 0, masks[i]);
            
            detector.detectAndCompute(src_org, mask, keypoints1, descriptor);
            if(descriptor.total() > 0)
                descriptors.add(descriptor);
            
        }
 






//        Mat img = Imgcodecs.imread(fileName), greyscale = new Mat(), blur= new Mat(), gaussian_binary_otsu = new Mat(), reverse_mask = new Mat();
//        // Otsu's thresholding after Gaussian filtering
//        
//        Imgproc.cvtColor(img, greyscale, Imgproc.COLOR_BGR2GRAY);
//        
//        Imgproc.GaussianBlur(greyscale, blur, new Size(5,5),0);
//        double ret = Imgproc.threshold(blur, gaussian_binary_otsu, 0,255,Imgproc.THRESH_BINARY+Imgproc.THRESH_OTSU);
//        
//        Core.bitwise_not(gaussian_binary_otsu, reverse_mask);
//        
//        
//        byte[][] masks = new byte[2][(int)img.total()];
//        
//        gaussian_binary_otsu.get(0,0, masks[0]);
//        reverse_mask.get(0,0, masks[1]);
//        HighGui.imshow("gaussian_binary_otsu", gaussian_binary_otsu);
//        HighGui.imshow("reverse_mask", reverse_mask);
//        HighGui.waitKey();
//        
//        ArrayList<Mat> descriptors = new ArrayList<>(); 
//        
//        double hessianThreshold = 400;
//        int nOctaves = 4, nOctaveLayers = 3;
//        boolean extended = false, upright = false;    
//        SURF detector = SURF.create(hessianThreshold, nOctaves, nOctaveLayers, extended, upright);
//        MatOfKeyPoint keypoints1 = new MatOfKeyPoint();
//        Mat mask = new Mat(img.size(), CvType.CV_8U);
//        
//        for(int i=0; i< masks.length; i++)
//        {
//            Mat descriptor = new Mat();
//            
//            mask.put(0, 0, masks[i]);
//            
//            detector.detectAndCompute(img, mask, keypoints1, descriptor);
//            if(descriptor.total() > 0)
//                descriptors.add(descriptor);
//            
//        }
        


//        ArrayList<Mat> descriptors = new ArrayList<>(); 
//        
//        
//        ORB detector = ORB.create(20);
//        
//        Mat mask = new Mat(img.size(), CvType.CV_8U);
//        
//        for(int i=0; i< masks.length; i++)
//        {
//            Mat descriptor = new Mat();
//            MatOfKeyPoint keypoints1 = new MatOfKeyPoint();
//            mask.put(0, 0, masks[i]);
//            
//            detector.detectAndCompute(img, new Mat(), keypoints1, descriptor);
//            if(descriptor.total() > 0)
//                descriptors.add(descriptor);
//            
//        }

        
        
        this.feature = descriptors;
        return true;
    }

    @Override
    public Float[] calculateSimilarity(LocalImageFeature baseImage) throws IRTEX_Exception {
        
        if(!(baseImage instanceof SegmentedFeatures))
            throw new IRTEX_Exception(IRTEX_Exception.notInstanceOfSameTypeCode);
        
        ArrayList<Mat> descriptors1 = (ArrayList<Mat>)this.feature;
        ArrayList<Mat> descriptors2 = (ArrayList<Mat>)((SegmentedFeatures)baseImage).feature;
        
        ArrayList<Float> scoreAccumulator = new ArrayList<>();
        
        
        for(int i=0;i<descriptors1.size(); i++)
        {
            for(int j=0; j<descriptors2.size(); j++)
            {
                DescriptorMatcher matcher = DescriptorMatcher.create(DescriptorMatcher.BRUTEFORCE);
                MatOfDMatch matches = new MatOfDMatch();
                matcher.match(descriptors1.get(i), descriptors2.get(j), matches);
                if(matches.rows() == 0)
                {
                    scoreAccumulator.add(0f);
                    continue;
                }
                float sum = 0;
                for(int k=0; k<matches.rows(); k++)
                {
                    DMatch[] dm = matches.toArray();
                    //System.out.println(dm[0].distance);
                    sum += 1- 0.5 * dm[0].distance;
                }
                scoreAccumulator.add(sum/matches.rows());
            }
        }
        
        
        return scoreAccumulator.size()>0?scoreAccumulator.toArray(new Float[scoreAccumulator.size()]):null;
    }

    @Override
    public ArrayList<Float[][]> getFeatureVectors() {
        
        ArrayList<Mat> descriptors  = (ArrayList<Mat>)this.feature;
        
        ArrayList<Float[][]> featureVectors = new ArrayList<>();
        
        for(int i=0; i< descriptors.size(); i++)
        {
            Mat descriptor = descriptors.get(i);
            Float[] desc = new Float[(int)descriptor.total()];
            featureVectors.add(new utils<Float>().convertOneDim2TwoDim(float.class, desc, descriptor.rows(), descriptor.cols()));
            
        }
        
        return featureVectors;
    }

    @Override
    public boolean buildFeatureFromVector(ArrayList<Float[][]> vectors) {
        try
        {
            ArrayList<Mat> descriptors = new ArrayList<>(); 
            for(int i=0; i<vectors.size(); i++)
            {
                Float[][] rawVector = vectors.get(i);
                Float[] feature = new utils<Float>().convertTwoDim2OneDim(float.class, rawVector, rawVector.length, rawVector[0].length);
                float[] pFeature = new float[feature.length];
                for(int j=0;j<pFeature.length;j++)pFeature[j]=feature[j];
                Mat descriptor = new Mat(new Size(rawVector.length, rawVector[0].length), CvType.CV_32FC1);
                descriptor.put(0,0,pFeature);
                descriptors.add(descriptor);
            }
            return true;
        }
        catch(Exception e)
        {
            return false;
        }
    }
    
}
