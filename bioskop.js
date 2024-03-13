const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "movdatabase",
});

connection.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/movies", (req, res) => {
  const sql = "SELECT * FROM movies";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to get movies:", err);
      return res.status(500).send("Failed to get movies");
    }
    res.json(results);
  });
});

app.get("/movies/:id", (req, res) => {
  const sql = "SELECT * FROM movies WHERE id = ?";
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error("Failed to get movie:", err);
      return res.status(500).send("Failed to get movie");
    }
    if (results.length === 0) {
      return res.status(404).send("Movie not found");
    }
    res.json(results[0]);
  });
});

app.post("/movies", (req, res) => {
  const sql = "INSERT INTO movies (name, genre, release_date) VALUES (?, ?, ?)";
  connection.query(
    sql,
    [req.body.name, req.body.genre, req.body.releaseDate],
    (err, result) => {
      if (err) {
        console.error("Failed to add movie:", err);
        return res.status(500).send("Failed to add movie");
      }
      res
        .status(201)
        .send({
          id: result.insertId,
          name: req.body.name,
          genre: req.body.genre,
          releaseDate: req.body.releaseDate,
        });
    }
  );
});

app.delete("/movies/:id", (req, res) => {
  const sql = "DELETE FROM movies WHERE id = ?";
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error("Failed to delete movie:", err);
      return res.status(500).send("Failed to delete movie");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Movie not found");
    }
    res.status(204).send();
  });
});

app.put("/movies/:id", (req, res) => {
  const sql =
    "UPDATE movies SET name = ?, genre = ?, release_date = ? WHERE id = ?";
  connection.query(
    sql,
    [req.body.name, req.body.genre, req.body.releaseDate, req.params.id],
    (err, result) => {
      if (err) {
        console.error("Failed to update movie:", err);
        return res.status(500).send("Failed to update movie");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("Movie not found");
      }
      res.status(200).send("Movie updated successfully");
    }
  );
});
