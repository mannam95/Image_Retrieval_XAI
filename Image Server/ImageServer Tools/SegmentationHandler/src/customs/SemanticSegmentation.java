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
import stringutils.StringUtils;

/**
 *
 * @author SUBHAJIT
 */
public class SemanticSegmentation implements Segmenter {

    String workingdir;
    String URL;

    public SemanticSegmentation(String URL, String workingdir) {
        this.URL = URL;
        if (this.URL.endsWith("/")) {
            this.URL = StringUtils.replaceLast(this.URL, "/", "");
        }
        this.workingdir = workingdir;
    }

    @Override
    public ArrayList<Mat> extract(String Filename) throws IRTEX_Exception {
        try {

            String filename = Filename;//"D:\\dke\\2ND SEM\\IRTEX\\R&D\\semantic segmentation\\2007_000027.jpg";
            Mat src = Imgcodecs.imread(filename);

            if (URL == null) {
                throw new IRTEX_Exception(IRTEX_Exception.URLException);
            }

            String strURL = URL + "/segment";

            HttpResponse<String> str = Unirest.get(strURL).queryString("fileName", Filename).queryString("workingDir", workingdir).asString();

            if (str == null || str.getStatus() == 500) {
                throw new IRTEX_Exception(IRTEX_Exception.segmentationException);
            }

            ArrayList<Mat> descriptors = new ArrayList<>();

            String fname = new File(filename).getName();
            String maskfile;
            if (!(workingdir.endsWith("/") || workingdir.endsWith("\\"))) {
                workingdir = workingdir + "\\";
            }
            int i = 0;
            while (true) {
                maskfile = workingdir + fname + i + ".png";
                i++;
                if (!(new File(maskfile).exists())) {
                    break;
                }
                //Mat mask = Imgcodecs.imread("D:\\dke\\2ND SEM\\IRTEX\\R&D\\semantic segmentation\\output.png");
                Mat mask = Imgcodecs.imread(maskfile);

                Imgproc.cvtColor(mask, mask, Imgproc.COLOR_BGR2GRAY);
                Imgproc.threshold(mask, mask, .1, 255, Imgproc.THRESH_BINARY | Imgproc.THRESH_OTSU);

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
            }
            return descriptors;
        } catch (Exception e) {
            throw new IRTEX_Exception(IRTEX_Exception.segmentationException, e.getMessage());
        }
    }
}
