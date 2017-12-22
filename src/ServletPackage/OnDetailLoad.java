package ServletPackage;

import dao.Dao;
import net.sf.json.JSON;
import net.sf.json.JSONObject;
import tools.MyTools;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "OnDetailLoad", urlPatterns = {"/OnDetailLoad"})
public class OnDetailLoad extends HttpServlet {

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        JSONObject jsonObject = MyTools.getJSONObject(request);
        String shopId = jsonObject.getString("shopId");
        String action = jsonObject.getString("action");
        String userid;
        String num;
        switch (action){
            case "initialize":
                jsonObject = onInitialize(shopId);
                break;
            case "buy":
                userid = jsonObject.getString("userName");
                num = jsonObject.getString("count");
                jsonObject = onBuy(shopId,userid,num);
                break;
            case "add":
                userid = jsonObject.getString("userName");
                num = jsonObject.getString("count");
                jsonObject = onAdd(shopId, userid,num);
                break;
        }
        out.println(jsonObject);
        out.close();
    }

    private JSONObject onInitialize(String id){
        JSONObject jsonObject = new JSONObject();
        if(!Dao.loadItem(jsonObject,id)){
            jsonObject.put("load","false");
        }
        return jsonObject;
    }

    private JSONObject onBuy(String shopId, String userName, String num){
        JSONObject jsonObject = new JSONObject();
        if(!Dao.buyItem(shopId, userName, num)){
            jsonObject.put("load", "false");
        }
        return jsonObject;
    }

    private JSONObject onAdd(String shopId, String userName, String num){
        JSONObject jsonObject = new JSONObject();
        if(!Dao.addItem(shopId, userName, num)){
            jsonObject.put("load", "false");
        }
        return jsonObject;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
