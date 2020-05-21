/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package models;

import com.google.gson.annotations.Expose;
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
    public float average;
    @Expose(serialize = true)
    public ArrayList<float[]>features;
    
    @Expose(serialize = true)
    public float overallScore;
    
    
    //this is for cld score
    public float cldScore;
    
    
    
    //this is for cld score
    public float ehdScore;
    
    
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
