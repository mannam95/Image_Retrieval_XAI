/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package highlevelsemanticfeatureextractor;

import IRTEX_Exception.IRTEX_Exception;
import highlevelsemanticfeaturehandler.HighLevelSemanticFeatureHandler;
import java.util.Scanner;

/**
 *
 * @author SUBHAJIT
 */
public class HighLevelSemanticFeatureExtractor {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        if(args.length!=3)
        {
            Scanner sc = new Scanner(System.in);
            args = new String[3];
            System.out.println("Please enter the path where the dictionary is to be written");
            args[0] = sc.nextLine();
            System.out.println("Please enter the path where the images are located");
            args[1] = sc.nextLine();
            System.out.println("Please enter the URL for High Level Semantic Feature");
            args[2] = sc.nextLine();
        }
        try {
            HighLevelSemanticFeatureHandler.extract_n_write(args[0], args[1], args[2]);
        } catch (IRTEX_Exception ex) {
            System.out.println(ex.getMessage());
            
        }
    }
    
}
