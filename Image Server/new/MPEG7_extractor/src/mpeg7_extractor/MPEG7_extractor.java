/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mpeg7_extractor;

import generate_dict.createimagedict;
import java.io.IOException;
import java.util.ArrayList;
import org.json.simple.JSONObject;
import readjson.ReadJsonfile;

/**
 *
 * @author SUBHAJIT
 */
public class MPEG7_extractor {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
        createimagedict obj = new createimagedict();
        obj.getfiles("E:\\Lire-1.0b4\\testdata","E:\\Lire-1.0b4\\color_file.txt",true);
        obj.getfiles("E:\\Lire-1.0b4\\testdata","E:\\Lire-1.0b4\\shape_file.txt",false);
        
        ReadJsonfile lvrjson = new ReadJsonfile();
        ArrayList<JSONObject> lvjsonarray =new ArrayList<JSONObject>();
        lvjsonarray = lvrjson.readdictionary("E:\\Lire-1.0b4\\color_file.txt");
        JSONObject jobj = new JSONObject();
        
        for (int i = 0; i < lvjsonarray.size(); i++){
            jobj = lvjsonarray.get(i);
            System.out.println((String)jobj.get("name")+":"+
                               (String)jobj.get("vector"));
            //System.out.print(numbers.get(i) + " ");  
        }
    }
    
}
