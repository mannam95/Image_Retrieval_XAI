/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import constants.Handlers;
import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author SUBHAJIT
 */
public class Score {
    @Expose(serialize = true)
    public String name;
    
    
    
    @Expose(serialize = true)
    @SerializedName("overallDistScore")
    public float overallScore;
    
    
    //these are for background foreground
    public float[] region_scores;
    @Expose(serialize = true)
    @SerializedName("backforegrounddistance")
    public float average;
    
    public ArrayList<float[]>features = new ArrayList<>();
    
    
    
    //this is for cld score
    @Expose(serialize = true)
    @SerializedName("colordistance")
    public float cldScore;
    
    public double[] cldVector;
    
    
    
    //this is for cld score
    @Expose(serialize = true)
    @SerializedName("shapedistance")
    public float ehdScore;
    
    public double[] ehdVector;
    
    
    
    @Expose(serialize = true)
    ArrayList<HashMap<String, Object>> mainFeatures;
    
            
    
    public void ehdScore(String name, float score) {
        this.name = name;
        ehdScore = score;
    }
    
    
    public void cldScore(String name, float score) {
        this.name = name;
        cldScore = score;
    }
    
    
    
    public void addbfvector(float[] vect)
    {
        this.features.add(vect);
    }

    public void bfScore(String name, int numregions) {
        this.name = name;
        region_scores = new float[numregions];
    }
    
    public void add(float data, int pos)
    {
        region_scores[pos] = data;
    }
    
    public void average()
    {
        float sum = 0;
        for(int i=0;i<region_scores.length; i++)
        {
            sum += region_scores[i];
        }
        average = sum/region_scores.length;
    }
    
    
    
    public void addVectorToCategorised()
    {
        mainFeatures = new ArrayList<>();
        HashMap<String, Object> obj = new HashMap<>();
        obj.put(Handlers.backgroundForegroundHandler, features);
        mainFeatures.add(obj);
        
        obj = new HashMap<>();
        obj.put(Handlers.ColorHandler, cldVector);
        mainFeatures.add(obj);
        
        obj = new HashMap<>();
        obj.put(Handlers.ShapeHandler, ehdVector);
        mainFeatures.add(obj);
        
    }
    
}


class features
{
}