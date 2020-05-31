/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package segmentationtest;

import IRTEX_Exception.IRTEX_Exception;
import customs.SemanticSegmentation;
import org.opencv.core.Core;

/**
 *
 * @author SUBHAJIT
 */
public class SegmentationTest {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IRTEX_Exception {
        
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
        new SemanticSegmentation("http://127.0.0.1:5000", "D:\\dke\\2ND SEM\\IRTEX\\R&D\\semantic segmentation\\tmp").extract("D:\\dke\\2ND SEM\\IRTEX\\R&D\\semantic segmentation\\2007_000027.jpg");
    }
    
}
