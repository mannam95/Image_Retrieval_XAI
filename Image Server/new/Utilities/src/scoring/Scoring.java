/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scoring;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import models.Score;

/**
 *
 * @author SUBHAJIT
 */
public class Scoring {

    public HashMap<String, Score> topScores;
    int max_elemets;

    float max = -1;
    Score max_elem = null;

    public Scoring(int max) {
        topScores = new HashMap<>(max);
        max_elemets = max;
    }

    void findMax() {
        for (Map.Entry<String, Score> entry : topScores.entrySet()) {
            if (max == -1 || entry.getValue().overallScore > max) {
                max_elem = entry.getValue();
                max = max_elem.overallScore;
            }
        }

    }

    public Score add(Score sc) {
        sc.overallScore = sc.average + sc.cldScore + sc.ehdScore;
        
        
        if (topScores.containsKey(sc.name)) {
            Score ad = topScores.get(sc.name);

            ad.average = sc.average;
            ad.region_scores = sc.region_scores;


            if (max == -1) {
                findMax();
            } else if (max < sc.overallScore) {
                max = sc.overallScore;
                max_elem = sc;
            }

            return ad;
        } else {

            if (topScores.size() < max_elemets) {
                topScores.put(sc.name, sc);
                if (max == -1) {
                    max = sc.overallScore;
                    max_elem = sc;
                } else if (max < sc.overallScore) {
                    max = sc.overallScore;
                    max_elem = sc;
                }
                return sc;
            } else {
                if (max == -1) {
                    max = sc.overallScore;
                    max_elem = sc;
                    topScores.put(sc.name, sc);
                    return sc;
                } else if (sc.overallScore < max)//if new object has less distance
                {
                    topScores.remove(max_elem.name);
                    topScores.put(sc.name, sc);
                    max = -1;
                    findMax();
                    return sc;
                }
            }
        }

        return null;
    }

//    static int comparators(Score a, Score b) {
//        float c = a.average - b.average;
//        if (c == 0) {
//            return 0;
//        }
//        return c > 0 ? 1 : -1;
//    }
//
//    public void sort() {
//        topScores.entrySet().stream().sorted(HashMap.Entry.<String, Score>comparingByValue((a, b) -> comparators(a, b)));
//    }

}
