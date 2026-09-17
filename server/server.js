const express = require("express");
const cors = require("cors");
const odbc = require("odbc");
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
let connection;
async function connectDatabase() {
    try {
        connection = await odbc.connect(
            "Driver={ODBC Driver 18 for SQL Server};" +
            "Server=(localdb)\\MSSQLLocalDB;" +
            "Database=LloydEmployeeDB;" +
            "Trusted_Connection=Yes;" +
            "TrustServerCertificate=Yes;"
        );

        console.log("Connected to SQL Server successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}
app.get("/", (req, res) => {
    res.send("Lloyd Employee Management API is running!");
});
// GET THE LIST OF THE ALL EMPLOYEES
app.get("/api/employees", async (req, res) => {
    try {
        const result = await connection.query(
            "SELECT * FROM Employees ORDER BY Id DESC"
        );

        res.json(result);
    } catch (error) {
        console.error("Error fetching employees:", error);

        res.status(500).json({
            message: "Error fetching employees",
            error: error.message,
        });
    }
});
// ADD AN EMPLOYEE 
app.post("/api/employees", async (req, res) => {
    try {
        const {
            EmployeeNumber,
            FirstName,
            LastName,
            Email,
            Phone,
            Department,
            Position,
            EmploymentStatus,
            DateHired,
        } = req.body;

        await connection.query(
            `INSERT INTO Employees
      (
        EmployeeNumber,
        FirstName,
        LastName,
        Email,
        Phone,
        Department,
        Position,
        EmploymentStatus,
        DateHired
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                EmployeeNumber,
                FirstName,
                LastName,
                Email,
                Phone,
                Department,
                Position,
                EmploymentStatus,
                DateHired,
            ]
        );

        res.status(201).json({
            message: "Employee added successfully",
        });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({
            message: "Error adding employee",
            error: error.message,
        });
    }
});
//update the employees
app.put("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            FirstName,
            LastName,
            Email,
            Phone,
            Department,
            Position,
            EmploymentStatus,
            DateHired,
        } = req.body;
        await connection.query(
            `UPDATE Employees
       SET
         FirstName = ?,
         LastName = ?,
         Email = ?,
         Phone = ?,
         Department = ?,
         Position = ?,
         EmploymentStatus = ?,
         DateHired = ?
       WHERE Id = ?`,
            [
                FirstName,
                LastName,
                Email,
                Phone,
                Department,
                Position,
                EmploymentStatus,
                DateHired,
                id,
            ] );

        res.json({
            message: "Employee updated successfully",
        });
    } catch (error  ) {
        console.error("Error updating employee:", error);
        res.status(500).json({
            message: "Error updating employee",
            error: error.message,
        }); }
});
// DELETE AN EMPLOYEE  
app.delete("/api/employees/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await connection.query(
            "DELETE FROM Employees WHERE Id = ?",
            [id]
        );
        res.json({
            message: "Employee deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({
            message: "Error deleting employee",
            error: error.message,
        }); }
});
// LOGIN
app.post("/api/login", async (req, res) => {
    try {
        const { Username, Password } = req.body;
        if (!Username || !Password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }
        const result = await connection.query(
            `SELECT Id, Username
       FROM Users
       WHERE Username = ? AND PasswordHash = ?`,
            [Username, Password]
        );
        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }
        res.json({
            message: "Login successful",
            user: result[0],
        });
    } catch (error) {
        console.error("Error during login:", error);

        res.status(500).json({
            message: "Login failed",
            error: error.message,
        }); }
});
app.listen(PORT, async () => {
    console.log(`Server running at http://localhost:${PORT}`);
    await connectDatabase();
});
