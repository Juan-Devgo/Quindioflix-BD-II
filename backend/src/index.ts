import express from "express";
import oracledb from "oracledb";

const app = express();
app.use(express.json());

const {
  PORT = "3001",
  DB_HOST = "db",
  DB_PORT = "1521",
  DB_USER = "system",
  DB_PASSWORD = "Quindioflix123",
  DB_SID = "XE",
} = process.env;

const dbConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
  connectString: `${DB_HOST}:${DB_PORT}/${DB_SID}`,
};

async function testDbConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute("SELECT 1 FROM DUAL");
    console.log("Database connection successful:", result.rows);
    return true;
  } catch (err) {
    console.error("Database connection failed:", err);
    return false;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}

app.get("/", (req, res) => {
  res.json({ message: "Quindioflix API is running" });
});

app.get("/health", async (req, res) => {
  const dbHealthy = await testDbConnection();
  if (dbHealthy) {
    res.json({ status: "ok", database: "connected" });
  } else {
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

const port = Number(PORT);
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Database config: ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_SID}`);
  testDbConnection();
});
