package ServletPackage;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.util.Enumeration;

import net.sf.json.*;

@WebServlet(name = "Test", urlPatterns = {"/Test"})
public class Test extends HttpServlet {

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");
        Enumeration e = request.getParameterNames();
        PrintWriter out = response.getWriter();
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonObject = new JSONObject();
        while (e.hasMoreElements()) {
            String name = (String) e.nextElement();
            String value = request.getParameter(name);
            //上一次的键值对在下次循环开始前清空
            jsonObject.put(name, value);
            jsonArray.add(jsonObject);
            jsonObject.clear();
        }
        out.println(jsonArray);
        out.close();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
