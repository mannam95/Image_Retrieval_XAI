/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servletcontroller;

import IRTEX_Exception.IRTEX_Exception;
import bovw.Bovw;
import cld_handler.BaseImageColorFeature;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import controller.BFHController;
import controller.CLD_Controller;
import controller.EHD_Controller;
import controller.HLSFController;
import ehd_Handler.BaseImageShapeFeature;
import fileUtils.FileUtils;
import highlevelsemanticfeaturehandler.HighLevelSemanticFeatureHandler;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import model.HandlerConfig;
import model.imageserver_config;
import models.Score;
import org.opencv.core.Core;
import scoring.Scoring;
import stringutils.StringUtils;

/**
 *
 * @author SUBHAJIT
 */
public class controller {

    static imageserver_config conf;
    static HashMap<String, Object> handlers = new HashMap<>();
    static HashMap<String, Float> weightmap = new HashMap<>();
    static Set<String> images = null;
    static ArrayList<String> classificationNames = new ArrayList<>();

    public static void init(String isconfig) throws IRTEX_Exception {

        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        System.loadLibrary("native_handler");
        Type listType = new TypeToken<imageserver_config>() {
        }.getType();
        conf = (imageserver_config) FileUtils.loadGsonData(listType, isconfig);
        conf.validate();

        for (int i = 0; i < conf.pipe.size(); i++) {
            HandlerConfig hc = conf.pipe.get(i);

            if (hc.name.equals("bf"))//means it is a background foreground handler
            {
                classificationNames.add("background_foreground");
                handlers.put(hc.name, hc);
                weightmap.put(hc.name, hc.weight);
                BFHController.initialise(hc.center, hc.dictionary);
                if (images == null) {
                    images = Bovw.allBovwHash.keySet();
                }
            }

            if (hc.name.equals("cld")) {
                classificationNames.add("color");
                handlers.put(hc.name, hc);
                weightmap.put(hc.name, hc.weight);
                CLD_Controller.initialise(hc.dictionary);

                if (images == null) {
                    images = BaseImageColorFeature.ivcldhandlermap.keySet();
                }
            }

            if (hc.name.equals("ehd")) {
                classificationNames.add("shape");
                handlers.put(hc.name, hc);
                weightmap.put(hc.name, hc.weight);
                EHD_Controller.initialise(hc.dictionary);

                if (images == null) {
                    images = BaseImageShapeFeature.ivehdhandlermap.keySet();
                }
            }

            if (hc.name.equals("hlsf")) {
                classificationNames.add("high_level_semantic_feature");
                handlers.put(hc.name, hc);
                weightmap.put(hc.name, hc.weight);
                HLSFController.initialise(hc.dictionary);

                if (images == null) {
                    images = HighLevelSemanticFeatureHandler.allHLSFHash.keySet();
                }
            }

        }
    }

    public String newQuery(String Filename) {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        System.loadLibrary("native_handler");
        try {
            Score QueryDetails = new Score();
            BFHController bfhc = null;
            CLD_Controller cldc = null;
            EHD_Controller ehdc = null;
            HLSFController hlsf = null;
            if (handlers.containsKey("bf")) {
                HandlerConfig hc = (HandlerConfig) handlers.get("bf");
                bfhc = new BFHController(Filename, QueryDetails, hc.WorkingDir, hc.URL, hc.Segmentation);
            }
            if (handlers.containsKey("cld")) {
                HandlerConfig hc = (HandlerConfig) handlers.get("cld");
                cldc = new CLD_Controller(Filename, hc.URL, QueryDetails);
            }
            if (handlers.containsKey("ehd")) {
                ehdc = new EHD_Controller(Filename, QueryDetails);
            }
            if (handlers.containsKey("hlsf")) {
                HandlerConfig hc = (HandlerConfig) handlers.get("hlsf");
                hlsf = new HLSFController(Filename, QueryDetails, hc.URL);
            }

            Scoring topdoc = new Scoring(60, QueryDetails, weightmap);
            for (String img : images) {
                try {
                    Score sc = new Score();
                    if (handlers.containsKey("bf")) {
                        bfhc.query(img, sc);
                    }
                    if (handlers.containsKey("cld")) {
                        cldc.query(img, sc);
                    }
                    if (handlers.containsKey("ehd")) {
                        ehdc.query(img, sc);
                    }
                    if (handlers.containsKey("hlsf")) {
                        hlsf.query(img, sc);
                    }
                    //all other descriptprs here

                    topdoc.add(sc);
                } catch (Exception e) {
                    System.out.println("here");
                }
            }
            topdoc.getClassificationData();
            topdoc.classification_result = doClassification(topdoc.xval, topdoc.classification, conf.classificationURL);
            topdoc.classification_names = classificationNames;
            //topdoc.sort();
            String s = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create().toJson(Scoring.serialiseObj(topdoc, handlers));
            return s;

        } catch (Exception ex) {
            ex.printStackTrace();
            return "{\"error\":\"" + ex.getMessage() + "\"}";
        }
    }

    static float[] doClassification(ArrayList<ArrayList<Float>> xval, ArrayList<Integer> yval, String URL) throws IRTEX_Exception {
        float[] info;

        if (URL.endsWith("/")) {
            URL = StringUtils.replaceLast(URL, "/", "");
        }
        if (URL == null) {
            throw new IRTEX_Exception(IRTEX_Exception.URLException);
        }
        String strURL = URL + "/classification";

        Gson gs = new GsonBuilder().create();
        String xv = gs.toJson(xval);
        String yv = gs.toJson(yval);

        HttpResponse<String> str = Unirest.post(strURL).field("xcomp", xv).field("ycomp", yv).asString();

        if (str == null || str.getStatus() == 500) {
            throw new IRTEX_Exception(IRTEX_Exception.ClassificationException);
        }

        Type t = new TypeToken<float[]>() {
        }.getType();

        info = (float[]) FileUtils.loadGsonStringData(t, str.getBody());
        return info;
    }

}
