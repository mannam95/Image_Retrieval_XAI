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
    
    public static void query(String Fpath, String img, Score score) throws IOException
    {
        
        new CompareShapeFeature().compare(Fpath, img, score);
        
    }
}
