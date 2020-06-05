/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cld_handler;

import IRTEX_Exception.IRTEX_Exception;
import com.google.gson.reflect.TypeToken;
import fileUtils.FileUtils;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import models.Score;
import net.semanticmetadata.lire.imageanalysis.features.global.ColorLayout;
import stringutils.StringUtils;

/**
 *
 * @author lenovo
 */
public class CompareColorFeature {

    private BufferedImage ivsrcimg;
    public ColorLayout ivsrccolorlayout;
    public float[] semanticInformation;

    public CompareColorFeature(String img, String Url) throws IRTEX_Exception {
        ivsrccolorlayout = new ColorLayout();
        extractqueryimage(img);
        getColorSemanticInformation(img, Url);
    }

    public void extractqueryimage(String pfpath) throws IRTEX_Exception {
        try {
            //System.out.println("source file path: " + pfpath);
            File lvsrcfile = new File(pfpath);
            ivsrcimg = ImageIO.read(lvsrcfile);
            ivsrccolorlayout.extract(ivsrcimg);
        } catch (IOException ex) {
            throw new IRTEX_Exception(IRTEX_Exception.IOException, ex.getMessage());
        }
    }

    public float[] getColorSemanticInformation(String pfilepath, String URL) throws IRTEX_Exception {
        float[] info;

        if (URL.endsWith("/")) {
            URL = StringUtils.replaceLast(URL, "/", "");
        }
        if (URL == null) {
            throw new IRTEX_Exception(IRTEX_Exception.URLException);
        }
        String strURL = URL + "/color";

        HttpResponse<String> str = Unirest.get(strURL).queryString("fileName", pfilepath).asString();

        if (str == null || str.getStatus() == 500) {
            throw new IRTEX_Exception(IRTEX_Exception.ColorSemanticInformationExtractionException);
        }

        Type t = new TypeToken<float[]>() {
        }.getType();

        info = (float[]) FileUtils.loadGsonStringData(t, str.getBody());
        this.semanticInformation = info;
        return this.semanticInformation;
    }

    //subhajit: added the code to be inline with the Score and Scoring utilities
    public void compare(String compare_Img, Score imgscr) {

        BaseImageColorFeature feature = BaseImageColorFeature.ivcldhandlermap.get(compare_Img);
        ColorLayout entry = feature.getbasecolorlayout();

        imgscr.cldScore(compare_Img, (float) entry.getDistance(ivsrccolorlayout));

        imgscr.scolScore = intersection(feature.semanticInformation, semanticInformation);

        imgscr.cldVector = entry.getFeatureVector();
        imgscr.colorSemanticData = feature.semanticInformation;
    }

    static float intersection(float[] a, float[] b) {
        float sum = 0;
        for(int index  = 0;index< a.length; index++) {
            sum += Math.min(a[index], b[index]);
        }
        sum = sum / Math.max(sum(a), sum(b));
        return sum;
    }

    static float sum(float[]arr) {
        float sum = 0; // initialize sum 
        int i;

        // Iterate through all elements and add them to sum 
        for (i = 0; i < arr.length; i++) {
            sum += arr[i];
        }

        return sum;
    }
}
