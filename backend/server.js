const express = require("express");
const cors = require("cors");
const validator = require("validator");
const pool = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/*
  ADD LEAD
*/
app.post("/leads", async (req, res) => {
  try {
    let { name, phone, source } = req.body;

    // Trim
    name = name?.trim();
    phone = phone?.trim();

    // Required validation
    if (!name || !phone || !source) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Name validation
    if (name.length < 3) {
      return res.status(400).json({
        error: "Name must be at least 3 characters",
      });
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: "Invalid phone number",
      });
    }

    // Source validation
    const allowedSources = [
      "Call",
      "WhatsApp",
      "Field",
    ];

    if (!allowedSources.includes(source)) {
      return res.status(400).json({
        error: "Invalid source",
      });
    }

    const result = await pool.query(
      `INSERT INTO leads (name, phone, source)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, phone, source]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/*
  GET ALL LEADS
*/
app.get("/leads", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM leads ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

/*
  UPDATE STATUS
*/
app.put("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "Interested",
      "Not Interested",
      "Converted",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    const result = await pool.query(
      `UPDATE leads
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/*
  DELETE LEAD
*/
app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM leads WHERE id = $1",
      [id]
    );

    res.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});