/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import INTEX_exceptions.IRTEX_Exception;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import model.local.SegmentedFeatures;

/**
 *
 * @author SUBHAJIT
 */
public class ImageFeature {
    
    //META
    public String name;

    public ImageFeature(String name) {
        this.name = name;
        
        localFeatures = new ArrayList<>();
        localFeatures.add(new SegmentedFeatures());
    }
    
    
    
    //FEATURES
    private ArrayList<GlobalImageFeature> globalFeatures;
    private ArrayList<LocalImageFeature> localFeatures;
    
    
    public boolean doExteaction()
    {
        boolean b = localFeatures.get(0).Extract(this.name);
        return b;
    }
    
    public Float[] computeaSImilirity(ImageFeature img)
    {
        try {
            return this.localFeatures.get(0).calculateSimilarity(img.localFeatures.get(0));
        } catch (IRTEX_Exception ex) {
            Logger.getLogger(ImageFeature.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }
    
    
}
