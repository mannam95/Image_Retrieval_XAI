/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servletcontroller;
import IRTEX_Exception.IRTEX_Exception;
import bovw.Bovw;
import cld_handler.BaseImageColorFeature;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import controller.BFHController;
import controller.CLD_Controller;
import controller.EHD_Controller;
import ehd_Handler.BaseImageShapeFeature;
import fileUtils.FileUtils;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;
import model.HandlerConfig;
import model.imageserver_config;
import models.Score;
import org.opencv.core.Core;
import scoring.Scoring;

/**
 *
 * @author SUBHAJIT
 */
public class controller {
    
    static imageserver_config conf;
    static HashMap<String, Object> handlers = new HashMap<>();
    
    static Set<String> images = null;
    
    public static void init(String isconfig) throws IRTEX_Exception
    {
        
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        System.loadLibrary("native_handler");
        Type listType = new TypeToken<imageserver_config>(){}.getType();
        conf = (imageserver_config) FileUtils.loadGsonData(listType, isconfig);
        conf.validate();

        for(int i=0; i<conf.pipe.size(); i++)
        {
            HandlerConfig hc = conf.pipe.get(i);

            if(hc.name.equals("bf"))//means it is a background foreground handler
            {
                handlers.put(hc.name, hc);
                BFHController.initialise(hc.center, hc.dictionary);
                if(images == null)images = Bovw.allBovwHash.keySet();
            }
            
            
            if(hc.name.equals("cld"))
            {
                handlers.put(hc.name, hc);
                CLD_Controller.initialise(hc.dictionary);
                
                if(images == null)images = BaseImageColorFeature.ivcldhandlermap.keySet();
            }
            
            
            if(hc.name.equals("ehd"))
            {
                handlers.put(hc.name, hc);
                EHD_Controller.initialise(hc.dictionary);
                
                if(images == null) images = BaseImageShapeFeature.ivehdhandlermap.keySet();
            }
            
        }
    }
    
    
    public String newQuery(String Filename)
    {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        System.loadLibrary("native_handler");
        try
        {
            Score QueryDetails = new Score();
            BFHController bfhc = null;
            CLD_Controller cldc = null;
            EHD_Controller ehdc = null;
            if(handlers.containsKey("bf"))
            {
                HandlerConfig hc = (HandlerConfig)handlers.get("bf");
                bfhc = new BFHController(Filename, QueryDetails, hc.WorkingDir, hc.URL);
            }
            if(handlers.containsKey("cld"))
            {
                cldc = new CLD_Controller(Filename, QueryDetails);
            }
            if(handlers.containsKey("ehd"))
            {
                ehdc = new EHD_Controller(Filename, QueryDetails);
            }
            
            
            Scoring topdoc = new Scoring(60, QueryDetails);
            for(String img: images)
            {
                try
                {
                    Score sc = new Score();
                    if(handlers.containsKey("bf"))
                    {
                        bfhc.query(img, sc);
                    }
                    if(handlers.containsKey("cld"))
                    {
                        cldc.query(img, sc);
                    }
                    if(handlers.containsKey("ehd"))
                    {
                        ehdc.query(img, sc);
                    }
                    //all other descriptprs here

                    topdoc.add(sc);
                }
                catch(Exception e){}
            }
            
            //topdoc.sort();
            String s =  new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create().toJson(Scoring.serialiseObj(topdoc, handlers));
            return s;
            
            
            
        } catch (Exception ex) {
            ex.printStackTrace();
            return "{\"error\":\""+ex.getMessage()+"\"}";
        }
    }
    
}
