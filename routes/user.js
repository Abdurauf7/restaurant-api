const express = require("express");
const router = express.Router();
const db = require("../database/");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("Restaurant");
const generator = require("generate-password");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

router.get("/", (req, res) => {
  db("users")
    .returning("*")
    .then((userData) => res.send(userData))
    .catch((err) => res.json("error"));
});

// register
router.post("/register", (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    address,
    password,
    phone_number,
    work_position,
    age,
    salary,
    email,
    date,
  } = req.body;

  const encryptedPassword = cryptr.encrypt(password);
  db("users")
    .insert({
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      address: address,
      password: encryptedPassword,
      phone_number: phone_number,
      work_position: work_position,
      age: age,
      salary: salary,
      email: email,
      date: date,
      isAdmin: "FALSE",
    })
    .returning("*")
    .then((data) => res.send({ status: 202 }))
    .catch((err) => res.send({ status: 404 }));
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db("users")
    .where("email", "=", email)
    .returning("*")
    .then((data) => {
      const decryptPass = cryptr.decrypt(data[0].password);
      if (decryptPass === password) {
        return db("users")
          .where("email", "=", email, "password", "=", password)
          .then((info) => {
            if (info[0].isAdmin === true && info[0].email === email) {
              admin = jwt.sign({ email: info[0].email }, config.app.key);
              return res.send({
                status: 200,
                data: info[0].last_name,
                admin: admin,
              });
            } else {
              user = jwt.sign(
                {
                  email: info[0].email,
                },
                config.app.key
              );
              return res.send({
                status: 302,
                data: info[0].last_name,
                user: user,
              });
            }
          });
      } else {
        return res.send({ status: 401 });
      }
    })
    .catch((err) => res.send({ status: 404 }));
});

router.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  db("users")
    .del()
    .where("id", "=", id)
    .then((data) => res.send({ status: 202 }))
    .catch((err) => res.json(err));
});

router.put("/edit", (req, res) => {
  const {
    id,
    first_name,
    last_name,
    gender,
    address,
    phone_number,
    work_position,
    age,
    salary,
    email,
    date,
    isAdmin,
  } = req.body;

  db("users")
    .update({
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      address: address,
      phone_number: phone_number,
      work_position: work_position,
      age: age,
      salary: salary,
      email: email,
      date: date,
      isAdmin: isAdmin,
    })
    .where("id", "=", id)
    .returning("*")
    .then((data) => res.send({ status: 200 }))
    .catch((err) => res.status(404));
});

router.post("/remember", (req, res) => {
  const { email } = req.body;
  const newpassword = generator.generate({
    length: 5,
    numbers: true,
  });
  const encryptedPassword = cryptr.encrypt(newpassword);

  db.transaction((trx) => {
    trx
      .select("password")
      .from("users")
      .where("email", "=", email)
      .update({ password: newpassword })
      .returning("password")
      .then((data) => res.send({ data: data }))

      .then((info) => {
        return trx("users")
          .select("password")
          .from("users")
          .where("email", "=", email)
          .update({ password: encryptedPassword })
          .returning("password")
          .then((info) => res.send("Success"))
          .catch((err) => res.end("err"));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.send("error"));
});

router.put("/cabinet", (req, res) => {
  const {
    id,
    first_name,
    last_name,
    gender,
    address,
    phone_number,
    work_position,
    age,
    salary,
    email,
    password,
    date,
  } = req.body;

  const cryptPassword = cryptr.encrypt(password);
  db("users")
    .where("id", "=", id)
    .update({
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      address: address,
      phone_number: phone_number,
      work_position: work_position,
      age: age,
      salary: salary,
      email: email,
      password: cryptPassword,
      date: date,
    })
    .where("id", "=", id)
    .returning("*")
    .then((data) => res.send({ status: 200 }))
    .catch((err) => res.status(404));
});

module.exports = router;
