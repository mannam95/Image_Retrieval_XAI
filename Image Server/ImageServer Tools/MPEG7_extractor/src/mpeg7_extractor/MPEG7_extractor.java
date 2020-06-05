/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mpeg7_extractor;

import generate_dict.createimagedict;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;
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
    public static void main(String[] args) throws Exception {
        if(args.length!=4)
        {
            Scanner sc = new Scanner(System.in);
            args = new String[4];
            System.out.println("Please enter the path where the images are located");
            args[0] = sc.nextLine();
            System.out.println("Please enter the path where the cld dictionary is to be written");
            args[1] = sc.nextLine();
            System.out.println("Please enter the path where the ehd dictionary is to be written");
            args[2] = sc.nextLine();
            System.out.println("Please enter the url for color semantic data");
            args[3] = sc.nextLine();
        }
        
        
        createimagedict obj = new createimagedict();
        obj.getfiles(args[0],args[1],args[3],true);
        obj.getfiles(args[0],args[2],null, false);
        
//        ReadJsonfile lvrjson = new ReadJsonfile();
//        ArrayList<JSONObject> lvjsonarray =new ArrayList<JSONObject>();
//        lvjsonarray = lvrjson.readdictionary("E:\\Lire-1.0b4\\color_file.txt");
//        JSONObject jobj = new JSONObject();
//        
//        for (int i = 0; i < lvjsonarray.size(); i++){
//            jobj = lvjsonarray.get(i);
//            System.out.println((String)jobj.get("name")+":"+
//                               (String)jobj.get("vector"));
//            //System.out.print(numbers.get(i) + " ");  
//        }
    }
    
}
