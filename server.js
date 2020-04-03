// express
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");

// routes
const user = require("./routes/user");
const dish = require("./routes/dish");
const table = require("./routes/table");
const order = require("./routes/order");
const reservation = require("./routes/reserv");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/user", user);
app.use("/dish", dish);
app.use("/table", table);
app.use("/order", order);
app.use("/reservation", reservation);

app.listen(config.app.port);
