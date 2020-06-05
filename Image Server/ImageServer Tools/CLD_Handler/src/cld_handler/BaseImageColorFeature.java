/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//package net.applicationstart.lire.codeentry;
package cld_handler;

import IRTEX_Exception.IRTEX_Exception;
import com.google.gson.reflect.TypeToken;
import fileUtils.FileUtils;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.imageio.ImageIO;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import net.semanticmetadata.lire.imageanalysis.features.global.ColorLayout;
import readjson.ReadJsonfile;
import org.json.simple.JSONObject;
import stringutils.StringUtils;

/**
 *
 * @author lenovo
 */
public class BaseImageColorFeature {

    private BufferedImage ivbaseimage;
    private ColorLayout ivbasecolorlayout;
    float[] semanticInformation;
    public static HashMap<String, BaseImageColorFeature> ivcldhandlermap = new HashMap<>();

    public BaseImageColorFeature() {
        ivbasecolorlayout = new ColorLayout();
    }

    public BaseImageColorFeature(ColorLayout colorObj, float[] semInfo) {
        ivbasecolorlayout = colorObj;
        semanticInformation = semInfo;
    }

    public ColorLayout getbasecolorlayout() {
        return ivbasecolorlayout;
    }

//    public HashMap<String, ColorLayout> getcldmap() {
//        return ivcldhandlermap;
//    }
    /**
     * @param fpath : dictionary file path
     *
     *
     */
    public static void initializecld(String fpath) {

        ReadJsonfile lvreadf = new ReadJsonfile();
        ArrayList<JSONObject> lvjsonarray = new ArrayList<JSONObject>();
        JSONObject lvjsonobj;
        lvjsonarray = lvreadf.readdictionary(fpath);
        byte[] lvbytearrayvec;// = new byte[10];
        //EdgeHistogram lvbaseimage = new EdgeHistogram();

        for (int i = 0; i < lvjsonarray.size(); i++) {
            lvjsonobj = lvjsonarray.get(i);

            lvbytearrayvec = lvreadf.convertstrtobytearray((String) lvjsonobj.get("vector"));
            ColorLayout lvbaseimage = new ColorLayout();
            lvbaseimage.setByteArrayRepresentation(lvbytearrayvec);
            float[] semanticInfo = lvreadf.convertstrtofloatarray((String) lvjsonobj.get("semanticvector"));
            ivcldhandlermap.put((String) lvjsonobj.get("name"), new BaseImageColorFeature(lvbaseimage, semanticInfo));
        }
    }

    /**
     * Kush -- old API 14/05/2020
     */
    public byte[] getsrcfeaturevectors(String pfilepath) throws IRTEX_Exception {

        try {
            //System.out.println("source file path: " + pfilepath);
            File lvsrcfile = new File(pfilepath);
            ivbaseimage = ImageIO.read(lvsrcfile);
            ivbasecolorlayout.extract(ivbaseimage);
            return ivbasecolorlayout.getByteArrayRepresentation();
        } catch (IOException ex) {
            throw new IRTEX_Exception(IRTEX_Exception.IOException, ex.getMessage());
        }

    }

    public float[] getColorSemanticInformation(String pfilepath, String URL) throws IRTEX_Exception {
        float[] info;

        if (URL.endsWith("/")) {
            URL = StringUtils.replaceLast(URL, "/", "");
        }
        if (URL == null) {
            throw new IRTEX_Exception(IRTEX_Exception.URLException);
        }
        String strURL = URL + "/color";

        HttpResponse<String> str = Unirest.get(strURL).queryString("fileName", pfilepath).asString();

        if (str == null || str.getStatus() == 500) {
            throw new IRTEX_Exception(IRTEX_Exception.ColorSemanticInformationExtractionException);
        }
        
        Type t = new TypeToken<float[]>() {}.getType();

        info = (float[]) FileUtils.loadGsonStringData(t, str.getBody());
        this.semanticInformation = info;
        return this.semanticInformation;
    }

}
