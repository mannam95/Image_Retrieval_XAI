/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package INTEX_exceptions;

import java.util.ArrayList;

/**
 *
 * @author SUBHAJIT
 */
public class IRTEX_Exception extends Exception {
    private static ArrayList<String> messages = new ArrayList<>();
    private static String exceptionFormat = "{\"code\":%d, \"message\":\"%s\"}";
    private static String exceptionFormatWithComment = "{\"code\":%d, \"message\":\"%s\", \"comment\":\"%s\"}";
    
    public static int notInstanceOfSameTypeCode = 1;
    
    {
        messages.add("The supplied parameter is not anstanceof same kind");
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
