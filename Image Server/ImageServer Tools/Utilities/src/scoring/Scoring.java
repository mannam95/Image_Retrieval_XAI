/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scoring;

import com.google.gson.annotations.Expose;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import models.Score;

/**
 *
 * @author SUBHAJIT
 */

class Scoring_Serialise
{
    @Expose(serialize = true)
    public Collection<Score> topScores;
    @Expose(serialize = true)
    Score QueryImgDetails;
    
    public Scoring_Serialise(Score QueryImgDetails, HashMap<String, Score> topScores)
    {
        this.QueryImgDetails = QueryImgDetails;
        this.topScores = topScores.values();
    }
}

public class Scoring {
    
    @Expose(serialize = true)
    public HashMap<String, Score> topScores;
    @Expose(serialize = true)
    Score QueryImgDetails;
    
    
    int max_elemets;

    float max = -1;
    Score max_elem = null;

    public Scoring(int max, Score QueryImgDetails) {
        topScores = new HashMap<>(max);
        max_elemets = max;
        this.QueryImgDetails = QueryImgDetails;
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
    
    
    public static Object serialiseObj(Scoring sc)
    {
        sc.QueryImgDetails.addVectorToCategorised();
        sc.topScores.entrySet().forEach((entry) -> {  
            entry.getValue().addVectorToCategorised();
        });
        return new Scoring_Serialise(sc.QueryImgDetails, sc.topScores);
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
