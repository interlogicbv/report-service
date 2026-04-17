import * as sql from "mssql";
import * as dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const pool = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to the database");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    throw err;
  });
