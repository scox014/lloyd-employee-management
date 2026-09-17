const sql = require("mssql/msnodesqlv8");

const dbConfig = {
    server: "(localdb)\\MSSQLLocalDB",
    database: "LloydEmployeeDB",
    driver: "ODBC Driver 18 for SQL Server",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then((pool) => {
        console.log("Connected to SQL Server LocalDB");
        return pool;
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        throw error;
    });

module.exports = {
    sql,
    poolPromise,
};