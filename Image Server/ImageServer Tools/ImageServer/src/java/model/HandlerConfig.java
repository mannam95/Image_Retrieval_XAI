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
public class HandlerConfig {
    @Expose(deserialize = true)
    public String name;
    @Expose(deserialize = true)
    public String dictionary;
    @Expose(deserialize = true)
    public String center;
    @Expose(deserialize = true)
    public float weight;
    @Expose(deserialize = true)
    public String URL;
    @Expose(deserialize = true)
    public String WorkingDir;
}
