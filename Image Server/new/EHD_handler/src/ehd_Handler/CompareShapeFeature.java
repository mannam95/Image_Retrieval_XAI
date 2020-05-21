/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//package net.applicationstart.lire.codeentry;
package ehd_Handler;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import models.Score;
import net.semanticmetadata.lire.imageanalysis.features.global.ColorLayout;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Iterator;
import net.semanticmetadata.lire.imageanalysis.features.global.EdgeHistogram;

/**
 *
 * @author lenovo
 */
public class CompareShapeFeature {

    private BufferedImage ivsrcimage;
    private EdgeHistogram ivsrcshapelayout;

    public CompareShapeFeature() {

        ivsrcshapelayout = new EdgeHistogram();

    }

    public void extractqueryimage(String pfpath) throws IOException {
        System.out.println("source file path: " + pfpath);
        File lvsrcfile = new File(pfpath);
        //FileUtils.get
        //File lvsrcfile = FileUtils.getAllImageFiles(new File(pfilepath), true);
        ivsrcimage = ImageIO.read(lvsrcfile);
        ivsrcshapelayout.extract(ivsrcimage);
    }

    public HashMap<String, Double> comparewithquery(String pfpath, HashMap<String, EdgeHistogram> lvshpmap) throws IOException {

        HashMap<String, Double> lvdistmap = new HashMap<>();
        extractqueryimage(pfpath);
        Double lvdistance;

        for (Map.Entry lvshapemap : lvshpmap.entrySet()) {
            System.out.println(lvshapemap.getKey() + "----->" + lvshapemap.getValue());
            EdgeHistogram lvehdobj = new EdgeHistogram();
            //BaseImageShapeFeature  lvbaseimgobj = new BaseImageShapeFeature();
            lvehdobj = (EdgeHistogram) lvshapemap.getValue();//.getbaseshapelayout();
            //lvehdobj = lvbaseimgobj.getbaseshapelayout();

            double temp = lvehdobj.getDistance(ivsrcshapelayout);
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

        EdgeHistogram lvbaseimage = new EdgeHistogram();
        //lvbaseimage.setByteArrayRepresentation(pbasefeaturevector,0,pbasefeaturevector.length);
        lvbaseimage.setByteArrayRepresentation(pbasefeaturevector);

        //return ivsrccolorlayout.getDistance(lvbaseimage);
        return lvbaseimage.getDistance(ivsrcshapelayout);

        //return distance;
    }

    //subhajit: added the code to be inline with the Score and Scoring utilities
    public void compare(String img, String cmpImg, Score imgscr) throws IOException {

        EdgeHistogram entry = BaseImageShapeFeature.ivehdhandlermap.get(cmpImg);

        extractqueryimage(img);

        imgscr.ehdScore(img, (float) entry.getDistance(ivsrcshapelayout));
    }
}
