const express = require("express");
const router = express.Router();
const db = require("../database/");

router.get("/", (req, res) => {
  db("orders")
    .returning("*")
    .then((data) => res.json(data))
    .catch((err) => res.send({ status: 404 }));
});

router.post("/add", (req, res) => {
  const { table_number, customer_name, dish, price, quantity, time } = req.body;

  db("orders")
    .returning("*")
    .insert({
      table: table_number,
      customer: customer_name,
      ordered_items: dish,
      price: price,
      quantity: quantity,
      time: time,
    })

    .then((data) => res.send({ status: 200 }))
    .catch((err) => res.send({ status: 404 }));
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db("orders")
    .where("id", "=", id)
    .del()
    .returning("*")
    .then((data) => res.send({ status: 200 }))
    .catch((err) => res.send({ status: 404 }));
});

router.put("/update", (req, res) => {
  const {
    id,
    table_number,
    customer_name,
    dish,
    price,
    quantity,
    time,
  } = req.body;

  db("orders")
    .where("id", "=", id)
    .update({
      table: table_number,
      customer: customer_name,
      ordered_items: dish,
      time: time,
      quantity: quantity,
      price: price,
    })
    .returning("*")
    .then((data) => res.send({ status: 200 }))
    .catch((err) => res.send({ status: 404 }));
});
module.exports = router;
