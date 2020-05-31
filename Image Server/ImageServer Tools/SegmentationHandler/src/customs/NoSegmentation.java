/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package customs;

import IRTEX_Exception.IRTEX_Exception;
import java.util.ArrayList;
import model.Segmenter;
import org.opencv.core.Mat;

/**
 *
 * @author SUBHAJIT
 */
public class NoSegmentation implements Segmenter{

    @Override
    public ArrayList<Mat> extract(String Filename) throws IRTEX_Exception {
        ArrayList<Mat> arr = new ArrayList<>(1);
        arr.add(new Mat());
        return arr;
    }
    
}
