package utils;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author SUBHAJIT
 */

import java.lang.reflect.Array;


public class utils<T> {
    public T[][] convertOneDim2TwoDim(Class c, T[] arr, int rows, int cols)
    {
        if(arr == null) return null;
        @SuppressWarnings("unchecked")
        final T[][] a = (T[][]) Array.newInstance(c, rows, cols);
        
        for(int i=0; i<rows; i++)
        {
            for(int j=0; j<cols; j++)
            {
                a[i][j] = arr[i*cols+j];
            }
        }
        
        return a;
    }
}
