package ServletPackage;

import dao.Dao;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import tools.MyTools;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "Personal", urlPatterns = {"/Personal"})
public class Personal extends HttpServlet {

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        JSONObject jsonObject = MyTools.getJSONObject(request);
        String action = jsonObject.getString("action");
        String name = jsonObject.getString("name");
        switch (action){
            case "history":
                out.println(queryHistory(name));
                break;
            case "personal":
                out.println(queryPersonal(name));
                break;
            case "cartNum":
                out.println(queryCartNum(name));
                break;
            default:
                break;
        }
        out.close();
    }

    private JSONArray queryHistory(String name){
        JSONArray jsonArray = new JSONArray();
        if(Dao.queryHistory(jsonArray, name))
            return jsonArray;
        else
            return null;
    }

    private JSONObject queryPersonal(String name){
        JSONObject jsonObject = new JSONObject();
        if(Dao.queryPersonal(jsonObject, name))
            return jsonObject;
        else
            return null;
    }

    private JSONObject queryCartNum(String name){
        JSONObject jsonObject = new JSONObject();
        String num = Dao.cartQuery(name);
        jsonObject.put("cartCount",num);
        System.out.println(num);
        return jsonObject;
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
