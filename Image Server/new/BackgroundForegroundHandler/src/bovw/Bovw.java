/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bovw;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.ArrayList;
import org.opencv.core.Core;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.TermCriteria;
import utils.utils;
import IRTEX_Exception.IRTEX_Exception;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import fileUtils.FileUtils;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import models.Score;
import scoring.Scoring;

/**
 *
 * @author SUBHAJIT
 */
public class Bovw {
    
    @Expose(deserialize = true, serialize = true)
    String name;
    
    @Expose(deserialize = true, serialize = false)
    ArrayList<float[][]> vector;
    
    @Expose(deserialize = false, serialize = false)
    ArrayList<Mat> descriptors;
    
    @Expose(serialize = true, deserialize = true)
    ArrayList<float[]> featureVector;
    
    Mat m;
    static ArrayList<Bovw> allBovw;
    
    static Mat kCenters;
    static int numCluster;
    static Mat all_desctiptors;
    
    
    static {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        System.loadLibrary("native_handler");
    }
    
    public static ArrayList<Bovw> load_SURF_data_with_stream(String file) throws IRTEX_Exception, FileNotFoundException, IOException
    {
        Gson gson = new Gson();
        all_desctiptors = new Mat();
        Bovw bovw;
        FileInputStream in=new FileInputStream(file);
        JsonReader reader = new JsonReader(new InputStreamReader(in, StandardCharsets.UTF_8));
        allBovw = new ArrayList<Bovw>(50000);
        try{
            reader.beginArray();
            while (reader.hasNext()) 
            {
                bovw = gson.fromJson(reader, Bovw.class);
                System.out.println(bovw.name);
                createMatOfVector(bovw);
                allBovw.add( bovw);
                
                //if(bovw.name.contains("2010"))break;
            }
            reader.endArray();
        }
        catch(Exception e){}
        finally{
            
            reader.close();
        }
        return allBovw;
    }
    
    
    public static void createMatOfVector(Bovw entry)
    {
        //rows 16 cols 64 type CV_32FC1 total 1024
        
        entry.descriptors = new ArrayList<>();
        for(int j=0; j<entry.vector.size(); j++)
        {
            float[][] arr = entry.vector.get(j);
            float[] oneDarr = utils.convertTwoDim2OneDim(arr, arr.length, arr[0].length);

            Mat m = new Mat(arr.length, arr[0].length, CvType.CV_32FC1);
            m.put(0,0, oneDarr);
            all_desctiptors.push_back(m);
            entry.descriptors.add(m);
        }
        entry.vector = null;
    }
    
    public static ArrayList<Bovw> load_SURF_data(String file) throws IRTEX_Exception
    {
        all_desctiptors = new Mat();
        Type listType = new TypeToken<ArrayList<Bovw>>(){}.getType();
        ArrayList<Bovw> loaded = (ArrayList<Bovw>) FileUtils.loadGsonData(listType, file);
        allBovw = loaded;
        return loaded;
    }
    
    
    public static void createMat()
    {
        //rows 16 cols 64 type CV_32FC1 total 1024
        ArrayList<Bovw> obj = allBovw;
        Bovw entry = null;
        for(int i=0; i< obj.size(); i++)
        {
            entry = obj.get(i);
            entry.descriptors = new ArrayList<>();
            for(int j=0; j<entry.vector.size(); j++)
            {
                float[][] arr = entry.vector.get(j);
                float[] oneDarr = utils.convertTwoDim2OneDim(arr, arr.length, arr[0].length);
                
                Mat m = new Mat(arr.length, arr[0].length, CvType.CV_32FC1);
                m.put(0,0, oneDarr);
                all_desctiptors.push_back(m);
                entry.descriptors.add(m);
            }
            entry.vector = null;
        }
    }
    
    public static void cluster(int numCluster)
    {
        //kmeans(allDescriptors, clusterCount, kLabels, TermCriteria(CV_TERMCRIT_ITER | CV_TERMCRIT_EPS, iterationNumber, 1e-4), attempts, KMEANS_PP_CENTERS, kCenters);
         ArrayList<Bovw> data = allBovw;
        Bovw.numCluster = numCluster;
        Mat bestlabels = new Mat(), centers = new Mat();
        double attempts = 5, iterationNumber = 1e4;
        TermCriteria tc = new TermCriteria(TermCriteria.MAX_ITER | TermCriteria.EPS, (int)iterationNumber, 1e-4);
        double d = Core.kmeans(all_desctiptors, numCluster, bestlabels, tc, 5, Core.KMEANS_PP_CENTERS, centers);
        kCenters = centers;
//        System.out.println("rows "+bestlabels.rows()+" cols "+bestlabels.cols()+" total "+bestlabels.total()+" type "+CvType.typeToString(bestlabels.type()));
//        System.out.println(bestlabels.dump());
//        System.out.println("rows "+all_desctiptors.rows()+" cols "+all_desctiptors.cols()+" total "+all_desctiptors.total()+" type "+CvType.typeToString(all_desctiptors.type()));
//        System.out.println(all_desctiptors.dump());
//        System.out.println("rows "+centers.rows()+" cols "+centers.cols()+" total "+centers.total()+" type "+CvType.typeToString(centers.type()));
//        System.out.println(centers.dump());
    }
    
    
    public static void serialiseCluster(String fname) throws IRTEX_Exception
    {
        if(kCenters == null) throw new IRTEX_Exception(IRTEX_Exception.KCentersNotInitException);
        int rows = kCenters.rows(), cols = kCenters.cols();
        
        float []ctrs = new float[rows*cols];
        
        kCenters.get(0,0,ctrs);
        
        float [][]_2dctrs = utils.convertOneDim2TwoDim(ctrs, rows, cols);
                
        centers c = new centers(_2dctrs);
        
        String str = new Gson().toJson(c);
        
        FileUtils.writeToFile(fname, str);
    }
    
    public static void deserialiseCluster(String fname) throws IRTEX_Exception
    {
        
        Type listType = new TypeToken<centers>(){}.getType();
        centers c = (centers)FileUtils.loadGsonData(listType, fname);
        
        numCluster = c.centers.length;
        
        float []f = utils.convertTwoDim2OneDim(c.centers, c.centers.length, c.centers[0].length);
        
        kCenters = new Mat(c.centers.length, c.centers[0].length, CvType.CV_32FC1);
        
        kCenters.put(0,0, f);
    }
    
    
    public static void serialiseBovw_withDataVector_n_stream(String fname) throws IRTEX_Exception, IOException
    {
        ArrayList<Bovw>data = allBovw;
        Gson gson =new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
        FileOutputStream out=new FileOutputStream(FileUtils.createFile(fname));   
        
        JsonWriter writer = new JsonWriter(new OutputStreamWriter(out, StandardCharsets.UTF_8));
        writer.beginArray();
        
        Bovw entry;
        try
        {
            int j=allBovw.size();
            for(int i= 0; i<j; i++)
            {
                entry = allBovw.get(i);
                entry.getDataVector();

                gson.toJson(entry, Bovw.class, writer);
                
                entry.descriptors = null;
                entry.vector = null;
                entry.featureVector = null;
                entry.name = null;
            }
        }
        
        finally{
            writer.endArray();
            writer.close();
        }
        
        //FileUtils.writeToFile(fname, s);
    }
    
    
    public static void serialiseBovw(String fname) throws IRTEX_Exception
    {
        ArrayList<Bovw>data = allBovw;
        String s =new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create().toJson(data);
        FileUtils.writeToFile(fname, s);
    }
    
    public static ArrayList<Bovw> deserialiseBovw(String fname) throws IRTEX_Exception
    {
        Type listType = new TypeToken<ArrayList<Bovw>>(){}.getType();
        allBovw = (ArrayList<Bovw>) FileUtils.loadGsonData(listType, fname);
        return allBovw;
    }
    
    
    public void getDataVector() {
        for(int p = 0; p<descriptors.size(); p++)
        {
            //System.out.println(descriptors.get(p).dump());
            float[] arr =  native_handler.getDatahistogram(kCenters.nativeObj, descriptors.get(p).nativeObj, numCluster);
            
//            Mat descriptor  = descriptors.get(p);
//            BFMatcher matcher = new BFMatcher(BFMatcher.BRUTEFORCE, false);
//
//            MatOfDMatch matches = new MatOfDMatch();
//            matcher.match(descriptor, kCenters, matches);
//
//            //Make a Histogram of visual words
//            
//            float []f = new float[1*3];
//
//            DMatch[] dm = matches.toArray();
//
//            int index = 0;
//            for (int j = 0; j < dm.length; j++, index++) {
//                f[dm[index].trainIdx] = f[dm[index].trainIdx]+1;
//                //datai.at<float>(0, matches.at(index).trainIdx) = datai.at<float>(0, matches.at(index).trainIdx) + 1;
//            }
//            if(featureVector == null) featureVector = new ArrayList<>();
//            featureVector.add(f);
            //Mat datai = Mat.zeros(new Size(1, numCluster), CvType.CV_32F);
            //datai.put(0,0, arr);
            if(featureVector == null) featureVector = new ArrayList<>();
            featureVector.add(arr);
        }
    }
    
    
    public void loadQueryData(String name, ArrayList<Mat> descriptors)
    {
        this.name = name;
        this.descriptors = descriptors;
        getDataVector();
    }
    
    
    static float l2dist(float[]a, float[]b)
    {
        float sum = 0;
        for(int i=0; i<a.length; i++)
        {
            sum+= Math.pow((a[i]-b[i]), 2);
        }
        return (float) Math.sqrt(sum);
    }
//    
//    public void compare(Scoring topdoc)
//    {
//        Bovw query;
//        ArrayList<float[]>query_array;
//        float max = -1;
//        float total;
//        float a[], b[];
//        
//        
//        Score counter;
//        
//        for(int i=0; i<allBovw.size(); i++)
//        {
//            query = allBovw.get(i);
//            query_array = query.featureVector;
//            if(query_array == null)
//                continue;
//            
//            if(query.name.endsWith("bird_batch_1_42.jpg"))
//            {
//                System.out.println("bovw.Bovw.compare()");
//            }
//            
//            counter = new Score(query.name, query_array.size());
//            for(int j=0; j<query_array.size(); j++)
//            {
//                //REGION OF base image
//                a = query_array.get(j);
//                if(a==null)
//                    continue;
//                max = -1;
//                for(int k=0; k< this.featureVector.size(); k++)
//                {
//                    //REGION OF query IMAGE
//                    b = this.featureVector.get(k);
//                    
//                    //calculate distance
//                    total = l2dist(a, b);
//                    if(max == -1)max = total;
//                    else if(total<max)max = total;                
//                }
//                counter.add(max, j);
//            }
//            counter.average();
//            counter = topdoc.add(counter, Scoring.feature_type.BackgroundForeground);//.put(counter.name, counter);     
//            if(counter!= null)
//            {
//                counter.features = featureVector;
//            }
//        }
//        
//    }
//    
    
    private Bovw findObj(String img)
    {
        for(int i=0; i<allBovw.size(); i++)
        {
            if(allBovw.get(i).name.equals(img))
            {
                return allBovw.get(i);
            }
        }
        return null;
    }
    
    public void compare(String img, Score imgscr) throws IRTEX_Exception
    {
        Bovw query;
        ArrayList<float[]>query_array;
        float max = -1;
        float total;
        float a[], b[];
        
        
        Score counter = imgscr;
        
        
        query = findObj(img);
        query_array = query.featureVector;
        if(query_array == null)
            throw new IRTEX_Exception(IRTEX_Exception.ArrayNull);

        if(query.name.endsWith("bird_batch_1_42.jpg"))
        {
            System.out.println("bovw.Bovw.compare()");
        }

        counter.bfScore(query.name, query_array.size());
        for(int j=0; j<query_array.size(); j++)
        {
            //REGION OF base image
            a = query_array.get(j);
            if(a==null)
                continue;
            max = -1;
            for(int k=0; k< this.featureVector.size(); k++)
            {
                //REGION OF query IMAGE
                b = this.featureVector.get(k);

                //calculate distance
                total = l2dist(a, b);
                if(max == -1)max = total;
                else if(total<max)max = total;                
            }
            counter.add(max, j);
        }
        counter.average();
        
        counter.features = featureVector;
        
    }
    
}

class centers
{
    @Expose(serialize = true, deserialize = true)
    float[][] centers;

    public centers(float[][] centers) {
        this.centers = centers;
    }
    
}