/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import com.google.gson.annotations.Expose;

/**
 *
 * @author SUBHAJIT
 */
public class response {
    
    @Expose(serialize = true, deserialize = true)
    public float[] feature;
    
    @Expose(serialize = true, deserialize = true)
    public String[] classes;
}
