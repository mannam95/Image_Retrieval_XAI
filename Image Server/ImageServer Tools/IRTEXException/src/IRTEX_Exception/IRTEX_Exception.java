/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package IRTEX_Exception;

import java.util.ArrayList;

/**
 *
 * @author SUBHAJIT
 */
public class IRTEX_Exception extends Exception {
    private static ArrayList<String> messages = new ArrayList<>();
    private static String exceptionFormat = "{\"code\":%d, \"message\":\"%s\"}";
    private static String exceptionFormatWithComment = "{\"code\":%d, \"message\":\"%s\", \"comment\":\"%s\"}";
    
    private int last = 4;
    
    public static int notInstanceOfSameTypeCode = 1;
    
    
    //segmentation related exceptions
    public static int segmentationException = 2;
    
    
    //bovw related
    public static int KCentersNotInitException = 3;
    
    //write to file errors utils
    public static int errorWritingFile = 4;
    public static int errorDeserialisingFile = 5;
    
    
    public static int ArrayNull = 6;
    
    
    public static int HighLevelFeatureExtractionFailure = 7;
    
    public static int URLException = 8;
    
    public static int FileNotFoundException = 9;
    public static int IOException = 10;
    
    public static int ColorSemanticInformationExtractionException = 11;
    
    
    
    {
        messages.add("The supplied parameter is not anstanceof same kind");
        
        
        //segmentation related exceptions
        messages.add("Internal Segemntation Exception");
        
        
        //bovw related exceptions
        messages.add("Centroids are not initialised");
        
        //write to file errors utils
        messages.add("Error Writing FIle");
        messages.add("Error Deserialising FIle");
        messages.add("Error array null");
        messages.add("cannot extract high level semantic feature");
        messages.add("URL either null or not valid");
        
        messages.add("File not Found");
        messages.add("Input Output Exception");
        
        messages.add("Exception while trying to extract color semantic information");
        
    }
    
    
    public IRTEX_Exception(int code)
    {
        super(String.format(exceptionFormat, code, messages.get(code-1)));
    }
    
    public IRTEX_Exception(int code, String comments)
    {
        super(String.format(exceptionFormatWithComment, code, messages.get(code-1), comments));
    }
}
