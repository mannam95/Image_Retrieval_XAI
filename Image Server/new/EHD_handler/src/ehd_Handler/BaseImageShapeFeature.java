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

/**
 *
 * @author lenovo
 */
public class BaseImageShapeFeature {
    private BufferedImage ivbaseimage;
    private EdgeHistogram ivbaseshapelayout;
    public static HashMap<String,EdgeHistogram > ivehdhandlermap = new HashMap<>(); 
    
    public BaseImageShapeFeature()  { 
  
    ivbaseshapelayout = new EdgeHistogram();
 
  }
    
  public EdgeHistogram getbaseshapelayout(){
      return ivbaseshapelayout;
  }
  
  public HashMap<String,EdgeHistogram> getehdmap(){
      return ivehdhandlermap;
  }
    
  public static void initializeshapedes(String fpath){
      ReadJsonfile lvreadf = new ReadJsonfile();
      ArrayList<JSONObject> lvjsonarray =new ArrayList<JSONObject>();
      JSONObject lvjsonobj;
      lvjsonarray = lvreadf.readdictionary(fpath);
      byte [] lvbytearrayvec;// = new byte[10];
      //EdgeHistogram lvbaseimage = new EdgeHistogram();
      
      for(int i=0;i<lvjsonarray.size();i++){
        lvjsonobj = lvjsonarray.get(i);
        System.out.println((String)lvjsonobj.get("name")+":"+
                               (String)lvjsonobj.get("vector"));
         
        lvbytearrayvec = lvreadf.convertstrtobytearray((String)lvjsonobj.get("vector"));
        EdgeHistogram lvbaseimage = new EdgeHistogram();
        lvbaseimage.setByteArrayRepresentation(lvbytearrayvec);
        ivehdhandlermap.put((String)lvjsonobj.get("name"),lvbaseimage);     
      }
  }
  /*
  static void initializecldold(String fpath) throws IOException{
      
      List<String> lvfilelist = null;
      lvfilelist = getfiles(fpath);
      Iterator<String> lvfilelistIterator = lvfilelist.iterator();
      try {
       
        while(lvfilelistIterator.hasNext()) {
            //System.out.println(lvfilelistIterator.next());
            String lvfile = lvfilelistIterator.next();
            //System.out.println(lvfile);
            BaseImageShapeFeature lvobj = new BaseImageShapeFeature();
            lvobj.populateehdmap(lvfile);
            ivehdhandlermap.put(lvfile, lvobj);           
            }
        }
        catch(IOException e){
            e.printStackTrace();
        }
      
  }
  */
  public static List<String> getfiles(String pfpath) throws IOException{
        
        List<String> lvfilelist = null;
        try (Stream<Path> walk = Files.walk(Paths.get(pfpath))) {

	lvfilelist = walk.map(x -> x.toString())
			.filter(f -> f.endsWith(".jpg")).collect(Collectors.toList());
        
        }
        catch (IOException e) {
            e.printStackTrace();
          }       
        return lvfilelist;
        
    } 
  
  public void populateehdmap(String pfilepath) throws IOException{
      System.out.println("source file path: " + pfilepath);
      File lvsrcfile = new File(pfilepath);
      ivbaseimage = ImageIO.read(lvsrcfile); 
      ivbaseshapelayout.extract(ivbaseimage);
          
  }
  
  /** Kush -- New API After design change 14/05/2020 **/
  public byte[] getsrcfeaturevectors(){
      return ivbaseshapelayout.getByteArrayRepresentation();
  }
  
  /** Kush -- old API 14/05/2020 -- keeping for sometime now. later will be moved out. */
    
  public byte[] getsrcShapefeaturevectors(String pfilepath) throws IOException{
      
      System.out.println("source file path: " + pfilepath);
      File lvsrcfile = new File(pfilepath);
      ivbaseimage = ImageIO.read(lvsrcfile); 
      ivbaseshapelayout.extract(ivbaseimage);
      return ivbaseshapelayout.getByteArrayRepresentation();
      
  }
    
}
