package dao;

import tools.MySQLHelper;

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
}
