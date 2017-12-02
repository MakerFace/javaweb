package tools;

import java.sql.*;

public class MySQLHelper {
    private Connection conn = null;
    private Statement sqlStmt = null;
    private ResultSet sqlRst = null;
    private static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://localhost/javaweb?useSSL=false";
    private static final String USER = "root";
    private static final String PASSWORD = "chenqi19960917";
    private SQLException exception;

    public boolean connect() {
        try {
            Class.forName(JDBC_DRIVER);
            conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
        } catch (SQLException e) {
            System.out.println(e.toString());
            exception = e;
            return false;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return true;
    }

    public ResultSet query(String sql) {
        sqlRst = null;
        try {
            sqlStmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_READ_ONLY);
            sqlRst = sqlStmt.executeQuery(sql);
        } catch (SQLException e) {
            System.out.println(e.toString());
            exception = e;
        }
        return sqlRst;
    }

    public int insert(String sql) {
        int num = -1;
        try {
            sqlStmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                    ResultSet.CONCUR_UPDATABLE);
            num = sqlStmt.executeUpdate(sql);
        } catch (SQLException e) {
            System.out.println(e.toString());
        }
        return num;
    }

    public void close() {
        try {
            if (sqlRst != null)
                sqlRst.close();
            if (sqlStmt != null)
                sqlStmt.close();
            if (conn != null)
                conn.close();
        } catch (SQLException e) {
            exception = e;
            System.out.println(e.toString());
        }
    }
}
