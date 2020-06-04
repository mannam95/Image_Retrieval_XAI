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

    @Expose(serialize = true)
    @SerializedName("overallDistScore")
    public float overallScore;

    //these are for background foreground
    public float[] region_scores;
    @Expose(serialize = true)
    @SerializedName("backforegrounddistance")
    public float average;

    public ArrayList<float[]> features = new ArrayList<>();

    //this is for cld score
    @Expose(serialize = true)
    @SerializedName("colordistance")
    public float cldScore;
    
    @Expose(serialize = true)
    @SerializedName("semanticcolordistance")
    public float scolScore;

    public double[] cldVector;
    public float[] colorSemanticData;

    //this is for ehd score
    @Expose(serialize = true)
    @SerializedName("shapedistance")
    public float ehdScore;

    public double[] ehdVector;
    
    
    //this is for hlsf score
    @Expose(serialize = true)
    @SerializedName("HighLevelSemanticFeatureDistance")
    public float HSLFScore;

    public float[] HSLFVector;
    public String[] shapesemantic;

    @Expose(serialize = true)
    HashMap<String, Object> mainFeatures;

    public void ehdScore(String name, float score) {
        this.name = name;
        ehdScore = score;
    }

    public void cldScore(String name, float score) {
        this.name = name;
        cldScore = score;
    }
    
    
    public void HLSFScore(String name, float score) {
        this.name = name;
        HSLFScore = score;
    }

    public void addbfvector(float[] vect) {
        this.features.add(vect);
    }

    public void bfScore(String name, int numregions) {
        this.name = name;
        region_scores = new float[numregions];
    }

    public void add(float data, int pos) {
        region_scores[pos] = data;
    }

    public void average() {
        float sum = 0;
        for (int i = 0; i < region_scores.length; i++) {
            sum += region_scores[i];
        }
        average = sum / region_scores.length;
    }

    public void addVectorToCategorised(HashMap<String, Object> handlers) {
        //mainFeatures = new ArrayList<>();
        mainFeatures = new HashMap<>();

        if (handlers.containsKey("bf")) {
            //obj = new HashMap<>();
            mainFeatures.put("BackgroundForeground", features);
            //mainFeatures.add(obj);
        }
        if (handlers.containsKey("cld")) {
            //obj = new HashMap<>();
            mainFeatures.put("Color", cldVector);
            mainFeatures.put("colorSemanticData", colorSemanticData);
            //mainFeatures.add(obj);
        }
        if (handlers.containsKey("ehd")) {
            //obj = new HashMap<>();
            mainFeatures.put("Shape", ehdVector);
            //mainFeatures.add(obj);
        }
        if (handlers.containsKey("hlsf")) {
            //obj = new HashMap<>();
            mainFeatures.put("HighLevelSemanticFeature", HSLFVector);
            mainFeatures.put("shapesemantic", shapesemantic);
            //mainFeatures.add(obj);
        }

    }

}
