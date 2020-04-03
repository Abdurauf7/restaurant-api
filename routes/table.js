const express = require("express");
const router = express.Router();
const db = require("../database/");

router.get("/", (req, res) => {
  db("table").then(data => res.json(data));
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db("table")
    .del()
    .where("id", "=", id)
    .then(data => res.send({ status: 200 }))
    .catch(err => res.send({ status: 404 }));
});

router.post("/add", (req, res) => {
  const { table_number, seats, date } = req.body;
  db("table")
    .insert({ table_number: table_number, seats: seats, date: date })
    .then(err => res.send({ status: 200 }))
    .catch(err => res.send({ status: 404 }));
});

router.put("/edit", (req, res) => {
  const { id, table_number, seats, date } = req.body;
  db("table")
    .where("id", "=", id)
    .update({ table_number: table_number, seats: seats, date: date })
    .returning("*")
    .then(data => res.send({ status: 200 }))
    .catch(err => res.send({ status: 404 }));
});
module.exports = router;
