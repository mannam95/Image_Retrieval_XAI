/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import IRTEX_Exception.IRTEX_Exception;
import highlevelsemanticfeaturehandler.HighLevelSemanticFeatureHandler;
import java.io.IOException;
import models.Score;

/**
 *
 * @author SUBHAJIT
 */
public class HLSFController {
    public static void initialise(String Dictionaryfile) throws IRTEX_Exception, IOException
    {
        HighLevelSemanticFeatureHandler.load_HLSF_data_with_stream(Dictionaryfile);
    }
    
    private HighLevelSemanticFeatureHandler hslf;

    public HLSFController(String Fpath, Score qdetails, String url) throws IOException, IRTEX_Exception { 
        hslf = new HighLevelSemanticFeatureHandler(Fpath, url);
        hslf.getFeature();
        qdetails.HSLFVector = hslf.feature;
    }
    
    
    
    
    public void query(String img, Score score) throws IRTEX_Exception
    {
        
        hslf.compare(img, score);
        
    }
}
