/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import IRTEX_Exception.IRTEX_Exception;
import cld_handler.BaseImageColorFeature;
import cld_handler.CompareColorFeature;
import java.io.IOException;
import models.Score;
import scoring.Scoring;

/**
 *
 * @author SUBHAJIT
 */
public class CLD_Controller {
    public static void initialise(String Dictionaryfile)
    {
        BaseImageColorFeature.initializecld(Dictionaryfile);
    }
    
    private CompareColorFeature ccf;

    public CLD_Controller(String Fpath, String url, Score qdetails) throws IRTEX_Exception { 
        CompareColorFeature ccf = new CompareColorFeature(Fpath, url);
        this.ccf = ccf;
        qdetails.cldVector = ccf.ivsrccolorlayout.getFeatureVector();
    }
    
    
    
    
    public void query(String img, Score score) throws IOException
    {
        
        ccf.compare(img, score);
        
    }
    
}
