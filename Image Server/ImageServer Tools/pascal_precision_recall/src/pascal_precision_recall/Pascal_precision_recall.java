/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pascal_precision_recall;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;

/**
 *
 * @author SUBHAJIT
 */
public class Pascal_precision_recall {

    public static void listf(String directoryName, ArrayList<String> images) {
        File directory = new File(directoryName);

        // get all the files from a directory
        File[] fList = directory.listFiles();
        int i = 0;
        for (File file : fList) {
            i++;
            if (file.isFile()) {
                images.add(file.getAbsolutePath());
            } else {
                listf(file.getAbsolutePath(), images);
            }
        }
    }

    public static void loadData(HashMap<String, ArrayList<String>> fname_to_class_map, HashMap<String, ArrayList<String>> class_to_fname_map, String fname) throws Exception {
        try {
            System.out.println("loading data for " + fname);
            File inputFile = new File(fname);
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(inputFile);
            doc.getDocumentElement().normalize();
            NodeList nList = doc.getElementsByTagName("object");
            System.out.println("----------------------------");

            ArrayList<String> objects = new ArrayList();
            for (int temp = 0; temp < nList.getLength(); temp++) {
                Node nNode = nList.item(temp);
                if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element eElement = (Element) nNode;
                    String s = eElement.getElementsByTagName("name").item(0).getTextContent();
                    
                    //this is for class to fname map
                    ArrayList<String> o = class_to_fname_map.get(s);
                    if (o == null) {
                        ArrayList<String> str = new ArrayList<>();
                        str.add(fname);
                        class_to_fname_map.put(s, str);
                    } else {
                        o.add(fname);
                    }

                    //this is for fname to class map
                    objects.add(s);

                }
            }

            String filename = inputFile.getName();
            filename = FilenameUtils.removeExtension(filename);
            fname_to_class_map.put(filename, objects);

        } catch (Exception e) {
            throw e;
        }
    }

    /**
     * @param args the command line arguments
     */
    static int onCount = 10;

    public static void main(String[] args) throws Exception {

        ArrayList<String> anots = new ArrayList<>();

        listf(args[0], anots);

        HashMap<String, ArrayList<String>> fname_to_class_map = new HashMap<>(), class_to_fname_map = new HashMap<>();
        for (int i = 0; i < anots.size(); i++) {
            loadData(fname_to_class_map, class_to_fname_map, anots.get(i));
        }

        ArrayList<String> files = new ArrayList<>();

        listf(args[1], files);

        for (int i = 0; i < files.size(); i++) {
            String fname = files.get(i);
            HttpResponse<String> str = Unirest.get("http://localhost:8080/ImageServer/qbe").queryString("file", fname).asString();

            if (str == null || str.getStatus() == 500) {
                throw new Exception("status 500 on request");
            }

            int count = getRecall(fname_to_class_map, class_to_fname_map, fname, str.getBody());

            fname = new File(fname).getName();
            fname = FilenameUtils.removeExtension(fname);

            int recall_denom = 0;
            ArrayList<String> classes = fname_to_class_map.get(fname);
            for(int k = 0; k<classes.size(); k++)
            {
                String cls = classes.get(k);
                int num = class_to_fname_map.get(cls).size();
                if(num>recall_denom)
                    recall_denom = num;
            }

            if (recall_denom > onCount) {
                recall_denom = onCount;
            }
            (new stat_calc(fname, count, recall_denom, onCount)).calc(onCount);
        }

        System.out.println(stat_calc.tostring());
    }

    public static Object loadGsonStringData(Type t, String str) throws Exception {
        try {
            return new GsonBuilder().create().fromJson(str, t);
        } catch (Exception ex) {
            throw ex;
        }
    }

    public static int getRecall(HashMap<String, ArrayList<String>> fname_to_class_map, HashMap<String, ArrayList<String>> class_to_fname_map, String fname, String s) throws Exception {
        int count = 0;
        String name = new File(fname).getName();
        name = FilenameUtils.removeExtension(name);
        ArrayList<String> str = fname_to_class_map.get(name);
        Type t = new TypeToken<response>() {
        }.getType();

        response res = (response) loadGsonStringData(t, s);

        Collections.sort(res.topScores);

        for (int i = 0; i < onCount; i++) {
            String filename = res.topScores.get(i).name;
            filename = new File(filename).getName();
            filename = FilenameUtils.removeExtension(filename);
            ArrayList<String> respstr = fname_to_class_map.get(filename);
            boolean b = false;
            for (int j = 0; j < str.size(); j++) {
                if (respstr.contains(str.get(j))) {
                    b = true;
                }
                if (b) {
                    count++;
                    break;
                }
            }

        }

        return count;
    }

}

class data implements Comparable<data> {

    public String name;
    public float overallDistScore;

    @Override
    public int compareTo(data candidate) {
        return (this.overallDistScore < candidate.overallDistScore ? -1
                : (this.overallDistScore == candidate.overallDistScore ? 0 : 1));
    }
}

class response {

    public ArrayList<data> topScores;
}

class stat_calc {

    String fname;
    int count;
    int recall_count;
    float recall;
    int precision_count;
    float precision;

    static ArrayList<stat_calc> all = new ArrayList<>();

    stat_calc(String fname, int count, int recall_count, int precision_count) {
        this.fname = fname;
        this.count = count;
        this.recall_count = recall_count;
        this.precision_count = precision_count;
    }

    public void calc(int onCount) {
        if (recall_count > onCount) {
            recall_count = onCount;
        }
        if (precision_count > onCount) {
            precision_count = onCount;
        }
        precision = ((float) count) / ((float) precision_count);
        recall = ((float) count) / ((float) recall_count);

        all.add(this);
    }

    @Override
    public String toString() {
        return fname + "," + count + "," + recall_count + "," + precision_count + "," + precision + "," + recall;
    }

    public static String tostring() {
        float total_recall = 0;
        float total_precision = 0;
        StringBuilder sb = new StringBuilder();
        sb.append("file name, count, recall count, precision count, precision, recall\n");
        for (int i = 0; i < all.size(); i++) {
            stat_calc sc = all.get(i);
            sb.append(sc.toString()).append("\n");
            total_recall += sc.recall;
            total_precision += sc.precision;
        }
        total_recall = ((float) total_recall) / all.size();
        total_precision = ((float) total_precision) / all.size();
        sb.append("total recall = ").append(total_recall).append(" total precision = ").append(total_precision);
        return sb.toString();
    }
}
