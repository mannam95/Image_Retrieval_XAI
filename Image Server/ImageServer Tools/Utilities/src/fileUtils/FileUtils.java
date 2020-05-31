/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package fileUtils;

import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;
import IRTEX_Exception.IRTEX_Exception;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

import java.lang.reflect.Type;

/**
 *
 * @author SUBHAJIT
 */
public class FileUtils {
    public static void listf(String directoryName, ArrayList<String> images) 
    {    
        File directory = new File(directoryName);

        // get all the files from a directory
        File[] fList = directory.listFiles();
        int i=0;
        for (File file : fList) {i++;
            if (file.isFile()) {
                images.add(file.getAbsolutePath());
                //if(i==10)return;
            }
            else
            {
                listf(file.getAbsolutePath(), images);
            }
        }
    }
    
    public static void writeToFile(String fileName, String data) throws IRTEX_Exception
    {
        try {
            if(!(fileName.endsWith("/") || fileName.endsWith("\\")) ) fileName = fileName+"\\";
            File file = new File(fileName+System.currentTimeMillis()+".txt");
            if(file.exists())file.delete();
            file.createNewFile();
            FileWriter myWriter = new FileWriter(file);
            myWriter.write(data);
            myWriter.close();
        } catch (IOException e) {
            throw new IRTEX_Exception(IRTEX_Exception.errorWritingFile, e.getMessage());
          }
    }
    
    public static Object loadGsonData(Type t, String Fname) throws IRTEX_Exception
    {
        String s;
        try {
            s = new String( Files.readAllBytes(Paths.get(Fname)), StandardCharsets.UTF_8);
            return loadGsonStringData(t, s);
        } catch (IOException ex) {
            throw new IRTEX_Exception(IRTEX_Exception.errorDeserialisingFile, ex.getMessage());
        }
    }
    
    public static Object loadGsonStringData(Type t, String str) throws IRTEX_Exception
    {
        try {
            return new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create().fromJson(str, t);
        } catch (Exception ex) {
            throw new IRTEX_Exception(IRTEX_Exception.errorDeserialisingFile, ex.getMessage());
        }
    }
    
    
    public static File createFile(String fileName) throws IRTEX_Exception
    {
        
        try {
            if(!(fileName.endsWith("/") || fileName.endsWith("\\")) ) fileName = fileName+"\\";
            File file = new File(fileName+System.currentTimeMillis()+".txt");
            if(file.exists())file.delete();
            file.createNewFile();
            return file;
        } catch (IOException e) {
            throw new IRTEX_Exception(IRTEX_Exception.errorWritingFile, e.getMessage());
          }
    }
    
}
