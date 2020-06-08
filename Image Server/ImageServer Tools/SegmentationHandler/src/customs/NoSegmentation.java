/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package customs;

import IRTEX_Exception.IRTEX_Exception;
import java.io.File;
import java.util.ArrayList;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import model.Segmenter;
import org.opencv.core.Mat;
import org.opencv.core.MatOfKeyPoint;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.xfeatures2d.SURF;

/**
 *
 * @author SUBHAJIT
 */
public class NoSegmentation implements Segmenter {

    @Override
    public ArrayList<Mat> extract(String Filename) throws IRTEX_Exception {
        try {

            String filename = Filename;//"D:\\dke\\2ND SEM\\IRTEX\\R&D\\semantic segmentation\\2007_000027.jpg";
            Mat src = Imgcodecs.imread(filename);

            ArrayList<Mat> descriptors = new ArrayList<>();

            Mat mask = new Mat();

            double hessianThreshold = 400;
            int nOctaves = 4, nOctaveLayers = 3;
            boolean extended = false, upright = false;
            SURF detector = SURF.create(hessianThreshold, nOctaves, nOctaveLayers, extended, upright);

            MatOfKeyPoint keypoints = new MatOfKeyPoint();
            Mat descriptor = new Mat();

            //HighGui.imshow("data" + (i++), mask);
            //HighGui.waitKey();
            detector.detectAndCompute(src, mask, keypoints, descriptor);
            if (descriptor.total() > 0) {
                descriptors.add(descriptor);
            }
            return descriptors;
        } catch (Exception e) {
            throw new IRTEX_Exception(IRTEX_Exception.segmentationException, e.getMessage());
        }
    }

}
