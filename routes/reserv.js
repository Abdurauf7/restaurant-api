const express = require("express");
const router = express.Router();
const db = require("../database/");

router.get("/", (req, res) => {
  db("reservation")
    .returning("*")
    .then(data => res.send(data))
    .catch(err => res.send({ status: 404 }));
});

router.post("/add", (req, res) => {
  const { table_number, customer_name, seats, date } = req.body;
  db("reservation")
    .returning("*")
    .insert({
      table_number: table_number,
      customer_name: customer_name,
      seats: seats,
      date: date
    })
    .then(data => res.send({ status: 200 }))
    .catch(err => res.send({ status: 404 }));
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db("reservation")
    .del()
    .where("id", "=", id)
    .then(res.send({ status: 200 }))
    .catch(err => res.send({ status: 404 }));
});

router.put("/edit", (req, res) => {
  const { id, table_number, customer_name, seats, date } = req.body;
  db("reservation")
    .update({
      table_number: table_number,
      customer_name: customer_name,
      seats: seats,
      date: date
    })
    .where("id", "=", id)
    .returning("*")
    .then(data => res.send({ status: 200 }))
    .catch(err => res.send({ status: 404 }));
});
module.exports = router;
