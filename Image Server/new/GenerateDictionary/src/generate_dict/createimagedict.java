/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//package net.applicationstart.lire.codeentry;
package generate_dict;
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
/**
 *
 * @author lenovo
 */
public class createimagedict {
    
    FileWriter ivfilewriter;
        
    public void getfiles(String pfpath,String outfpath, boolean type) throws IOException{
        
        List<String> lvfilelist = null;
        try (Stream<Path> walk = Files.walk(Paths.get(pfpath))) {

	lvfilelist = walk.map(x -> x.toString())
			.filter(f -> f.endsWith(".jpg")).collect(Collectors.toList());
        
        }
        catch (IOException e) {
            e.printStackTrace();
          }
                
       
        Iterator<String> lvfilelistIterator = lvfilelist.iterator();
        
        try {
        //try ( ivfilewriter = new FileWriter(outfpath)) {
            ivfilewriter = new FileWriter(outfpath);
            while(lvfilelistIterator.hasNext()) {
                //System.out.println(lvfilelistIterator.next());
                String lvfile = lvfilelistIterator.next();
                System.out.println(lvfile);
                create_image_dictionary(lvfile,type);
               
            }
            ivfilewriter.close();
        }
        catch(IOException e){
            e.printStackTrace();
        }
        
    } 
          
    public void create_image_dictionary(String pfile, boolean type) throws IOException{
        
        String lvdescriptor;
        /* 1 for color 
           0 for shape
        */
        if (type){
            BaseImageColorFeature lvclrobj = new BaseImageColorFeature();
            lvdescriptor = Arrays.toString(lvclrobj.getsrcfeaturevectors(pfile));
        }else{
            BaseImageShapeFeature lvshpobj = new BaseImageShapeFeature();
            lvdescriptor = Arrays.toString(lvshpobj.getsrcShapefeaturevectors(pfile));
        }
                
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("name",pfile);
        jsonObject.put("vector",lvdescriptor);
        
        try{
            ivfilewriter.write(jsonObject.toJSONString());
            ivfilewriter.append(System.lineSeparator());
        }
        catch(IOException e){
            e.printStackTrace();
        }
        
        
    }
    
}
