/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

/**
 *
 * @author SUBHAJIT
 */
public abstract class LocalImageFeature {
    protected String name;
    protected Object feature;
    
    public abstract boolean Extract(String fileName);
    
    public abstract float calculateSimilarity(String imageFile);
    
    
}
