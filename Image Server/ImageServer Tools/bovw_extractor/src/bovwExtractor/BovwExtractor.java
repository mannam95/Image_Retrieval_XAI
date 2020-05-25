/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package bovwExtractor;

import IRTEX_Exception.IRTEX_Exception;
import java.util.ArrayList;
import org.opencv.core.Core;
import java.io.IOException;

import bovw.Bovw;
import java.util.Scanner;

/**
 *
 * @author SUBHAJIT
 */
public class BovwExtractor {
    
    public static void main(String[] args) throws IOException, IRTEX_Exception {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        System.loadLibrary("native_handler");
        
        int numCluster;
        if(args.length!=4)
        {
            Scanner sc = new Scanner(System.in);
            args = new String[3];
            System.out.println("Please enter the path where the background foreground dictionary is located");
            args[0] = sc.nextLine();
            System.out.println("Please enter the path where the center file is to be located");
            args[1] = sc.nextLine();
            System.out.println("Please enter the path where the bovw feature file is to be located");
            args[2] = sc.nextLine();
            System.out.println("Please enter the number of cluseters");
            numCluster = sc.nextInt();
        }
        else
        {
            numCluster = Integer.parseInt(args[3]);
        }
        
        System.out.println("loading data");
        ArrayList<Bovw> data = Bovw.load_SURF_data_with_stream(args[0]);
        System.out.println("loading data done");
        
//        System.out.println("startin matting");
//        Bovw.createMat();
//        System.out.println("ended matting");
        
        System.out.println("startin clustering");
        Bovw.cluster(numCluster);
        System.out.println("ended clustering");
        
        
//        System.out.println("serialising features");
//        
//        Bovw.serialiseBovw(args[1]);
//        
//        System.out.println("serialising features done");

        System.out.println("serialising features");
        Bovw.serialiseBovw_withDataVector_n_stream(args[1]);
        System.out.println("serialising features done");
        
        System.out.println("serialising cluser");
        
        Bovw.serialiseCluster(args[2]);
        System.out.println("serialising cluser finished");
        
//        for(int i=0; i<data.size(); i++)
//        {
//            data.get(i).getDataVector();
//        }
//        Bovw.serialiseBovw(args[1]);
    }
       
}
