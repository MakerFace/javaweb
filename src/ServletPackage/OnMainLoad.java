package ServletPackage;

import dao.Dao;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "OnMainLoad", urlPatterns = {"/OnMainLoad"})
public class OnMainLoad extends HttpServlet {

    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //查询数据库，返回json格式文件
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        JSONArray jsonArray = new JSONArray();
        if(Dao.loadMain(jsonArray)){
            out.println(jsonArray);
        }
        else {
            JSONObject json = new JSONObject();
            json.put("load","false");
            jsonArray.add(json);
            out.println(jsonArray);
        }
        out.close();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
