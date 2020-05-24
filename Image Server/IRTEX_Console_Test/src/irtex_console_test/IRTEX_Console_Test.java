/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package irtex_console_test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import model.ImageFeature;
import org.opencv.core.Core;

/**
 *
 * @author SUBHAJIT
 */
public class IRTEX_Console_Test {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        
        
        ArrayList<String> images = new ArrayList<>();
        images.add("D:\\dke\\2ND SEM\\IRTEX\\resource\\test_images\\cat\\cat_test_1.jpg");
        //listf("D:\\dke\\2ND SEM\\IRTEX\\resource\\images", images);
        ArrayList<ImageFeature> loadedImages = new ArrayList<>();
        
        for(int i=0; i<images.size(); i++){
            ImageFeature img = new ImageFeature(images.get(i));
            img.doExteaction();
            loadedImages.add(img);
        }
        
        
        ArrayList<String> testImages = new ArrayList<>();
        testImages.add("D:\\dke\\2ND SEM\\IRTEX\\resource\\images\\airplane\\airplane_batch_1_1013.jpg");
        //listf("D:\\dke\\2ND SEM\\IRTEX\\resource\\test_images", testImages);
        ArrayList<ImageFeature> loadedTestImages = new ArrayList<>();
        
        for(int i=0; i<testImages.size(); i++){
            ImageFeature img = new ImageFeature(testImages.get(i));
            img.doExteaction();
            loadedTestImages.add(img);
        }
        
        compareImages(loadedImages, loadedTestImages);
        
    }
    
    
    public static void compareImages(ArrayList<ImageFeature> databaseImages, ArrayList<ImageFeature> testImages) throws IOException
    {
        System.out.println("writing");
        ArrayList<score> matchScore = new ArrayList<>();
        File file = new File("D:\\dke\\2ND SEM\\IRTEX\\resource\\report"+System.currentTimeMillis()+".txt");
        if(file.exists())file.delete();
        file.createNewFile();
        FileWriter fr = null;
        try{
            fr = new FileWriter(file, true);
            for(int i=0;i<testImages.size(); i++)
            {
                fr.flush();
                matchScore.clear();
                ImageFeature testimg = testImages.get(i);
                for(int j=0;j<databaseImages.size();j++)
                {
                    Float[] arr = testimg.computeaSImilirity(databaseImages.get(j));
                    if(arr == null)continue;
                    matchScore.add( new score(testimg.name, databaseImages.get(j).name, arr));
                }

                if(matchScore.isEmpty())
                {
                    fr.write("No matching images for "+testimg.name+"\n");
                    continue;
                }
                if(matchScore.size()>0 && matchScore.get(0).normalisedscore == 0)
                {
                    fr.write("No similar images for "+testimg.name+"\n");
                    continue;
                }

                Collections.sort(matchScore);

                fr.write("Top 10(max) images matching "+testimg.name+" are:"+"\n");
                int size = matchScore.size()>10?10:matchScore.size();

                for(int k=0; k<size; k++)
                {
                    fr.write("\t"+matchScore.get(k).databaseimage+"||"+matchScore.get(k).normalisedscore+"\n");

                }

            }
        } catch (IOException ex) {
            Logger.getLogger(IRTEX_Console_Test.class.getName()).log(Level.SEVERE, null, ex);
        }
        finally{
            if(fr!=null) try {
                fr.flush();
                fr.close();
            } catch (IOException ex) {
                Logger.getLogger(IRTEX_Console_Test.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
    
    public static void listf(String directoryName, ArrayList<String> images) 
    {    
        File directory = new File(directoryName);

        // get all the files from a directory
        File[] fList = directory.listFiles();
        int i=0;
        for (File file : fList) {i++;
            if (file.isFile()) {
                images.add(file.getAbsolutePath());
                //if(i==10)return;
            }
            else
            {
                listf(file.getAbsolutePath(), images);
            }
        }
    }                  
    
}


class score implements Comparable<score>
{
    String testimage;
    String databaseimage;
    
    Float[] score;
    float normalisedscore;

    public score(String testimage, String databaseimage, Float[] score) {
        this.testimage = testimage;
        this.databaseimage = databaseimage;
        this.score = score;
        this.normalisedscore = 0;
        for(int i=0;i<score.length; i++)
        {
            this.normalisedscore += score[i];
        }
        this.normalisedscore = this.normalisedscore/score.length;
        
    }


    @Override
    public int compareTo(score t) {
        float diff = this.normalisedscore-t.normalisedscore;
        if(diff>0)return -1;
        if(diff<0)return 1;
        return 0;//if diff == 0
    }
    
    
    
}
