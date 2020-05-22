/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * @author SUBHAJIT
 */
public class Score {
    @Expose(serialize = true)
    public String name;
    
    //these are for background foreground
    public float[] region_scores;
    @Expose(serialize = true)
    @SerializedName("TotalAveragedRegionDistance")
    public float average;
    @Expose(serialize = true)
    public ArrayList<float[]>features;
    
    @Expose(serialize = true)
    @SerializedName("OverallDistance")
    public float overallScore;
    
    
    //this is for cld score
    @Expose(serialize = true)
    @SerializedName("CLDDistance")
    public float cldScore;
    
    @Expose(serialize = true)
    @SerializedName("CLDVector")
    public double[] cldVector;
    
    
    
    //this is for cld score
    @Expose(serialize = true)
    @SerializedName("EHDDistance")
    public float ehdScore;
    
    
    @Expose(serialize = true)
    @SerializedName("EHDVector")
    public double[] ehdVector;
    
    
    public void ehdScore(String name, float score) {
        this.name = name;
        ehdScore = score;
    }
    
    
    public void cldScore(String name, float score) {
        this.name = name;
        cldScore = score;
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
    
}
