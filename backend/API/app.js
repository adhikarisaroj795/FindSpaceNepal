const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./Routes/index");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

const corsOptions = {
  origin: ["http://127.0.0.1:8081", "http://localhost:8081"],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  Credential: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use(errorMiddleware);

module.exports = app;
