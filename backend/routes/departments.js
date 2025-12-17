const express = require("express");
const router = express.Router();
const { pool } = require("../config/dbConfig");

router.get("/add", (req, res) => {
  res.render("departments");
});

router.post("/add", async (req, res) => {
  let { department_name } = req.body;
  let errors = [];

  if (!department_name) {
    errors.push({ message: "Please enter department name" });
  }

  if (errors.length > 0) {
    return res.render("departments", { errors });
  }

  pool.query(
    `SELECT * FROM departments WHERE department_name = $1`,
    [department_name],
    (err, results) => {
      if (err) {
        console.error("Ошибка при SELECT:", err);
        return res.status(500).send("Ошибка базы данных");
      }

      if (results.rows.length > 0) {
        return res.render("departments", {
          errors: [{ message: "Department already exists" }],
        });
      }

      pool.query(
        `INSERT INTO departments (department_name) VALUES ($1) RETURNING department_id`,
        [department_name],
        (err) => {
          if (err) {
            console.error("Ошибка при INSERT:", err);
            return res.status(500).send("Ошибка базы данных");
          }

          res.send("Department успешно добавлен");
        }
      );
    }
  );
});

module.exports = router;
