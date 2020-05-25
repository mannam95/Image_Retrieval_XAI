/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//package net.applicationstart.lire.codeentry;
package readjson;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
/**
 *
 * @author lenovo
 */
public class ReadJsonfile {
             
    public  ArrayList<JSONObject> readdictionary(String pfpath){
    ArrayList<JSONObject> lvjsonarray =new ArrayList<JSONObject>();
    JSONObject obj;
    // The name of the file to open.
    //String fileName = "C:\\Users\\aawad\\workspace\\kura_juno\\data_logger\\log\\Apr_28_2016\\test.txt ";

    // This will reference one line at a time
    String lvline = null;
    String lvvector = null;
    //String lvvec2 = null;
    try {
        // FileReader reads text files in the default encoding.
        FileReader fileReader = new FileReader(pfpath);

        // Always wrap FileReader in BufferedReader.
        BufferedReader bufferedReader = new BufferedReader(fileReader);
        while(( lvline = bufferedReader.readLine()) != null) {
            obj = (JSONObject) new JSONParser().parse(lvline);
            lvjsonarray.add(obj);
            //System.out.println((String)obj.get("name")+":"+
            //                   (String)obj.get("vector"));
            
            //String name = (String)obj.get("name");
            //lvvector = (String) obj.get("vector");            
        }
        // Always close files.
        bufferedReader.close();  
        
    }
    catch(FileNotFoundException ex) {
        System.out.println("Unable to open file '" + pfpath + "'");                
    }
    catch(IOException ex) {
        System.out.println("Error reading file '" + pfpath + "'");                  
        // Or we could just do this: 
        // ex.printStackTrace();
    } catch (ParseException ex) {
        // TODO Auto-generated catch block
        ex.printStackTrace();
    }
    return lvjsonarray;
        
    }
        
    public byte[] convertstrtobytearray(String pstr){
        String lvnewstr = pstr.replace("[", "");
        lvnewstr = lvnewstr.replace("]","");
        //newstr=newstr.replace(",", "");
        
        String [] mystr = lvnewstr.split("\\s*,\\s*");
        int len = mystr.length;
        int idx = 0;
        byte [] mybyte = new byte[len];
        //System.out.println("len: "+len);
        for(String val : mystr){
            //System.out.println(val);
            int foo = Integer.parseInt(val);
            mybyte[idx] = (byte) foo;
            idx++;
        }
        return mybyte;
    }
        
    }  
