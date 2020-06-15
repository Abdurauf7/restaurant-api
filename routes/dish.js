const express = require("express");
const router = express.Router();
const db = require("../database/");

router.get("/", (req, res) => {
  db("dish").then((data) => res.json(data));
});

router.post("/add", (req, res) => {
  const { name, price, date } = req.body;

  db("dish")
    .insert({ name: name, price: price, date: date })
    .returning("*")
    .then((data) => res.send({ status: 202 }))
    .catch((err) => res.send({ status: 404 }));
});

router.delete("/delete/:id", (req, res) => {
  db("dish")
    .del()
    .where("id", "=", req.params.id)
    .then(res.send({ status: 200 }))
    .catch((err) => res.json("error"));
});

router.put("/edit", (req, res) => {
  const { id, dish, price, date } = req.body;
  db("dish")
    .where("id", "=", id)
    .update({ name: dish, price: price, date: date })
    .returning("*")
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});
module.exports = router;
