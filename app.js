const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      tilte: "Exercice API",
      version: "1.0.0",
      description: "A simple express api",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "Bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],

  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());

app.use("/api/exercices", require("./routes/exercicesRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

module.exports = app;
