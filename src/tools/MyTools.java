package tools;

import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class MyTools {

    public static JSONObject getJSONObject(HttpServletRequest request)
            throws ServletException, IOException {
        return getJSONObject(request, "UTF-8");
    }

    public static JSONObject getJSONObject(HttpServletRequest request, String charsetName)
            throws ServletException, IOException {
        BufferedReader br = new BufferedReader(
                new InputStreamReader(request.getInputStream(), charsetName));
        String line;
        StringBuilder sb = new StringBuilder();
        while ((line = br.readLine()) != null) {
            sb.append(line);
        }
        return JSONObject.fromObject(sb.toString());
    }


}
