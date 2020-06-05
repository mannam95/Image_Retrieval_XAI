/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//package net.applicationstart.lire.codeentry;
package generate_dict;
import IRTEX_Exception.IRTEX_Exception;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.json.simple.JSONObject;
//import org.json.simple.JSONArray;
//import org.json.simple.JSONObject;
import cld_handler.BaseImageColorFeature;
import ehd_Handler.BaseImageShapeFeature;
import fileUtils.FileUtils;
import java.util.ArrayList;
/**
 *
 * @author lenovo
 */
public class createimagedict {
    
    FileWriter ivfilewriter;
        
    public void getfiles(String pfpath,String outfpath, String url, boolean type) throws IOException, IRTEX_Exception{
        
        ArrayList<String> lvfilelist = new ArrayList<>();
        FileUtils.listf(pfpath, lvfilelist);
       
        Iterator<String> lvfilelistIterator = lvfilelist.iterator();
        
        try {
        //try ( ivfilewriter = new FileWriter(outfpath)) {
            ivfilewriter = new FileWriter(FileUtils.createFile(outfpath));
            while(lvfilelistIterator.hasNext()) {
                //System.out.println(lvfilelistIterator.next());
                String lvfile = lvfilelistIterator.next();
                System.out.println(lvfile);
                create_image_dictionary(lvfile,url,type);
               
            }
            ivfilewriter.close();
        }
        catch(IOException e){
            e.printStackTrace();
        }
        
    } 
          
    public void create_image_dictionary(String pfile, String url, boolean type) throws IRTEX_Exception{
        
        String lvdescriptor;
        String semanticInformation ;
        /* 1 for color 
           0 for shape
        */
        if (type){
            BaseImageColorFeature lvclrobj = new BaseImageColorFeature();
            lvdescriptor = Arrays.toString(lvclrobj.getsrcfeaturevectors(pfile));
            semanticInformation = Arrays.toString(lvclrobj.getColorSemanticInformation(pfile, url));
            
        }else{
            BaseImageShapeFeature lvshpobj = new BaseImageShapeFeature();
            lvdescriptor = Arrays.toString(lvshpobj.getsrcShapefeaturevectors(pfile));
            semanticInformation = null;
        }
                
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("name",pfile);
        jsonObject.put("vector",lvdescriptor);
        
        if(type)
            jsonObject.put("semanticvector",semanticInformation);
        
        try{
            ivfilewriter.write(jsonObject.toJSONString());
            ivfilewriter.append(System.lineSeparator());
        }
        catch(IOException e){
            e.printStackTrace();
        }
        
        
    }
    
}
