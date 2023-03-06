const express = require("express");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use("/api/exercices", require("./routes/exercicesRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

module.exports = app;
