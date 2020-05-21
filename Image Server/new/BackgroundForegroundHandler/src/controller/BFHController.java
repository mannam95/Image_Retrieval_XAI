/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;
import IRTEX_Exception.IRTEX_Exception;
import bovw.Bovw;
import backgroundForegroundHandler.BackgroundForegroundHandler;
import java.util.HashMap;
import models.Score;
import scoring.Scoring;

/**
 *
 * @author SUBHAJIT
 */
public class BFHController {
    public static void initialise(String centersFile, String bagOfWordFile) throws IRTEX_Exception
    {
        Bovw.deserialiseCluster(centersFile);
        Bovw.deserialiseBovw(bagOfWordFile);
    }
    
    public static void query(String Fpath, String img, Score score) throws IRTEX_Exception
    {
        
        BackgroundForegroundHandler handler = new BackgroundForegroundHandler(BackgroundForegroundHandler.SegmentationAlgorithm.WATERSHED_SEGMENTATION, Fpath);
        handler.extract();
        
        Bovw query = new Bovw();
        query.loadQueryData(handler.name, handler.feature);
        
        
        query.compare(img, score);
    }
    
}
