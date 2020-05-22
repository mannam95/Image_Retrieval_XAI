/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cld_handler;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.imageio.ImageIO;
import models.Score;
import net.semanticmetadata.lire.imageanalysis.features.global.ColorLayout;

/**
 *
 * @author lenovo
 */
public class CompareColorFeature {

    private BufferedImage ivsrcimg;
    public ColorLayout ivsrccolorlayout;

    public CompareColorFeature(String img) throws IOException {
        ivsrccolorlayout = new ColorLayout();
        extractqueryimage(img);
    }

    public HashMap<String, Double> comparewithquery(String pfpath, HashMap<String, ColorLayout> lvshpmap) throws IOException {

        HashMap<String, Double> lvdistmap = new HashMap<>();
        extractqueryimage(pfpath);
        Double lvdistance;

        for (Map.Entry lvshapemap : lvshpmap.entrySet()) {
            //System.out.println(lvshapemap.getKey() + "----->" + lvshapemap.getValue());
            ColorLayout lvcldobj = new ColorLayout();
            //BaseImageColorFeature  lvbaseimgobj = new BaseImageColorFeature();
            lvcldobj = (ColorLayout) lvshapemap.getValue();//.getbaseshapelayout();
            //lvcldobj = lvbaseimgobj.getbasecolorlayout();

            // ColorLayout ivbasecolorlayout
            double temp = lvcldobj.getDistance(ivsrccolorlayout);
            lvdistance = temp;

            lvdistmap.put((String) lvshapemap.getKey(), lvdistance);

        }

        // Create a list from elements of HashMap 
        List<Map.Entry<String, Double>> list;
        list = new LinkedList<>(lvdistmap.entrySet());

        // Sort the list 
        Collections.sort(list, new Comparator<Map.Entry<String, Double>>() {
            public int compare(Map.Entry<String, Double> o1,
                    Map.Entry<String, Double> o2) {
                return (o1.getValue()).compareTo(o2.getValue());
            }
        });

        // put data from sorted list to hashmap  
        HashMap<String, Double> temp = new LinkedHashMap<String, Double>();
        for (Map.Entry<String, Double> aa : list) {
            temp.put(aa.getKey(), aa.getValue());
        }
        return temp;

        //x.floatValue();
        // return lvdistmap;
    }

    /**
     * Kush - OLD API. Keeping it for some time , later to be removed *
     */
    public double comparewithquery(String pfpath, byte[] pbasefeaturevector) throws IOException {

        //double distance = 0;
        extractqueryimage(pfpath);

        ColorLayout lvbaseimage = new ColorLayout();
        //lvbaseimage.setByteArrayRepresentation(pbasefeaturevector,0,pbasefeaturevector.length);
        lvbaseimage.setByteArrayRepresentation(pbasefeaturevector);

        //System.out.println("query image clr vector = " + Arrays.toString(ivsrccolorlayout.getByteArrayRepresentation()));

        //return ivsrccolorlayout.getDistance(lvbaseimage);
        return lvbaseimage.getDistance(ivsrccolorlayout);

        //return distance;
    }

    public void extractqueryimage(String pfpath) throws IOException {
        //System.out.println("source file path: " + pfpath);
        File lvsrcfile = new File(pfpath);
        //FileUtils.get
        //File lvsrcfile = FileUtils.getAllImageFiles(new File(pfilepath), true);
        ivsrcimg = ImageIO.read(lvsrcfile);
        ivsrccolorlayout.extract(ivsrcimg);
    }

    //subhajit: added the code to be inline with the Score and Scoring utilities
    public void compare(String compare_Img, Score imgscr)
    {

        ColorLayout entry = BaseImageColorFeature.ivcldhandlermap.get(compare_Img);


        imgscr.cldScore(compare_Img, (float) entry.getDistance(ivsrccolorlayout));
        
        imgscr.cldVector = entry.getFeatureVector();
    }

}
