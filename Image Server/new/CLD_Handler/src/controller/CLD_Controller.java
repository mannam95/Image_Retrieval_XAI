/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

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
    
    public static void query(String Fpath, String img, Score score) throws IOException
    {
        
        new CompareColorFeature().compare(Fpath, img, score);
        
    }
    
}
