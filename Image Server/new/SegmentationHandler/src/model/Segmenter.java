/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.util.ArrayList;
import org.opencv.core.Mat;
import IRTEX_Exception.IRTEX_Exception;

/**
 *
 * @author SUBHAJIT
 */
public interface Segmenter {

    /**
     *
     * @param Filename
     * @return
     * @throws IRTEX_Exception
     */
    ArrayList<Mat> extract(String Filename) throws IRTEX_Exception;
}
