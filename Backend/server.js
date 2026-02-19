const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// CREATE
app.post("/students/save", async (req, res) => {
  const { name, city, mob } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO stud (name, city, mob) VALUES ($1, $2, $3) RETURNING *",
      [name, city, mob]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ALL
app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stud ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
app.get("/students/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM stud WHERE id = $1",
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/students/updt/:id", async (req, res) => {
  const { name, city, mob } = req.body;

  try {
    const result = await pool.query(
      "UPDATE stud SET name=$1, city=$2, mob=$3 WHERE id=$4 RETURNING *",
      [name, city, mob, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/students/dlt/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM stud WHERE id=$1",
      [req.params.id]
    );

    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
