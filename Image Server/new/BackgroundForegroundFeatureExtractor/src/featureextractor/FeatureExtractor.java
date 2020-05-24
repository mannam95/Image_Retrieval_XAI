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
        if(args.length!=2)
        {
            Scanner sc = new Scanner(System.in);
            args = new String[2];
            System.out.println("Please enter the path where the dictionary is to be written");
            args[0] = sc.nextLine();
            System.out.println("Please enter the path where the images are located");
            args[1] = sc.nextLine();
        }
        try {
            BackgroundForegroundHandler.extract_n_write(args[0], args[1]);
        } catch (IRTEX_Exception ex) {
            System.out.println(ex.getMessage());
            
        }
    }
    
}
