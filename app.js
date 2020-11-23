// config env
require('dotenv').config()

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const app = express();

const userRoute = require("./routes/user");
const deckRoute = require("./routes/deck");

// Setup connect mongodb by mongoose mongodb+srv://nodejsapistarter:XDEVbehn3wbLCE0Q@cluster0.gdxyh.mongodb.net/nodejs_api_starter?retryWrites=true&w=majority
mongoose
  .connect("mongodb://localhost/nodejs_api_starter", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected database from mongodb."))
  .catch((error) =>
    console.error(`Connect database is failed with error which is ${error}`)
  );

// Middlewares
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(helmet());

// Routes
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is OK",
  });
});

app.use("/users", userRoute);
app.use("/decks", deckRoute);

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  // response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

// Start the server
const PORT = app.get("PORT") || 3000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
