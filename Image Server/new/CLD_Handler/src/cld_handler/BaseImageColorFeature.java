/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//package net.applicationstart.lire.codeentry;
package cld_handler;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.imageio.ImageIO;
import net.semanticmetadata.lire.imageanalysis.features.global.ColorLayout;
import readjson.ReadJsonfile;
import org.json.simple.JSONObject;

/**
 *
 * @author lenovo
 */
public class BaseImageColorFeature {
   
  private BufferedImage ivbaseimage;
  private ColorLayout ivbasecolorlayout;
  public static HashMap<String,ColorLayout > ivcldhandlermap = new HashMap<>(); 
  
  public BaseImageColorFeature()  { 
    ivbasecolorlayout = new ColorLayout();
  } 
  
   public ColorLayout getbasecolorlayout(){
      return ivbasecolorlayout;
  }
   
  public HashMap<String,ColorLayout> getcldmap(){
      return ivcldhandlermap;
  }
   
   /** 
   * @param 
   * fpath : dictionary file path
   *
   **/
   public static void initializecld(String fpath){
       
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
       ColorLayout lvbaseimage = new ColorLayout();
       lvbaseimage.setByteArrayRepresentation(lvbytearrayvec);
       ivcldhandlermap.put((String)lvjsonobj.get("name"),lvbaseimage);     
    }
  }
  
  /**
   * @param 
   * fpath : dictionary file path
  **/
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
            BaseImageColorFeature lvobj = new BaseImageColorFeature();
            lvobj.populatecldmap(lvfile);
            ivcldhandlermap.put(lvfile, lvobj);           
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
  
  public void populatecldmap(String pfilepath) throws IOException{
      System.out.println("source file path: " + pfilepath);
      File lvsrcfile = new File(pfilepath);
      ivbaseimage = ImageIO.read(lvsrcfile); 
      ivbasecolorlayout.extract(ivbaseimage);
          
  }
  
  
  /** Kush -- New API After design change 14/05/2020 **/
  public byte[] getsrcfeaturevectors(){
      return ivbasecolorlayout.getByteArrayRepresentation();
  }
  
  /** Kush -- old API 14/05/2020 */
  public byte[] getsrcfeaturevectors(String pfilepath) throws IOException
  {
      
      System.out.println("source file path: " + pfilepath);
      File lvsrcfile = new File(pfilepath);
      ivbaseimage = ImageIO.read(lvsrcfile); 
      ivbasecolorlayout.extract(ivbaseimage);
      return ivbasecolorlayout.getByteArrayRepresentation();
      
  }
    
}
