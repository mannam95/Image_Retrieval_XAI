/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scoring;

import com.google.gson.annotations.Expose;
import java.util.HashMap;
import java.util.Map;
import models.Score;

/**
 *
 * @author SUBHAJIT
 */
public class scoring_original {
    
    @Expose(serialize = true)
    public HashMap<String, Score> topScores;
    @Expose(serialize = true)
    Score QueryImgDetails;
    
    
    int max_elemets;

    float max = -1;
    Score max_elem = null;

    public scoring_original(int max, Score QueryImgDetails) {
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

    public Score add(Score sc, HashMap<String, Float> weightmap) {
        if(sc.average == -1) return null;
        
        
        if (weightmap.containsKey("bf")) {
            Float f = weightmap.get("bf");
            sc.average = sc.average*f;
        }
        if (weightmap.containsKey("cld")) {
            Float f = weightmap.get("cld");
            sc.cldScore = sc.cldScore*f;
        }
        if (weightmap.containsKey("ehd")) {
            Float f = weightmap.get("ehd");
            sc.ehdScore = sc.ehdScore*f;
        }
        if (weightmap.containsKey("hlsf")) {
            Float f = weightmap.get("hlsf");
            sc.HSLFScore = sc.HSLFScore*f;
        }
        
        
        sc.overallScore = sc.average + sc.cldScore + sc.ehdScore + sc.HSLFScore;
        
        
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
    
    
    public static Object serialiseObj(Scoring sc, HashMap<String, Object> handlers)
    {
        sc.QueryImgDetails.addVectorToCategorised(handlers);
        sc.topScores.entrySet().forEach((entry) -> {  
            entry.getValue().addVectorToCategorised(handlers);
        });
        //return new Scoring_Serialise(sc.QueryImgDetails, sc.topScores);
        return null;
    }
}
