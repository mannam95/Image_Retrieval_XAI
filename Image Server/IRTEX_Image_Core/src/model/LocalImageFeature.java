/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import INTEX_exceptions.IRTEX_Exception;
import java.util.ArrayList;

/**
 *
 * @author SUBHAJIT
 */
public abstract class LocalImageFeature {
    protected String name;
    protected Object feature;
    
    public abstract boolean Extract(String fileName);
    
    public abstract Float[] calculateSimilarity(LocalImageFeature baseImage) throws IRTEX_Exception;
    
    
    public abstract ArrayList<Float[][]> getFeatureVectors();
    
    public abstract boolean buildFeatureFromVector(ArrayList<Float[][]> vectors);
    
    
}
