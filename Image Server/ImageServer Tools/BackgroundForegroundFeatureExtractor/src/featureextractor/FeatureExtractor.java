/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package featureextractor;

import IRTEX_Exception.IRTEX_Exception;
import backgroundForegroundHandler.BackgroundForegroundHandler;
import java.io.IOException;
import java.util.Scanner;
import org.opencv.core.Core;

/**
 *
 * @author SUBHAJIT
 */
public class FeatureExtractor {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        if(args.length!=5)
        {
            Scanner sc = new Scanner(System.in);
            args = new String[5];
            System.out.println("Please enter the path where the dictionary is to be written");
            args[0] = sc.nextLine();
            System.out.println("Please enter the path where the images are located");
            args[1] = sc.nextLine();
            System.out.println("Please enter the working directory");
            args[2] = sc.nextLine();
            System.out.println("Please enter the URL for Semantic segmentation");
            args[3] = sc.nextLine();
            System.out.println("Please enter the segmentation algo");
            args[4] = sc.nextLine();
        }
        try {
            BackgroundForegroundHandler.extract_n_write(args[0], args[1], args[2], args[3], args[4]);
        } catch (IRTEX_Exception ex) {
            System.out.println(ex.getMessage());
            
        }
    }
    
}
