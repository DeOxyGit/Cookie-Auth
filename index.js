const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: "server2.bsthun.com",
  port: "6105",
  user: "lab_mqllk",
  password: "gdyyQDKwFtJBr3V4",
  database: "lab_todo02_m5byvh",
});

app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
  }
});

app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = mysql.format("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  connection.query(sql, [username, password], (err, rows) => {
    if (err) {
      return res.json({
        success: false,
      });
    }

    numRows = rows.length;
    if (numRows != 0) {
      const hashedPassword = rows[0].hashed_password;
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (result) {
          return res.json({
            success: true,
            message: "Login Successful",
          });
        } else {
          return res.json({
            success: false,
            message: "Invalid Password",
          });
        }
      });
    } else {
      return res.json({
        success: false,
        message: "User does not exist in the database",
      });
    }
  });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  let pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/i;
  if (!pattern.test(password)) {
    return res.json({
      success: false,
      message:
        "Password length equals or more than 8 characters. The password contains at least one uppercase, lowercase, and number in the string.",
    });
  } else {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    created_at = date + " " + time;
    updated_at = created_at;
    saltRounds = 10;
    hash = bcrypt.hashSync(password, saltRounds);
    var sql = `INSERT INTO users (username, password, hashed_password, created_at, updated_at) VALUES(?, ?, ?, ?, ?)`;
    connection.query(
      sql,
      [username, password, hash, created_at, updated_at],
      (err, rows) => {
        if (err) {
          return res.json({
            success: false,
            error: err,
            message: "Error occur while register user.",
          });
        }
        return res.json({
          success: true,
          message: "User register successful.",
        });
      }
    );
  }
});