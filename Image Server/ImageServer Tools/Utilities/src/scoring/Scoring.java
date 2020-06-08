/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package scoring;

import com.google.gson.annotations.Expose;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import models.Score;

/**
 *
 * @author SUBHAJIT
 */
class Scoring_Serialise {

    @Expose(serialize = true)
    public Collection<Score> topScores;
    @Expose(serialize = true)
    Score QueryImgDetails;
    @Expose(deserialize = true)
    public float[] classification_result;
    @Expose(deserialize = true)
    public ArrayList<String> classification_names;

    public Scoring_Serialise(Score QueryImgDetails, HashMap<String, Score> topScores, float[] classification_result, ArrayList<String> classification_names) {
        this.QueryImgDetails = QueryImgDetails;
        this.topScores = topScores.values();
        this.classification_result = classification_result;
        this.classification_names = classification_names;
    }
}

public class Scoring {

    @Expose(serialize = true)
    public HashMap<String, Score> topScores;
    public HashMap<String, Score> non_topScores;
    @Expose(serialize = true)
    Score QueryImgDetails;

    HashMap<String, Float> weightmap;

    int max_elemets;

    float max = -1;
    Score max_elem = null;
    
    @Expose(deserialize = true)
    public float[] classification_result;
    
    
    @Expose(deserialize = true)
    public ArrayList<String> classification_names;

    public Scoring(int max, Score QueryImgDetails, HashMap<String, Float> weightmap) {
        topScores = new HashMap<>(max);
        non_topScores = new HashMap<>(max * 50);
        max_elemets = max;
        this.QueryImgDetails = QueryImgDetails;
        this.weightmap = weightmap;
    }

    void findMax() {
        for (Map.Entry<String, Score> entry : topScores.entrySet()) {
            if (max == -1 || entry.getValue().overallScore > max) {
                max_elem = entry.getValue();
                max = max_elem.overallScore;
            }
        }

    }
    
    //ArrayList<Object> total_came= new ArrayList<>();
    
    public Score add(Score sc) {
        //total_came.add(sc);
        if (sc.average == -1) {
            return null;
        }

        if (weightmap.containsKey("bf")) {
            Float f = weightmap.get("bf");
            sc.average = sc.average * f;
        }
        if (weightmap.containsKey("cld")) {
            Float f = weightmap.get("cld");
            sc.cldScore = sc.cldScore * f;
        }
        if (weightmap.containsKey("ehd")) {
            Float f = weightmap.get("ehd");
            sc.ehdScore = sc.ehdScore * f;
        }
        if (weightmap.containsKey("hlsf")) {
            Float f = weightmap.get("hlsf");
            sc.HSLFScore = sc.HSLFScore * f;
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
                    non_topScores.put(max_elem.name, topScores.get(max_elem.name));
                    topScores.remove(max_elem.name);
                    topScores.put(sc.name, sc);
                    max = -1;
                    findMax();
                    return sc;
                }
                else
                {
                    non_topScores.put(sc.name, sc);
                }
            }
        }

        return null;
    }

    public static Object serialiseObj(Scoring sc, HashMap<String, Object> handlers) {
        sc.QueryImgDetails.addVectorToCategorised(handlers);
        sc.topScores.entrySet().forEach((entry) -> {
            entry.getValue().addVectorToCategorised(handlers);
        });
        return new Scoring_Serialise(sc.QueryImgDetails, sc.topScores, sc.classification_result, sc.classification_names);
    }
    
    
    public ArrayList<Integer> classification;
    public ArrayList<ArrayList<Float>> xval;

    public void getClassificationData() {
        classification = new ArrayList(topScores.size() + non_topScores.size());

        for (int i = 0; i < topScores.size(); i++) {
            classification.add(1);
        }

        for (int i = 0; i < non_topScores.size(); i++) {
            classification.add(0);
        }

        xval = new ArrayList<>(topScores.size() + non_topScores.size());

        Collection<Score> val = topScores.values();
        Iterator<Score> iterator = val.iterator();
        
        while(iterator.hasNext())
        {
            Score sc = iterator.next();
            ArrayList<Float> row = new ArrayList();
            
            if (weightmap.containsKey("bf")) {
                row.add(sc.average);
            }
            if (weightmap.containsKey("cld")) {
                row.add(sc.cldScore);
            }
            if (weightmap.containsKey("ehd")) {
                row.add(sc.ehdScore);
            }
            if (weightmap.containsKey("hlsf")) {
                row.add(sc.HSLFScore);
            }
            xval.add(row);
        }
        
        val = non_topScores.values();
        iterator = val.iterator();
        
        while(iterator.hasNext())
        {
            Score sc = iterator.next();
            ArrayList<Float> row = new ArrayList();
            
            if (weightmap.containsKey("bf")) {
                row.add(sc.average);
            }
            if (weightmap.containsKey("cld")) {
                row.add(sc.cldScore);
            }
            if (weightmap.containsKey("ehd")) {
                row.add(sc.ehdScore);
            }
            if (weightmap.containsKey("hlsf")) {
                row.add(sc.HSLFScore);
            }
            
            xval.add(row);
        }
    }

}


