/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import ehd_Handler.BaseImageShapeFeature;
import ehd_Handler.CompareShapeFeature;
import java.io.IOException;
import models.Score;

/**
 *
 * @author SUBHAJIT
 */
public class EHD_Controller {
    public static void initialise(String Dictionaryfile)
    {
        BaseImageShapeFeature.initializeshapedes(Dictionaryfile);
    }
    
    
    private CompareShapeFeature csf;

    public EHD_Controller(String Fpath, Score qdetails) throws IOException {
        CompareShapeFeature csf = new CompareShapeFeature(Fpath);
        this.csf = csf;
        qdetails.ehdVector = csf.ivsrcshapelayout.getFeatureVector();
    }
    
    
    public void query(String img, Score score) throws IOException
    {
        
        csf.compare(img, score);
        
    }
}
