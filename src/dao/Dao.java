package dao;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import tools.MySQLHelper;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

public class Dao {

    //注册一个用户
    public static boolean register(String name, String password) {
        String sql = String.format("insert into userTable " +
                        "(`name`, `password`, `state`) values ('%s','%s','0');",
                name, password);
        System.out.println(sql);
        MySQLHelper mySQLHelper = new MySQLHelper();
        boolean flag = false;
        if (mySQLHelper.connect()) {
            //返回值为1，则成功，否则失败
            flag = mySQLHelper.insert(sql) == 1;
            mySQLHelper.close();
        }
        return flag;
    }

    //已注册用户登录
    public static boolean login(String name, String password) {
        String sql = String.format("select * from userTable " +
                "where name = '%s' and password = '%s';", name, password);
        System.out.println(sql);
        MySQLHelper mySQLHelper = new MySQLHelper();
        ResultSet resultSet;
        if (mySQLHelper.connect()) {
            resultSet = mySQLHelper.query(sql);
            try {
                if (resultSet.next()) {
                    //登陆成功
                    return true;
                }

            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                mySQLHelper.close();
            }
        }
        return false;
    }

    //查询商品
    public static boolean loadMain(JSONArray jsonArray) {
        String sql = "select * from goods order by catId;";
        return mysqlQuery(jsonArray, sql);
    }

    //查询一个商品id
    public static boolean loadItem(JSONObject jsonObject, String id) {
        String sql = String.format("select * from goods where shopId = '%s';", id);
        MySQLHelper mySQLHelper = new MySQLHelper();
        if (mySQLHelper.connect()) {
            ResultSet set = mySQLHelper.query(sql);
            try {
                if (set.next()) {
                    ResultSetMetaData metaData = set.getMetaData();
                    int columnNum = metaData.getColumnCount();
                    for (int i = 1; i <= columnNum; i++) {
                        String columnLabel = metaData.getColumnLabel(i);
                        String value = set.getString(columnLabel);
                        jsonObject.put(columnLabel, value);
                    }
                    return true;
                } else {
                    return false;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                mySQLHelper.close();
            }
        }
        return false;
    }

    //购买一个商品
    public static boolean buyItem(String shopId, String userName, String num) {
        String sql = String.format("select shopPrice from goods where shopId = '%s';", shopId);
        MySQLHelper mySQLHelper = new MySQLHelper();
        if (mySQLHelper.connect()) {
            ResultSet set = mySQLHelper.query(sql);
            try {
                sql = String.format("select userId from userTable where name='%s'", userName);
                ResultSet userSet = mySQLHelper.query(sql);
                String userId;
                if (userSet.next()) {
                    userId = userSet.getString(1);
                    if (set.next()) {
                        String price = set.getString("shopPrice");
                        if (price != null) {
                            String total = String.valueOf(Integer.valueOf(price) * Integer.valueOf(num));
                            sql = String.format("insert into `order` (shopId,userId,totalMoney) values " +
                                    "('%s','%s','%s');", shopId, userId, total);
                            int res = mySQLHelper.insert(sql);
                            if (res > 0) {
                                mysqlUpdate(shopId, num);
                                return true;
                            }
                        }
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                mySQLHelper.close();
            }
        }
        return false;
    }

    //加入购物车
    public static boolean addItem(String shopId, String userName, String num) {
        String sql = String.format("select userId from userTable where name='%s'", userName);
        String userId;
        MySQLHelper mySQLHelper = new MySQLHelper();
        if (mySQLHelper.connect()) {
            try {
                ResultSet set = mySQLHelper.query(sql);
                if (set.next()) {
                    userId = set.getString(1);
                    sql = String.format("insert into cart (shopId,userId,goodNum) values " +
                            "('%s','%s','%s');", shopId, userId, num);
                    int count = mySQLHelper.insert(sql);
                    if (count > 0) {
                        return true;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                mySQLHelper.close();
            }
        }
        return false;
    }

    //查询购物车内的商品
    public static boolean loadCart(JSONArray jsonArray, String name) {
        String sql = String.format(
                "select DISTINCT goods.shopId,name,shopPrice,img,title,goodNum" +
                        " from goods,cart where goods.shopId in (" +
                        "select shopId from cart where userId in (" +
                        "select userId from userTable where name = '%s'));", name);
        return mysqlQuery(jsonArray, sql);
    }

    //辅助查询工具
    private static boolean mysqlQuery(JSONArray jsonArray, String sql) {
        MySQLHelper mySQLHelper = new MySQLHelper();
        if (mySQLHelper.connect()) {
            ResultSet set = mySQLHelper.query(sql);
            try {
                ResultSetMetaData metaData = set.getMetaData();
                int columnCount = metaData.getColumnCount();
                while (set.next()) {
                    JSONObject object = new JSONObject();

                    for (int i = 1; i <= columnCount; i++) {
                        String columnLabel = metaData.getColumnLabel(i);
                        String value = set.getString(columnLabel);
                        object.put(columnLabel, value);
                    }
                    jsonArray.add(object);
                }
                JSONObject success = new JSONObject();
                success.put("load", "true");
                jsonArray.add(success);
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                mySQLHelper.close();
            }
        }
        return false;
    }

    //辅助更新工具（更新商品数量）
    private static boolean mysqlUpdate(String shopId, String num) {
        MySQLHelper mySQLHelper = new MySQLHelper();
        String sql = String.format("select stocks from goods where shopId='%s';", shopId);
        if (mySQLHelper.connect()) {
            ResultSet set = mySQLHelper.query(sql);
            try {
                if (set.next()) {
                    String oldNum = set.getString(1);
                    String newNum = String.valueOf(Integer.parseInt(oldNum) - Integer.parseInt(num));
                    sql = String.format("update goods set stocks='%s' where shopId='%s'", newNum, shopId);
                    mySQLHelper.insert(sql);
                    mySQLHelper.close();
                    return true;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    //查询cart数量
    public static String cartQuery(String userName){
        String sql = String.format("select count(*) from cart where userId = (select userId from userTable" +
                " where name = '%s');",userName);
        MySQLHelper mySQLHelper = new MySQLHelper();
        if(mySQLHelper.connect()){
            ResultSet set = mySQLHelper.query(sql);
            try {
                if(set.next()){
                    sql = set.getString(1);
                    return sql;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    public static boolean addCartItem(String id, String name, String num) {
        String sql = String.format("select userId from userTable where " +
                "`name` = '%s'", name);
        MySQLHelper mySQLHelper = new MySQLHelper();
        if (mySQLHelper.connect()) {
            try {
                String userId = mySQLHelper.query(sql).getString("userId");
                sql = String.format("insert into cart (userId,shopId,goodNum) " +
                        "values ('%s','%s','%s')", userId, id, num);
                mySQLHelper.insert(sql);
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                mySQLHelper.close();
            }

        }
        return false;
    }

    public static boolean buyCartItems(String[] idArray, String name) {
        StringBuilder shopId = new StringBuilder();
        for (String anIdArray : idArray) {
            shopId.append("'").append(anIdArray).append("',");
        }
        shopId.deleteCharAt(shopId.length() - 1);
        String sql = String.format("SELECT * FROM cart where userId in(" +
                "SELECT userId FROM userTable WHERE `name` = '%s')" +
                " AND shopId in (%s);", name, shopId.toString());
        MySQLHelper mySQLHelper = new MySQLHelper();
        if (mySQLHelper.connect()) {
            ResultSet set = mySQLHelper.query(sql);
            System.out.println(sql);
            //从购物车删除，添加到order中
            try {
                while (set.next()) {
                    String userID = set.getString("userId");
                    String shopID = set.getString("shopId");
                    sql = String.format("select shopPrice from goods where " +
                            "shopId = '%s';", shopID);
                    System.out.println(sql);
                    ResultSet shopSet = mySQLHelper.query(sql);
                    shopSet.next();
                    int price = Integer.parseInt(shopSet.getString("shopPrice"));
                    String num = set.getString("goodNum");
                    int total = price * Integer.parseInt(num);
                    sql = String.format("insert into `order` (shopId,userId,totalMoney) " +
                                    "values ('%s','%s','%s')",
                            shopID, userID, String.valueOf(total));
                    mySQLHelper.insert(sql);
                    mysqlUpdate(shopID, num);
                }
                delCartItems(idArray, name);
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                mySQLHelper.close();
            }
        }
        return false;
    }

    public static boolean delCartItems(String[] idArray, String name) {
        StringBuilder shopId = new StringBuilder();
        for (String anIdArray : idArray) {
            shopId.append("'").append(anIdArray).append("',");
        }
        shopId.deleteCharAt(shopId.length() - 1);
        MySQLHelper mySQLHelper = new MySQLHelper();
        if (mySQLHelper.connect()) {
            String sql = String.format(
                    "DELETE FROM cart where userId in(" +
                            "SELECT userId FROM userTable WHERE `name` = '%s')" +
                            " AND shopId in (%s);", name, shopId.toString());
            mySQLHelper.delete(sql);
            mySQLHelper.close();
            return true;
        }
        return false;
    }

    public static boolean queryHistory(JSONArray jsonArray, String name) {
        String sql = String.format("SELECT orderId,`order`.shopId,img,title,shopPrice,totalMoney " +
                "FROM goods,`order` " +
                "WHERE userId IN (SELECT userId FROM userTable WHERE `name` = '%s') " +
                "AND goods.shopId = `order`.shopId;", name);
        if (mysqlQuery(jsonArray, sql))
            return true;

        jsonArray.clear();
        jsonArray.add(new JSONObject().put("load", "false"));
        return false;
    }

    public static boolean queryPersonal(JSONObject jsonObject, String name) {
        String sql = String.format("select * from userTable where name='%s'", name);
        MySQLHelper mySQLHelper = new MySQLHelper();
        if (mySQLHelper.connect()) {
            ResultSet set = mySQLHelper.query(sql);
            try {
                ResultSetMetaData metaData = set.getMetaData();
                int columnCount = metaData.getColumnCount();
                if (set.next()) {
                    for (int i = 0; i < columnCount; i++) {
                        String columnLabel = metaData.getColumnLabel(i);
                        String value = set.getString(columnLabel);
                        jsonObject.put(columnLabel, value);
                    }
                    return true;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }

        }
        jsonObject.clear();
        jsonObject.put("load", "false");
        return false;
    }
}