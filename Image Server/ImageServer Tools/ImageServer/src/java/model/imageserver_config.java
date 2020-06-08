/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import com.google.gson.annotations.Expose;
import java.util.ArrayList;

/**
 *
 * @author SUBHAJIT
 */
public class imageserver_config {
    
    @Expose(deserialize = true)
    String log;
    
    @Expose(deserialize = true)
    public ArrayList<HandlerConfig> pipe;
    
    @Expose(deserialize = true)
    public String classificationURL;
    
    public boolean validate()
    {
        return true;
    }
}
