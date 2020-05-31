/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package backgroundForegroundHandler;

import customs.WatershedSegmentation;
import java.util.ArrayList;
import model.Segmenter;
import org.opencv.core.Mat;
import IRTEX_Exception.IRTEX_Exception;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;
import com.google.gson.stream.JsonWriter;
import customs.NoSegmentation;
import customs.SemanticSegmentation;
import java.io.File;
import java.io.FileWriter;
import org.opencv.core.CvType;
import utils.utils;
import fileUtils.FileUtils;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import org.opencv.core.Core;


/**
 *
 * @author SUBHAJIT
 */
public class BackgroundForegroundHandler {
    @Expose(serialize = false, deserialize = false)
    public ArrayList<Mat> feature = null;
    
    @Expose(serialize = false, deserialize = false)
    Segmenter segmenter;
    
    @Expose(serialize = true, deserialize = true)
    public String name;
    
    @Expose(serialize = true, deserialize = true)
    public ArrayList<float[][]> vector;
    
    public enum SegmentationAlgorithm {
        WATERSHED_SEGMENTATION,
        SEMANTIC_SEGMENTATION,
        NO_SEGMENTATION
    }
    
    static {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        System.loadLibrary("native_handler");
    }
    
    public BackgroundForegroundHandler(SegmentationAlgorithm algo, String img, String WorkingDir, String URL)
    {
        if(algo == SegmentationAlgorithm.WATERSHED_SEGMENTATION)
        {
            segmenter = new WatershedSegmentation();
        }
        else if(algo == SegmentationAlgorithm.NO_SEGMENTATION)
        {
            segmenter = new NoSegmentation();
        }
        else
        {
            segmenter = new SemanticSegmentation(URL, WorkingDir);
        }
        this.name = img;
    }
    
    private boolean extract_nGetFeatureVector() throws IRTEX_Exception
    {
        this.feature = segmenter.extract(this.name);
        this.vector = this.getFeatureVectors();
        return true;
    }
    
    
    public boolean extract() throws IRTEX_Exception
    {
        this.feature = segmenter.extract(this.name);
        return true;
    }
    
    
    private ArrayList<float[][]> getFeatureVectors() {
        
        ArrayList<Mat> descriptors  = (ArrayList<Mat>)this.feature;
        
        ArrayList<float[][]> featureVectors = new ArrayList<>();
        
        for(int i=0; i< descriptors.size(); i++)
        {
            Mat descriptor = descriptors.get(i);
            float[] desc = new float[(int)descriptor.total()];
            
            descriptor.get(0, 0, desc);
            //System.out.println("rows "+descriptor.rows()+" cols "+descriptor.cols()+" type "+CvType.typeToString(descriptor.type())+" total "+descriptor.total());
            featureVectors.add(utils.convertOneDim2TwoDim(desc, descriptor.rows(), descriptor.cols()));
            
        }
        
        return featureVectors;
    }

    
    
    public static void extract_n_write(String fileName, String pathOfImg, String WorkingDir, String URL) throws IRTEX_Exception, FileNotFoundException, IOException
    {
        ArrayList<String> images = new ArrayList<>();
        FileUtils.listf(pathOfImg, images);
        
        //ArrayList<BackgroundForegroundHandler> handlers = new ArrayList<>();
        
        GsonBuilder builder = new GsonBuilder();
        builder.excludeFieldsWithoutExposeAnnotation();
        Gson gson = builder.create();

        
        FileOutputStream out=new FileOutputStream(FileUtils.createFile(fileName));   
        
        JsonWriter writer = new JsonWriter(new OutputStreamWriter(out, StandardCharsets.UTF_8));
        writer.beginArray();
        try
        {
            for(int i=0; i<images.size(); i++)
            {
                System.out.println(images.get(i));
                BackgroundForegroundHandler handler = new BackgroundForegroundHandler(SegmentationAlgorithm.WATERSHED_SEGMENTATION, images.get(i), WorkingDir, URL);
                handler.extract_nGetFeatureVector();
                gson.toJson(handler, BackgroundForegroundHandler.class, writer);
                //handlers.add(handler);
                //System.out.println("working finished for file "+images.get(i));
            }
            /*GsonBuilder builder = new GsonBuilder();
            builder.excludeFieldsWithoutExposeAnnotation();
            Gson gson = builder.create();

            String data = gson.toJson(handlers);

            FileUtils.writeToFile(fileName, data);*/
        }
        finally{
            writer.endArray();
            writer.close();
        }
        
    }
    
    
}
