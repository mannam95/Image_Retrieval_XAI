/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;
import IRTEX_Exception.IRTEX_Exception;
import bovw.Bovw;
import backgroundForegroundHandler.BackgroundForegroundHandler;
import models.Score;

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
    
    
    Bovw query;
    
    public BFHController(String Fpath, Score qdetails, String WorkingDir, String URL) throws IRTEX_Exception
    {
        
        BackgroundForegroundHandler handler = new BackgroundForegroundHandler(BackgroundForegroundHandler.SegmentationAlgorithm.WATERSHED_SEGMENTATION, Fpath, WorkingDir, URL);
        handler.extract();
        
        query = new Bovw();
        query.loadQueryData(handler.name, handler.feature);
        
        qdetails.features = query.featureVector;
        
    }
    
    public void query(String img, Score score) throws IRTEX_Exception
    {
        query.compare(img, score);
    }
    
}
