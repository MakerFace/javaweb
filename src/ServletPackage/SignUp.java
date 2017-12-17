package ServletPackage;

import dao.Dao;
import net.sf.json.JSON;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;

import tools.MyTools;

@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        JSONObject jsonObject = MyTools.getJSONObject(request);
        String name = jsonObject.getString("name");
        String password = jsonObject.getString("password");

        jsonObject.clear();
        //查询数据库，返回json数据
        if (Dao.register(name, password)) {
            //注册成功
            jsonObject.put("register", "login.html");
        } else {
            //注册失败
            jsonObject.put("register", "false");
        }
        out.println(jsonObject);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
