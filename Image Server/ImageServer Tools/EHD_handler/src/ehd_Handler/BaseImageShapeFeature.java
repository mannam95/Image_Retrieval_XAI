/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//package net.applicationstart.lire.codeentry;
package ehd_Handler;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import net.semanticmetadata.lire.imageanalysis.features.global.EdgeHistogram;
import readjson.ReadJsonfile;
import java.util.ArrayList;
import org.json.simple.JSONObject;
import IRTEX_Exception.IRTEX_Exception;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author lenovo
 */
public class BaseImageShapeFeature {

    private BufferedImage ivbaseimage;
    private EdgeHistogram ivbaseshapelayout;
    public static HashMap<String, EdgeHistogram> ivehdhandlermap = new HashMap<>();

    public BaseImageShapeFeature() {

        ivbaseshapelayout = new EdgeHistogram();

    }

    public EdgeHistogram getbaseshapelayout() {
        return ivbaseshapelayout;
    }

    public HashMap<String, EdgeHistogram> getehdmap() {
        return ivehdhandlermap;
    }

    public static void initializeshapedes(String fpath) {
        ReadJsonfile lvreadf = new ReadJsonfile();
        ArrayList<JSONObject> lvjsonarray = new ArrayList<JSONObject>();
        JSONObject lvjsonobj;
        lvjsonarray = lvreadf.readdictionary(fpath);
        byte[] lvbytearrayvec;// = new byte[10];
        //EdgeHistogram lvbaseimage = new EdgeHistogram();

        for (int i = 0; i < lvjsonarray.size(); i++) {
            lvjsonobj = lvjsonarray.get(i);
            lvbytearrayvec = lvreadf.convertstrtobytearray((String) lvjsonobj.get("vector"));
            EdgeHistogram lvbaseimage = new EdgeHistogram();
            lvbaseimage.setByteArrayRepresentation(lvbytearrayvec);
            ivehdhandlermap.put((String) lvjsonobj.get("name"), lvbaseimage);
        }
    }

    public void populateehdmap(String pfilepath) throws IOException {
        //System.out.println("source file path: " + pfilepath);
        File lvsrcfile = new File(pfilepath);
        ivbaseimage = ImageIO.read(lvsrcfile);
        ivbaseshapelayout.extract(ivbaseimage);

    }

    /**
     * Kush -- old API 14/05/2020 -- keeping for sometime now. later will be
     * moved out.
     */
    public byte[] getsrcShapefeaturevectors(String pfilepath) throws IRTEX_Exception {

        try {
            //System.out.println("source file path: " + pfilepath);
            File lvsrcfile = new File(pfilepath);
            ivbaseimage = ImageIO.read(lvsrcfile);
            ivbaseshapelayout.extract(ivbaseimage);
            return ivbaseshapelayout.getByteArrayRepresentation();
        } catch (IOException ex) {
            throw new IRTEX_Exception(IRTEX_Exception.IOException, ex.getMessage());
        }

    }

}
