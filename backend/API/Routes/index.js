const express = require("express");
const app = express();
const authRoute = require("./auth.route");

app.use("/api/v1/", authRoute);

module.exports = app;
