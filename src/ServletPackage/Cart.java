package ServletPackage;

import dao.Dao;
import net.sf.json.JSON;
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

@WebServlet(name = "Cart", urlPatterns = {"/Cart"})
public class Cart extends HttpServlet {

    private void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        JSONObject jsonObject = MyTools.getJSONObject(request);
        String action = jsonObject.getString("action");
        String userName = jsonObject.getString("name");
        String ids;
        boolean flag = true;
        switch (action) {
            case "initialize":
                out.println(onInitialize(userName));
                out.close();
                return;
            case "add":
                String shopId = jsonObject.getString("shopId");
                String num = jsonObject.getString("num");
                flag = Dao.addCartItem(shopId,userName,num);
                break;
            case "buy":
                ids = jsonObject.getString("id");
                flag = onBuy(ids, userName);
                break;
            case "del":
                ids = jsonObject.getString("id");
                flag = onDel(ids, userName);
                break;
            default:
                flag = false;
                break;
        }
        jsonObject.clear();
        if(flag)
            jsonObject.put("action","true");
        else
            jsonObject.put("action","false");
        out.println(jsonObject);
        out.close();
    }

    private JSONArray onInitialize(String userName) {

        JSONArray jsonArray = new JSONArray();
        //购物车内没有信息
        if (!Dao.loadCart(jsonArray, userName)) {
            jsonArray.add(new JSONObject().put("load", "false"));
        }

        return jsonArray;
    }

    private boolean onBuy(String ids, String userName) {
        String[] idArray = ids.split(",");
        return Dao.buyCartItems(idArray, userName);
    }

    private boolean onDel(String ids, String userName) {
        String[] idArray = ids.split(",");
        return Dao.delCartItems(idArray,userName);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        processRequest(request, response);
    }
}
