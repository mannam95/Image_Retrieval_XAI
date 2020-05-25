/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utils;

import java.lang.reflect.Array;

/**
 *
 * @author SUBHAJIT
 */
public class utils {
    public static float[][] convertOneDim2TwoDim(float[] arr, int rows, int cols)
    {
        if(arr == null) return null;
        float[][] a = new float[rows][cols];// (float[][]) Array.newInstance(float.class, rows, cols);
        
        for(int i=0; i<rows; i++)
        {
            for(int j=0; j<cols; j++)
            {
                a[i][j] = arr[i*cols+j];
            }
        }
        
        return a;
    }
    
    
    public static float[] convertTwoDim2OneDim(float[][] arr, int rows, int cols)
    {
        if(arr == null) return null;
        float[] a = new float[rows*cols];//(T[]) Array.newInstance(c, rows, cols);
        
        for(int i=0; i<rows; i++)
        {
            for(int j=0; j<cols; j++)
            {
                a[i*cols+j] = arr[i][j];
            }
        }
        
        return a;
    }
}
