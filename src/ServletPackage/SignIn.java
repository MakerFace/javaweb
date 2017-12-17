package ServletPackage;

import dao.Dao;
import net.sf.json.JSONObject;
import tools.MyTools;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "SignIn", urlPatterns = {"SignIn"})
public class SignIn extends HttpServlet {

    private void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        JSONObject jsonObject = MyTools.getJSONObject(request);
        String name = jsonObject.getString("name");
        String password = jsonObject.getString("password");

        jsonObject.clear();
        if (Dao.login(name, password)) {
            jsonObject.put("login", "index.html");
        } else {
            jsonObject.put("login", "false");
        }
        out.println(jsonObject);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws javax.servlet.ServletException, IOException {
        processRequest(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws javax.servlet.ServletException, IOException {
        processRequest(request, response);
    }
}
